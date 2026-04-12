from models.vasicek import simulate_vasicek
from models.cir import simulate_cir
from models.hullwhite import simulate_hull_white
from models.holee import simulate_ho_lee
import numpy as np

MODEL_MAP = {
    "vasicek": simulate_vasicek,
    "cir": simulate_cir,
    "hull_white": simulate_hull_white,
    "ho_lee": simulate_ho_lee,
}


def simulate_rates(model_name, params):
    simulate = MODEL_MAP[model_name]
    rates = simulate(**params)

    T = params["T"]
    dt = params["dt"]
    time_grid = np.linspace(0, T, rates.shape[1])

    discount_factors = np.exp(-np.cumsum(rates * dt, axis=1))

    return {
        "rates": rates,
        "time_grid": time_grid,
        "discount_factors": discount_factors,
    }