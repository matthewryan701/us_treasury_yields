from supabase import create_client
import os
from dotenv import load_dotenv
import pandas as pd

# Initialising Supabase HTTPS connection
load_dotenv()

HOST = os.getenv("SUPABASE_HOST")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(f"https://{HOST}", KEY)

# Selecting table
rows = []
offset = 0
page_size = 1000

while True:
    response = supabase.table("yield_curve_data").select("*").range(offset, offset + page_size - 1).execute()
    if not response.data:
        break
    rows.extend(response.data)
    offset += page_size
df = pd.DataFrame(rows)

# Engineering spreads
df['2s10s'] = df['y_10y'] - df['y_2y']
df['3m10y'] = df['y_10y'] - df['y_3m']
df['5s30s'] = df['y_30y'] - df['y_5y']

# Engineering inversion
df['2s10s_inversion'] = df['2s10s'] < 0
df['3m10y_inversion'] = df['3m10y'] < 0
df['5s30s_inversion'] = df['5s30s'] < 0

# Engineering curvature
df['curvature'] = (df['y_2y'] + df['y_10y']) / 2 - df['y_5y']

for _, row in df.iterrows():
    supabase.table("yield_curve_data") \
        .update({
            "2s10s": row["2s10s"],
            "3m10y": row["3m10y"],
            "5s30s": row["5s30s"],
            "2s10s_inversion": row["2s10s_inversion"],
            "3m10y_inversion": row["3m10y_inversion"],
            "5s30s_inversion": row["5s30s_inversion"],
            "curvature": row["curvature"]
        }) \
        .eq("date", row["date"]) \
        .execute()