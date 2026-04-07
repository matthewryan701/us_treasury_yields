from pydantic import BaseModel, Field
from typing import Optional


class SimulationResponse(BaseModel):
    """Returned by /simulate — summary stats rather than full path arrays."""
    model: str
    n_paths: int
    n_steps: int
    T: float
    dt: float

    # Summary statistics at each time step (keeps payload manageable for the frontend)
    time_grid: list[float]
    mean_rate: list[float]
    percentile_5: list[float]
    percentile_25: list[float]
    percentile_50: list[float]
    percentile_75: list[float]
    percentile_95: list[float]

    # Optional: a small subset of raw paths for the fan-chart overlay
    sample_paths: Optional[list[list[float]]] = Field(
        None,
        description="A handful of individual paths for plotting",
    )

    # Terminal distribution
    terminal_mean: float
    terminal_std: float


class ZCBResult(BaseModel):
    maturity: float
    mean_price: float
    std_price: float


class ForwardResult(BaseModel):
    T1: float
    T2: float
    mean_forward: float
    std_forward: float


class SwapResult(BaseModel):
    maturity: float
    par_rate: float


class PricingResponse(BaseModel):
    zcb: Optional[list[ZCBResult]] = None
    forwards: Optional[list[ForwardResult]] = None
    swaps: Optional[list[SwapResult]] = None


class SimulateAndPriceResponse(BaseModel):
    simulation: SimulationResponse
    pricing: PricingResponse