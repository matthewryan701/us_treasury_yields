import pandas as pd
import os
from dotenv import load_dotenv
from supabase import create_client
import numpy as np

# Initialising Supabase HTTPS connection
load_dotenv()

HOST = os.getenv("SUPABASE_HOST")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(f"https://{HOST}", KEY)

# Loading last 5 yield_curve_data table from Supabase
response = (
    supabase.table("yield_curve_data")
    .select("*")
    .order("date", desc=True)
    .limit(5)
    .execute()
)

df = pd.DataFrame(response.data)
df.set_index("date", inplace=True)
df = df.sort_index()

# Filtering for coupon paying Treasuries
df = df[['y_1y','y_2y','y_3y','y_5y','y_7y','y_10y','y_20y','y_30y']]

# Maturity mapping: column name -> years to maturity
MATURITIES = {
    'y_1y': 1, 'y_2y': 2, 'y_3y': 3, 'y_5y': 5,
    'y_7y': 7, 'y_10y': 10, 'y_20y': 20, 'y_30y': 30
}

# Function to calculate Macauley and modified duration
def calculate_duration(ytm_pct, years, freq=2):

    # Calculating yield-to-maturity, coupon rate, yield rate and number of payments
    ytm = ytm_pct / 100
    c = ytm / freq           
    y = ytm / freq           
    n = int(years * freq)    

    # Summing weighted present values and raw present values
    pv_weighted = 0
    pv_total = 0
    for t in range(1, n + 1):
        cf = c * 100 + (100 if t == n else 0)
        pv = cf / (1 + y) ** t
        pv_weighted += t * pv
        pv_total += pv

    # Macaulay Duration formula in years
    mac_duration = (pv_weighted / pv_total) / freq
    mod_duration = mac_duration / (1 + y)

    return mac_duration, mod_duration

# Calculate duration for each maturity at each date
for col, years in MATURITIES.items():
    label = col.replace('y_', '')

    mac_col = f'mac_dur_{label}'
    mod_col = f'mod_dur_{label}'

    durations = df[col].apply(lambda ytm: calculate_duration(ytm, years))

    df[mac_col] = durations.apply(lambda x: x[0])
    df[mod_col] = durations.apply(lambda x: x[1])

# Converting df into tall format - same as Supabase schema
MATURITY_MAP = {
    '1y': '1Y', '2y': '2Y', '3y': '3Y', '5y': '5Y',
    '7y': '7Y', '10y': '10Y', '20y': '20Y', '30y': '30Y'
}

df = df.reset_index()

# Melting Yields
yields = df.melt(
    id_vars='date',
    value_vars=[f'y_{m}' for m in MATURITY_MAP],
    var_name='maturity',
    value_name='yield'
)
yields['maturity'] = yields['maturity'].str.replace('y_', '').map(MATURITY_MAP)

# Melting Macauley duration
mac = df.melt(
    id_vars='date',
    value_vars=[f'mac_dur_{m}' for m in MATURITY_MAP],
    var_name='maturity',
    value_name='macaulay_duration'
)
mac['maturity'] = mac['maturity'].str.replace('mac_dur_', '').map(MATURITY_MAP)

# Melting Modified duration
mod = df.melt(
    id_vars='date',
    value_vars=[f'mod_dur_{m}' for m in MATURITY_MAP],
    var_name='maturity',
    value_name='modified_duration'
)
mod['maturity'] = mod['maturity'].str.replace('mod_dur_', '').map(MATURITY_MAP)

# Merging yields + mac + mod on date + maturity
df = yields.merge(mac, on=['date', 'maturity']).merge(mod, on=['date', 'maturity'])
df = df.sort_values(['date', 'maturity']).reset_index(drop=True)

# Uploading to Supabase 
data = df.to_dict(orient="records")

print("Uploading")
supabase.table("treasury_duration").upsert(data,
                                          on_conflict="date, maturity",
                                          ignore_duplicates=True).execute()
print("Uploaded")