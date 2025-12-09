from fredapi import Fred
import pandas as pd
import ssl, certifi
import plotly.graph_objects as go
import os
from dotenv import load_dotenv
from supabase import create_client

# Creating SSL Context for FRED API
ssl_context = ssl.create_default_context(cafile=certifi.where())

# Initialising Supabase HTTPS connection
load_dotenv()

HOST = os.getenv("SUPABASE_HOST")
fred = Fred(api_key=os.getenv("FRED_API_KEY"))

url = f"https://{HOST}"
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(url, key)

# Importing US-Treasury yield data from the FRED API
TREASURY_MATURITIES = {
    "1M": ("DGS1MO", "daily"),
    "3M": ("DGS3MO", "daily"),
    "6M": ("DGS6MO", "daily"),
    "1Y": ("DGS1", "daily"),
    "2Y": ("DGS2", "daily"),
    "3Y": ("DGS3", "daily"),
    "5Y": ("DGS5", "daily"),
    "7Y": ("DGS7", "daily"),
    "10Y": ("DGS10", "daily"),
    "20Y": ("DGS20", "daily"),
    "30Y": ("DGS30", "daily"),
}

ADDITIONALS = {
    "FedFunds": ("FEDFUNDS", "daily")
}

DATA = {**TREASURY_MATURITIES, **ADDITIONALS}

def download_fred_series(series_dict):
    df_list = []
    for name, (series_id, freq) in series_dict.items():
        series = fred.get_series(series_id=series_id)
        series.index = pd.to_datetime(series.index)

        s = pd.DataFrame(series, columns=[name])
        s[name] = series

        if freq == "daily":
            s = s.resample("D").ffill()
        
        df_list.append(s)
    
    df = pd.concat(df_list, axis=1)

    df = df.ffill()

    return df

df = download_fred_series(DATA)

# Forward filling to today's date
full_range = pd.date_range(
    start=df.index.min(), 
    end=pd.Timestamp.utcnow().normalize().replace(tzinfo=None), 
    freq="D"
)

df = df.reindex(full_range).rename_axis("date").reset_index()

# Dealing with the 1 NaN FedFunds value at the start 
df["FedFunds"] = df["FedFunds"].bfill()

df = df.ffill()

# Renaming columns to match Supabase schema
df = df.rename(columns={
    "Date": "date",
    "1M": "y_1m",
    "3M": "y_3m",
    "6M": "y_6m",
    "1Y": "y_1y",
    "2Y": "y_2y",
    "3Y": "y_3y",
    "5Y": "y_5y",
    "7Y": "y_7y",
    "10Y": "y_10y",
    "20Y": "y_20y",
    "30Y": "y_30y",
    "FedFunds": "fed_funds"
})

# Formatting date column
df["date"] = pd.to_datetime(df["date"]).dt.tz_localize("UTC")
df["date"] = df["date"].dt.strftime("%Y-%m-%dT%H:%M:%SZ")

df = df.dropna()

# Uploading to Supabase
data = df.to_dict(orient="records")

# Uploading and skipping over duplicate values
print("Uploading")
supabase.table("yield_curve_data").upsert(data,
                                          on_conflict="date",
                                          ignore_duplicates=True).execute()
print("Uploaded")