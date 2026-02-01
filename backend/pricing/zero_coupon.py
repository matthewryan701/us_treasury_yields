import numpy as np

# Calculates Zero-Coupon Bond Price For Each Simulated Interest Rate
def zcb(rates, dt, maturity):

    n_steps = int(maturity / dt)

    integral = np.sum(rates[:, :n_steps,] * dt, axis=1)

    prices = np.exp(-integral)

    return prices