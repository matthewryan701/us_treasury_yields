from supabase import create_client
import os
from dotenv import load_dotenv
import pandas as pd

# Initialising Supabase HTTPS connection
load_dotenv()

HOST = os.getenv("SUPABASE_HOST")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(f"https://{HOST}", KEY)

# Selecting latest record from Supabase
latest = (
    supabase.table("yield_curve_data")
    .select("*")
    .order("date", desc=True)
    .limit(1)
    .execute()
    .data[0]
)

df = pd.DataFrame([latest])  

row = df.iloc[0]    

# Engineering spreads
spread_2s10s = row['y_10y'] - row['y_2y']
spread_3m10y = row['y_10y'] - row['y_3m']
spread_5s30s = row['y_30y'] - row['y_5y']

# Engineering inversion
inversion_2s10s = bool(spread_2s10s < 0)
inversion_3m10y = bool(spread_3m10y < 0)
inversion_5s30s = bool(spread_5s30s < 0)

# Engineering curvature
curvature = (row['y_2y'] + row['y_10y']) / 2 - row['y_5y']

print("Uploading.")
supabase.table("yield_curve_data") \
    .update({
        "2s10s": spread_2s10s,
        "3m10y": spread_3m10y,
        "5s30s": spread_5s30s,
        "2s10s_inversion": inversion_2s10s,
        "3m10y_inversion": inversion_3m10y,
        "5s30s_inversion": inversion_5s30s,
        "curvature": curvature
        }) \
    .eq("date", row["date"]) \
    .execute()
print("Uploaded.")