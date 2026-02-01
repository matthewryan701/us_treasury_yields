from pricing.zero_coupon import zcb
from pricing.forwards import forward_rates
from pricing.swaps import par_swap_rate

def price_instruments(simulation, pricing_request):
    DF = simulation["discount_factors"]
    dt = simulation["time_grid"][1] - simulation["time_grid"][0]

    results = {}

    if pricing_request.zcb_maturities:
        results["zcb"] = {
            T: zcb(DF, dt, T).mean()
            for T in pricing_request.zcb_maturities
        }
    
    if pricing_request.forward_pairs:
        results["forwards"] = {
            f"{T1}x{T2}": forward_rates(
                zcb(DF, dt, T1),
                zcb(DF, dt, T2),
                T1, T2
            ).mean()
            for T1, T2 in pricing_request.forward_pairs
        }

    return results