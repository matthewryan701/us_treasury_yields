import pandas as pd
import os
from dotenv import load_dotenv
from supabase import create_client
import numpy as np
import matplotlib.pyplot as plt

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
df = df.sort_index()

# Assigning parameters for Vasicek mode
r0 = df['fed_funds'].iloc[-1] # Short Rate
theta = df['y_10y'].tail(252).mean() # 10Y Treasury Yield Annual Trading Day Average
sigma = (df['fed_funds'].diff().dropna().std()) * np.sqrt(252) # Annual Trading Day Interest Rate Volatility
kappa = 0.3 # Mean Reversion Speed

# Simulating Vasicek Paths
def simulate_vasicek(
        r0: float,
        kappa: float,
        theta: float,
        sigma: float,
        T: float,
        dt: float,
        n_paths: int,
        seed: int | None = None,
):
    
    if seed is not None:
        np.random.seed(seed)

    n_steps = int(T / dt)

    # Allocating array
    rates = np.zeros((n_paths, n_steps + 1))
    rates[:, 0] = r0

    # Random shocks
    Z = np.random.normal(0.0, 1.0, size=(n_paths, n_steps))

    for t in range(n_steps):
        rt = rates[:, t]

        drift = kappa * (theta - rt) * dt
        diffusion = sigma * np.sqrt(dt) * Z[:, t]

        rates[:, t + 1] = rt + drift + diffusion

    return rates 

rates = simulate_vasicek(
    r0=r0,
    kappa=kappa,
    theta=theta,
    sigma=sigma,
    T=5,
    dt=1/252,
    n_paths=50,
    seed=42
)

time = np.linspace(0, 5, rates.shape[1])

plt.figure(figsize=(10, 6))
plt.plot(time, rates.T, alpha=0.6)
plt.xlabel("Time (years)")
plt.ylabel("Short Rate")
plt.title("Vasicek Short-Rate Simulations")
plt.show()