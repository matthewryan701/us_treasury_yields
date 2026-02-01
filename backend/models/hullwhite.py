import pandas as pd
import os
from dotenv import load_dotenv
from supabase import create_client
import numpy as np
import matplotlib.pyplot as plt
from scipy.interpolate import interp1d, CubicSpline

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

# Assigning parameters for Hull-White model
r0 = df['fed_funds'].iloc[-1] # Short Rate
alpha = 0.05 # Mean Reversion Speed
sigma = 0.1

# Hull-White estimates drift using today's yield curve
maturities = np.array([0.25, 0.5, 1, 2, 3, 5, 7, 10, 20, 30])
zero_rates = np.array([
    df['y_3m'].iloc[-1],
    df['y_6m'].iloc[-1],
    df['y_1y'].iloc[-1],
    df['y_2y'].iloc[-1],
    df['y_3y'].iloc[-1],
    df['y_5y'].iloc[-1],
    df['y_7y'].iloc[-1],
    df['y_10y'].iloc[-1],
    df['y_20y'].iloc[-1],
    df['y_30y'].iloc[-1],
])

yield_curve = (maturities, zero_rates)

def simulate_hull_white(
    r0,
    alpha,
    sigma,
    maturities,
    zero_rates,
    T,
    dt,
    n_paths,
    seed=None
):
    if seed is not None:
        np.random.seed(seed)

    n_steps = int(T / dt)
    time_grid = np.linspace(0, T, n_steps + 1)

    # Allocating array
    rates = np.zeros((n_paths, n_steps + 1))
    rates[:, 0] = r0

    # Random shocks
    Z = np.random.normal(0, 1, size=(n_paths, n_steps))

    # Discount factors from zero rates to translate yields into bond prices
    discount_factors = np.exp(-zero_rates * maturities)

    # Instantaneous forward rates f(0,t)
    log_df = np.log(discount_factors)
    fwd_rates = -np.gradient(log_df, maturities)

    # Time derivative of forward rates
    dfdt = np.gradient(fwd_rates, maturities)

    # Finding the drift 
    theta_t = dfdt + alpha * fwd_rates + (sigma**2 / (2 * alpha)) * (1 - np.exp(-2 * alpha * maturities))

    # Interpolating theta t to align with simulation grid
    theta_fn = interp1d(
    maturities,
    theta_t,
    kind="cubic",
    fill_value="extrapolate")

    # Euler simulation for short-rate paths
    for t in range(n_steps):
        rt = rates[:, t]

        drift = (theta_fn(time_grid[t]) - alpha * rt) * dt
        diffusion = sigma * np.sqrt(dt) * Z[:, t]

        rates[:, t + 1] = rt + drift + diffusion

    return rates

rates = simulate_hull_white(
    r0=r0,
    alpha=alpha,
    sigma=sigma,
    maturities=maturities,
    zero_rates=zero_rates,
    T=5.0,
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