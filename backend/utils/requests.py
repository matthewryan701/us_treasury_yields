from pydantic import BaseModel, Field
from typing import Optional


class YieldCurveInput(BaseModel):
    """Required for Hull-White and Ho-Lee models that calibrate to the current term structure."""
    maturities: list[float] = Field(
        default=[0.25, 0.5, 1, 2, 3, 5, 7, 10, 20, 30],
        description="Tenor points in years",
    )
    zero_rates: list[float] = Field(
        ...,
        description="Zero-coupon rates corresponding to each maturity",
    )


class SimulationRequest(BaseModel):
    """Inbound payload for /simulate and /simulate-and-price."""
    model: str = Field(
        ...,
        pattern="^(vasicek|cir|hull_white|ho_lee)$",
        description="Short-rate model to run",
    )

    # Common parameters
    r0: float = Field(..., description="Initial short rate")
    sigma: float = Field(..., description="Volatility")
    T: float = Field(5.0, gt=0, description="Simulation horizon in years")
    dt: float = Field(1 / 252, gt=0, description="Time step (default daily)")
    n_paths: int = Field(500, ge=1, le=10_000, description="Number of Monte-Carlo paths")
    seed: Optional[int] = Field(42, description="Random seed for reproducibility")

    # Vasicek / CIR specific
    kappa: Optional[float] = Field(None, description="Mean-reversion speed (Vasicek, CIR)")
    theta: Optional[float] = Field(None, description="Long-run mean rate (Vasicek, CIR)")

    # Hull-White specific
    alpha: Optional[float] = Field(None, description="Mean-reversion speed (Hull-White)")

    # Ho-Lee / Hull-White: need the current yield curve
    yield_curve: Optional[YieldCurveInput] = Field(
        None,
        description="Current yield curve (required for hull_white and ho_lee)",
    )


class PricingRequest(BaseModel):
    """What instruments to price from the simulation output."""
    zcb_maturities: Optional[list[float]] = Field(
        None,
        description="List of ZCB maturities to price (e.g. [1, 2, 5, 10])",
    )
    forward_pairs: Optional[list[tuple[float, float]]] = Field(
        None,
        description="List of (T1, T2) pairs for forward rates",
    )
    swap_maturities: Optional[list[float]] = Field(
        None,
        description="Swap maturities to price",
    )
    swap_frequency: float = Field(
        0.5,
        description="Payment frequency in years (0.5 = semi-annual)",
    )


class SimulateAndPriceRequest(BaseModel):
    """Combined request: run simulation then price instruments in one call."""
    simulation: SimulationRequest
    pricing: PricingRequest