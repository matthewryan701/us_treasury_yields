import numpy as np

def forward_rates(P_T1, P_T2, T1, T2):

    return (np.log(P_T1) - np.log(P_T2)) / (T2 - T1)
