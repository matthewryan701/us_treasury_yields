from backend.models.vasicek import simulate_vasicek
from models.cir import simulate_cir
from models.hullwhite import simulate_hull_white
from models.holee import simulate_ho_lee
import numpy as np

MODEL_MAP = {
    "vasicek": simulate_vasicek,
    "cir": simulate_cir,
    "hull_white": simulate_hull_white,
    "ho_lee": simulate_ho_lee
}

# Simulating short rate paths
def simulate_rates(model_name, params):
    simulate = MODEL_MAP[model_name]
    rates, time_grid = simulate(**params)

    dt = time_grid[1] - time_grid[0]
    discount_factors = np.exp(-np.cumsum(rates * dt, axis=1))

    # Returning dictionary with simulated paths, time grid and discount factors
    return {
        "rates": rates,
        "time_grid": time_grid,
        "discount_factors": discount_factors
    }

params = {
    "r0": 0.038,        # 3.8% Fed Funds
    "kappa": 0.3,       # mean reversion speed
    "theta": 0.04,      # long-run mean
    "sigma": 0.1,       # volatility
    "T": 30.0,          # 30 years
    "dt": 1/252,        # daily steps
    "n_paths": 500,
    "seed": 42
}

simulation = simulate_rates("vasicek", params)

print(simulation)