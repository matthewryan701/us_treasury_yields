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

# Importing macroeconomic indicators from FRED API
MACRO_INDICATORS = {
    "CPI_YoY": "CPIAUCSL",           # Consumer Price Index, All Urban Consumers, Seasonally-Adjusted
    "CPI_MoM": "CPIAUCSL",
    "PCE": "PCE",                     # Personal Consumption Expenditures
    "PPI": "PPIACO",                   # Producer Price Index, All Commodities
    "GDP": "GDP",                  # Gross Domestic Product, quarterly
    "UNEMPLOYMENT": "UNRATE",          # Unemployment Rate
}

def download_fred_series(series_dict):
    df = pd.DataFrame()
    for name, series_id in series_dict.items():
        series = fred.get_series(series_id=series_id)
        if name == "CPI_YoY":
            df[name] = series.pct_change(12) * 100
        elif name == "CPI_MoM":
            df[name] = series.pct_change(1) * 100
        elif name == "PPI":
            df[name] = series.pct_change(1) * 100
        elif name == "GDP":
            df[name] = series.pct_change(1) * 100
        else:
            df[name] = series
    
    return df
        
df = download_fred_series(MACRO_INDICATORS)

df = df.dropna(how="all", subset=["PCE"])

df = df.ffill()

# Creating Date Column
df.reset_index(inplace=True)
df.rename(columns={"index": "Date"}, inplace=True)

df = df.rename(columns={
    "Date":"date",
    "CPI_YoY":"cpi_yoy",
    "CPI_MoM":"cpi_mom",
    "PCE":"pce",
    "PPI":"ppi",
    "GDP":"gdp",
    "UNEMPLOYMENT":"unemployment"
})

def month_to_quarter(date):
    month = date.month
    year = date.year
    quarter = (month - 1) // 3 + 1
    return f"Q{quarter} {year}"

df["quarter"] = df["date"].apply(month_to_quarter)

# Formatting date column
df["date"] = pd.to_datetime(df["date"]).dt.tz_localize("UTC")
df["date"] = df["date"].dt.strftime("%Y-%m-%dT%H:%M:%SZ")

print(df.info())
print(df.tail(10))

# Uploading to Supabase
data = df.to_dict(orient="records")

# Uploading and skipping over duplicate values
print("Uploading")
supabase.table("macro_indicators").upsert(data,
                                          on_conflict="date",
                                          ignore_duplicates=True).execute()
print("Uploaded")