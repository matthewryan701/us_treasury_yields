from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

from utils.requests import (
    SimulationRequest,
    PricingRequest,
    SimulateAndPriceRequest,
)
from utils.responses import (
    SimulationResponse,
    PricingResponse,
    SimulateAndPriceResponse,
    ZCBResult,
    ForwardResult,
    SwapResult,
)
from api.simulate import simulate_rates
from api.pricing import price_instruments

app = FastAPI(
    title="Short-Rate Simulation API",
    description="Monte-Carlo short-rate models (Vasicek, CIR, Hull-White, Ho-Lee) with ZCB / forward / swap pricing.",
    version="0.1.0",
)

# Allow your V0 frontend to call this
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to your V0 domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── helpers ──────────────────────────────────────────────────────────────

def _build_model_params(req: SimulationRequest) -> dict:
    """Translate the flat request into the kwargs each model function expects."""
    common = dict(
        r0=req.r0,
        sigma=req.sigma,
        T=req.T,
        dt=req.dt,
        n_paths=req.n_paths,
        seed=req.seed,
    )

    if req.model in ("vasicek", "cir"):
        if req.kappa is None or req.theta is None:
            raise HTTPException(
                status_code=422,
                detail=f"{req.model} requires 'kappa' and 'theta'.",
            )
        common["kappa"] = req.kappa
        common["theta"] = req.theta

    elif req.model == "hull_white":
        if req.alpha is None or req.yield_curve is None:
            raise HTTPException(
                status_code=422,
                detail="hull_white requires 'alpha' and 'yield_curve'.",
            )
        common["alpha"] = req.alpha
        common["maturities"] = np.array(req.yield_curve.maturities)
        common["zero_rates"] = np.array(req.yield_curve.zero_rates)

    elif req.model == "ho_lee":
        if req.yield_curve is None:
            raise HTTPException(
                status_code=422,
                detail="ho_lee requires 'yield_curve'.",
            )
        common["maturities"] = np.array(req.yield_curve.maturities)
        common["zero_rates"] = np.array(req.yield_curve.zero_rates)

    return common


N_SAMPLE_PATHS = 20  # how many individual paths to send to the frontend


def _summarise(simulation: dict, req: SimulationRequest) -> SimulationResponse:
    """Condense the raw numpy arrays into JSON-friendly summary stats."""
    rates = simulation["rates"]
    tg = simulation["time_grid"]

    return SimulationResponse(
        model=req.model,
        n_paths=req.n_paths,
        n_steps=rates.shape[1] - 1,
        T=req.T,
        dt=req.dt,
        time_grid=tg.tolist(),
        mean_rate=rates.mean(axis=0).tolist(),
        percentile_5=np.percentile(rates, 5, axis=0).tolist(),
        percentile_25=np.percentile(rates, 25, axis=0).tolist(),
        percentile_50=np.percentile(rates, 50, axis=0).tolist(),
        percentile_75=np.percentile(rates, 75, axis=0).tolist(),
        percentile_95=np.percentile(rates, 95, axis=0).tolist(),
        sample_paths=rates[:N_SAMPLE_PATHS].tolist(),
        terminal_mean=float(rates[:, -1].mean()),
        terminal_std=float(rates[:, -1].std()),
    )


def _price(simulation: dict, pr: PricingRequest) -> PricingResponse:
    """Price requested instruments from the simulation output."""
    rates = simulation["rates"]
    DF = simulation["discount_factors"]
    dt = simulation["time_grid"][1] - simulation["time_grid"][0]

    resp = PricingResponse()

    if pr.zcb_maturities:
        from pricing.zero_coupon import zcb

        resp.zcb = []
        for T in pr.zcb_maturities:
            prices = zcb(rates, dt, T)
            resp.zcb.append(
                ZCBResult(maturity=T, mean_price=float(prices.mean()), std_price=float(prices.std()))
            )

    if pr.forward_pairs:
        from pricing.forwards import forward_rates
        from pricing.zero_coupon import zcb

        resp.forwards = []
        for T1, T2 in pr.forward_pairs:
            P1 = zcb(rates, dt, T1)
            P2 = zcb(rates, dt, T2)
            fwds = forward_rates(P1, P2, T1, T2)
            resp.forwards.append(
                ForwardResult(T1=T1, T2=T2, mean_forward=float(fwds.mean()), std_forward=float(fwds.std()))
            )

    if pr.swap_maturities:
        from pricing.swaps import par_swap_rate

        resp.swaps = []
        for mat in pr.swap_maturities:
            payment_times = np.arange(pr.swap_frequency, mat + 1e-9, pr.swap_frequency).tolist()
            rate = par_swap_rate(DF, payment_times, mat, dt)
            resp.swaps.append(SwapResult(maturity=mat, par_rate=float(rate)))

    return resp


# ── routes ───────────────────────────────────────────────────────────────

@app.post("/simulate", response_model=SimulationResponse)
def run_simulation(req: SimulationRequest):
    """Run a short-rate Monte-Carlo simulation and return summary statistics."""
    params = _build_model_params(req)
    simulation = simulate_rates(req.model, params)
    return _summarise(simulation, req)


@app.post("/price", response_model=PricingResponse)
def run_pricing(req: SimulateAndPriceRequest):
    """Simulate then price instruments in a single request."""
    params = _build_model_params(req.simulation)
    simulation = simulate_rates(req.simulation.model, params)
    return _price(simulation, req.pricing)


@app.post("/simulate-and-price", response_model=SimulateAndPriceResponse)
def simulate_and_price(req: SimulateAndPriceRequest):
    """Full pipeline: simulate → summarise → price → return everything."""
    params = _build_model_params(req.simulation)
    simulation = simulate_rates(req.simulation.model, params)
    return SimulateAndPriceResponse(
        simulation=_summarise(simulation, req.simulation),
        pricing=_price(simulation, req.pricing),
    )


@app.get("/health")
def health():
    return {"status": "ok"}