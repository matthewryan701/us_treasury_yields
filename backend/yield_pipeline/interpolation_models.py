import pandas as pd
import os
from dotenv import load_dotenv
from supabase import create_client
import numpy as np
from scipy.interpolate import interp1d, CubicSpline
from scipy.optimize import least_squares
import time

# Initialising Supabase HTTPS connection
load_dotenv()

HOST = os.getenv("SUPABASE_HOST")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(f"https://{HOST}", KEY)

# Selecting table
rows = []
offset = 0
page_size = 1000

response = (
    supabase
    .table("yield_curve_data")
    .select("*")
    .order("date", desc=True)
    .limit(1)
    .execute()
    )
if not response.data:
    raise RuntimeError("No yield data found")
    
df = pd.DataFrame(response.data)

df['date'] = pd.to_datetime(df['date'], utc=True)

# Turning the df into long format 
MATURITY_MAP = {
    "y_1m": 1/12,
    "y_3m": 3/12,
    "y_6m": 6/12,
    "y_1y": 1,
    "y_2y": 2,
    "y_3y": 3,
    "y_5y": 5,
    "y_7y": 7,
    "y_10y": 10,
    "y_20y": 20,
    "y_30y": 30,
}

yield_cols = list(MATURITY_MAP.keys())
df_yields = df[["date"] + yield_cols].copy()

df_long = df_yields.melt(
    id_vars="date",
    value_vars=yield_cols,
    var_name="tenor",
    value_name="yield"
)

df_long["maturity_years"] = df_long["tenor"].map(MATURITY_MAP)

df_long = (
    df_long
    .dropna(subset=["yield"])
    .sort_values(["date", "maturity_years"])
    .reset_index(drop=True)
)

df_long = df_long[["date", "maturity_years", "yield"]]

# Fitting interpolation models for each date

def nelson_siegel(m, beta0, beta1, beta2, tau):

    m = np.asarray(m)
    t = m / tau
    factor1 = (1 - np.exp(-t)) / t
    factor2 = factor1 - np.exp(-t)
    
    return beta0 + beta1 * factor1 + beta2 * factor2

def nelson_siegel_svensson(m, beta0, beta1, beta2, beta3, tau1, tau2):
    
    m = np.asarray(m)
    t1 = m / tau1
    t2 = m / tau2

    factor1 = (1 - np.exp(-t1)) / t1
    factor2 = factor1 - np.exp(-t1)
    factor3 = (1 - np.exp(-t2)) / t2 - np.exp(-t2)

    return beta0 + beta1 * factor1 + beta2 * factor2 + beta3 * factor3

def rmse(y_true, y_pred):
    return np.sqrt(np.mean((y_true - y_pred) ** 2))

