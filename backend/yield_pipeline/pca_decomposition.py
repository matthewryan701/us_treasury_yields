import pandas as pd
import os
from dotenv import load_dotenv
from supabase import create_client
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

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

df.set_index("date", inplace=True)

# Filtering for nominal US-treasuries to run the PCA on
maturities = df[['y_1m','y_3m','y_6m','y_1y','y_2y','y_3y','y_5y','y_7y','y_10y','y_20y','y_30y']]

scaler = StandardScaler()
yields_scaled = scaler.fit_transform(maturities)

pca = PCA(n_components=3)
pca_result = pca.fit_transform(yields_scaled)

df['PC1'] = pca_result[:,0]  
df['PC2'] = pca_result[:,1] 
df['PC3'] = pca_result[:,2]

row = df.iloc[-1]
print("Uploading.")
# Uploading to Principal Components to Supabase
supabase.table("yield_curve_data") \
        .update({
            "PC1": row["PC1"],
            "PC2": row["PC2"],
            "PC3": row["PC3"],
        }) \
        .eq("date", row.name) \
        .execute()
print("Uploaded.")