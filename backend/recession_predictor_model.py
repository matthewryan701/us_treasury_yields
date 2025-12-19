from supabase import create_client
import os
from dotenv import load_dotenv
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
import statsmodels.api as smf
from xgboost import XGBClassifier
from sklearn.metrics import roc_auc_score, accuracy_score, recall_score

# Initialising Supabase HTTPS connection
load_dotenv()

HOST = os.getenv("SUPABASE_HOST")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(f"https://{HOST}", KEY)

# Selecting table
rows = []
offset = 0
page_size = 1000

# Function to fetch data from Supabase
def fetch_table(table_name):
    rows = []
    offset = 0
    page_size = 1000

    while True:
        response = (
            supabase.table(table_name)
            .select("*")
            .range(offset, offset + page_size - 1)
            .execute()
        )
        if not response.data:
            break
        rows.extend(response.data)
        offset += page_size

    return pd.DataFrame(rows)

df_yields = fetch_table("yield_curve_data")
df_macro = fetch_table("macro_indicators")

df_yields["date"] = pd.to_datetime(df_yields["date"])
df_macro["date"] = pd.to_datetime(df_macro["date"])

# Inner joining 
df = pd.merge(df_yields, df_macro, on="date", how="inner")
df = df.sort_values("date", ascending=True).reset_index(drop=True)

# Computing lagged features
df['3m10y_lag'] = df['3m10y'].shift(30)
df['unemployment_lag'] = df['unemployment'].shift(30)
df['cpi_lag'] = df['cpi_yoy'].shift(91)

df = df.dropna()

print(df.head(10))
print(df.tail(10))

FEATURES = ['PC1', 'PC2', 'PC3', '3m10y', 'cpi_yoy', 'gdp', 'unemployment', 'jolts',
            'credit_spread', 'housing_starts', '3m10y_lag', 'unemployment_lag', 'cpi_lag']

for col in FEATURES + ['nber']:
    df[col] = pd.to_numeric(df[col], errors='coerce')


HORIZONS = {
    '3m': 91,
    '6m': 182,
    '12m': 365
    }

def create_target(df, days):
    return (
        df['nber'][::-1]
        .rolling(days)
        .max()
        [::-1]
        .shift(-1)
    )

def get_monthly_retrain_dates(df, start_date):
    dates = (
        df.loc[df['date'] >= start_date, 'date']
        .dt.to_period('M')
        .drop_duplicates()
        .dt.to_timestamp()
    )
    return list(dates)

def get_models():
    return {
        'logistic_regression': Pipeline([
            ('scaler', StandardScaler()),
            ('model', LogisticRegression(max_iter=3000))
        ]),
        'xgboost': XGBClassifier(
            eval_metric='logloss'
        ),
        'random_forest': RandomForestClassifier(n_estimators=300),
        'naive_bayes': GaussianNB()
    }

INITIAL_TRAIN_END = pd.Timestamp("2011-12-31", tz='UTC')
PREDICTION_START = pd.Timestamp("2012-01-01", tz='UTC')

weights = {
    'logistic_regression': 0.30,
    'xgboost': 0.25,
    'random_forest': 0.25,
    'naive_bayes': 0.20
}

retrain_dates = get_monthly_retrain_dates(df, PREDICTION_START)

retrain_dates = [pd.Timestamp("2012-01-01", tz='UTC')]

all_predictions = []

for i, retrain_date in enumerate(retrain_dates):

    print(f"Retraining models on {retrain_date.date()}")

    next_retrain_date = (
        retrain_dates[i + 1]
        if i + 1 < len(retrain_dates)
        else df['date'].max() + pd.Timedelta(days=1)
    )

    train_df = df[df['date'] <= retrain_date].copy()

    print("\n==============================")
    print(f"RETRAIN DATE: {retrain_date}")
    print(f"TRAIN END: {train_df['date'].max()}")
    print(f"TRAIN SIZE: {len(train_df)}")

    for horizon, days in HORIZONS.items():

        train_df[f'target_{horizon}'] = create_target(train_df, days)
        train_df = train_df.dropna(subset=[f'target_{horizon}'])

        X_train = train_df[FEATURES]
        y_train = train_df[f'target_{horizon}']

        # --- Train sklearn models ---
        models = get_models()
        trained_models = {}

        print(f"\nHORIZON: {horizon}")
        print(f"Target positives: {train_df[f'target_{horizon}'].sum()}")
        print(X_train.info())


        for name, model in models.items():
            model.fit(X_train, y_train)
            trained_models[name] = model

        # --- Prediction window ---
        pred_df = (
            df[df['date'] >= retrain_date]
            .head(10)
            .copy()
            )
        
        for _, row in pred_df.iterrows():
            X_row = (
                df.loc[df["date"] == retrain_date, FEATURES]
                .iloc[:1]                     # ensure single row
                .astype(X_train.dtypes.to_dict())
                )
            
            assert (X_row.dtypes == X_train.dtypes).all(), "Feature dtype mismatch!"

            row_preds = {}

            for name, model in trained_models.items():
                row_preds[name] = model.predict_proba(X_row)[0, 1]

            # Composite
            composite = sum(
                weights[m] * row_preds[m]
                for m in weights
            )

            for model_name, prob in row_preds.items():
                all_predictions.append({
                    'date': row['date'],
                    'retrain_date': retrain_date,
                    'horizon': horizon,
                    'model_name': model_name,
                    'probability': float(prob)
                })

            all_predictions.append({
                'date': row['date'],
                'retrain_date': retrain_date,
                'horizon': horizon,
                'model_name': 'composite',
                'probability': float(composite)
            })

predictions_df = pd.DataFrame(all_predictions)

print(predictions_df.shape)
print(predictions_df.head(10))
print(predictions_df.tail(10))