def fit_interpolation_models(
        df_long: pd.DataFrame,
        date: pd.Timestamp,
        maturity_grid: np.ndarray = np.arange(0.25, 30.01, 0.25)
        ):
    
    # Filter by date and check sufficient rows
    df_d = (
        df_long[df_long["date"] == date]
        .sort_values("maturity_years")
        .reset_index(drop=True)
    )

    m_obs = df_d["maturity_years"].values
    y_obs = df_d["yield"].values

    if len(m_obs) < 6:
        raise ValueError("Insufficient maturities for stable fitting")
    
    # Linear Interpolation Model
    linear = interp1d(m_obs, y_obs, kind='linear', fill_value='extrapolate')
    y_linear = linear(maturity_grid)
    rmse_linear = rmse(y_obs, linear(m_obs))

    # Cubic Spline
    cubic = CubicSpline(m_obs, y_obs, bc_type='natural')
    y_cubic = cubic(maturity_grid)
    rmse_cubic = rmse(y_obs, cubic(m_obs))

    # Nelson-Siegel
    def ns_resid(p):
        return nelson_siegel(m_obs, *p) - y_obs
    
    p0_ns = [
        y_obs[-1],                 # beta0
        y_obs[0] - y_obs[-1],      # beta1
        0.0,                       # beta2
        1.0,                       # tau
    ]

    bounds_ns = (
        [-5, -10, -10, 0.05],
        [10, 10, 10, 10],
    )

    res_ns = least_squares(ns_resid, p0_ns, bounds=bounds_ns)
    beta0, beta1, beta2, tau = res_ns.x

    y_ns = nelson_siegel(maturity_grid, beta0, beta1, beta2, tau)
    rmse_ns = rmse(y_obs, nelson_siegel(m_obs, beta0, beta1, beta2, tau))

    # Nelson-Siegel Svensson
    def nss_resid(p):
        return nelson_siegel_svensson(m_obs, *p) - y_obs
    
    p0_nss = [
        beta0,
        beta1,
        beta2,
        0.0,    # beta3
        tau,
        3.0,
    ]

    bounds_nss = (
        [-5, -10, -10, -10, 0.05, 0.05],
        [10, 10, 10, 10, 10, 20],
    )

    res_nss = least_squares(nss_resid, p0_nss, bounds=bounds_nss)
    b0, b1, b2, b3, t1, t2 = res_nss.x

    y_nss = nelson_siegel_svensson(maturity_grid, b0, b1, b2, b3, t1, t2)
    rmse_nss = rmse(
        y_obs,
        nelson_siegel_svensson(m_obs, b0, b1, b2, b3, t1, t2),
    )

    # Output all curves into a dataframe
    curves_df = pd.concat(
        [
            pd.DataFrame(
                {
                    "date": date,
                    "model_type": model,
                    "maturity_years": maturity_grid,
                    "fitted_yield": y,
                }
            )
            for model, y in [
                ("linear", y_linear),
                ("cubic_spline", y_cubic),
                ("nelson_siegel", y_ns),
                ("nelson_siegel_svensson", y_nss),
            ]
        ],
        ignore_index=True,
    )

    # Output all parameters into a dataframe
    params_df = pd.DataFrame(
        [
            ("linear", rmse_linear, None, None, None, None, None),
            ("cubic_spline", rmse_cubic, None, None, None, None, None),
            ("nelson_siegel", rmse_ns, beta0, beta1, beta2, None, tau),
            ("nelson_siegel_svensson", rmse_nss, b0, b1, b2, b3, t1),
        ],
        columns=[
            "model_type",
            "rmse",
            "beta0",
            "beta1",
            "beta2",
            "beta3",
            "tau",
        ],
    )

    params_df["date"] = date

    return curves_df, params_df

all_curves = []
all_params = []

today = df_long["date"].iloc[0]
curves_df, params_df = fit_interpolation_models(df_long, today)

# Uploading interpolation to Supabase

curves_df['date'] = curves_df['date'].dt.strftime("%Y-%m-%dT%H:%M:%SZ")

# Replace NaN / inf everywhere else
curves_df = (
    curves_df
    .replace([np.nan, np.inf, -np.inf], None)
    .astype(object)
)


data = curves_df.to_dict(orient="records")

print("Uploading Interpolation Models")

supabase.table("interpolation_models") \
    .upsert(
        data,
        on_conflict="date,model_type,maturity_years",
        returning="minimal"
    ) \
    .execute()

print("Uploaded interpolation models")

# Uploading parameters to Supabase

params_df['date'] = pd.to_datetime(params_df['date'], utc=True)
params_df['date'] = params_df['date'].dt.strftime("%Y-%m-%dT%H:%M:%SZ")

# Replace NaN / inf everywhere else
params_df = (
    params_df
    .replace([np.nan, np.inf, -np.inf], None)
    .astype(object)
)

data = params_df.to_dict(orient="records")

print("Uploading parameters")

supabase.table("interpolation_model_parameters") \
    .upsert(
        data,
        on_conflict="date,model_type",
        returning="minimal"
    ) \
    .execute()
    
print(f"Uploaded parameters")