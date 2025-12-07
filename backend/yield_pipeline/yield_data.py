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
    "1M": "DGS1MO",
    "3M": "DGS3MO",
    "6M": "DGS6MO",
    "1Y": "DGS1",
    "2Y": "DGS2",
    "3Y": "DGS3",
    "5Y": "DGS5",
    "7Y": "DGS7",
    "10Y": "DGS10",
    "20Y": "DGS20",
    "30Y": "DGS30",
}

ADDITIONALS = {
    "FedFunds": "FEDFUNDS"
}

DATA = {**TREASURY_MATURITIES, **ADDITIONALS}

def download_fred_series(series_dict):
    df = pd.DataFrame()
    for name, series_id in series_dict.items():
        df[name] = fred.get_series(series_id=series_id)
    return df

df = download_fred_series(DATA)

# Data Cleaning 

# Creating Date Column
df.reset_index(inplace=True)
df.rename(columns={"index": "Date"}, inplace=True)

# Forward filling null values
df["FedFunds"] = df["FedFunds"].ffill()
# Dealing with the 1 NaN value at the start 
df["FedFunds"] = df["FedFunds"].bfill()

cols = ['1M', '3M', '6M', '1Y', '2Y', '3Y', '5Y', '7Y', '10Y', '20Y', '30Y']
df[cols] = df[cols].ffill()

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

# Uploading to Supabase
data = df.to_dict(orient="records")

# Uploading and skipping over duplicate values
print("Uploading")
supabase.table("yield_curve_data").upsert(data,
                                          on_conflict="date",
                                          ignore_duplicates=True).execute()
print("Uploaded")