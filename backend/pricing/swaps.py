import numpy as np

def par_swap_rate(DF, payment_times, maturity, dt):
    payment_indices = (np.array(payment_times) / dt).astype(int)
    maturity_index = int(maturity / dt)

    alpha = np.diff([0] + payment_times)

    fixed_leg = np.sum(alpha * DF[:, payment_indices], axis=1)
    floating_leg = 1 - DF[:, maturity_index]

    return np.mean(floating_leg) / np.mean(fixed_leg)
