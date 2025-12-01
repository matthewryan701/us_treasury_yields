from fredapi import Fred
import pandas as pd
import ssl, certifi

ssl_context = ssl.create_default_context(cafile=certifi.where())

fred = Fred(api_key="71aecb6dedf49b459fc19a63dced7582")

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
    # Volume-weighted median interest rate (FedFunds)
    "FedFunds": "FEDFUNDS",
    # NBER Recession Indicator
    "Recession": "USREC",
    # Treasury Inflation-Protected Securities (TIPS)
    "TIPS_5Y": "DFII5",
    "TIPS_10Y": "DFII10",
    "TIPS_30Y": "DFII30",
}

def download_fred_series(series_dict):
    df = pd.DataFrame()
    for name, series_id in series_dict.items():
        df[name] = fred.get_series(series_id=series_id)
    return df

df = download_fred_series(TREASURY_MATURITIES)

print(df)