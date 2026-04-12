# YieldLabs — Fixed Income & Interest Rate Modelling

**Live app:** https://v0-yieldlabs.vercel.app/

YieldLabs uses public macroeconomic data from the FRED API to analyse the yield curve, value bonds at different interest rates
and explore their sensitivity to changes in interest rates using duration.

## Usage and Context

### Yield Curve

The yield curve page on the dashboard allows users to investigate market expectations, with short-term changes in interest rates
and long-term outlook on inflation and economic growth.

- **Chart** - Visualise yields at different maturities.
- **Spreads** - View the 2s10s, 3m10y and 5s30s spreads as potential recession indicators.
- **Principal Components** - View the level, slope and curvature of the curve to observe market sentiment as a trading signal.

### Bond Valuation

The bond valuation page lets users get a coherent understanding of how bonds are priced using the Net Present Value formula. 
This can help users see how the prices of specific investments would change with a change in interest rates.

- **Chart** - Clear visualisation to understand par-value, discount and premium bonds.
- **Equation** - In-depth breakdown of how bonds are priced using a mathematical model.

### Bond Duration

The bond duration page lets users see how the Macauley and Modified durations of Treasuries at each maturity have changed since 2001.
Duration measures price sensitivity to a change in interest rates, and is a key tool for evaluating risk in bond investing.

- **Chart** - Users can see how duration has fluctuated through events dating back to 2001.
- **Equation** - In-depth breakdown of the equations for Macauley Duration and Modified Duration.

## Technology Stack

### Python

Python handles the data processing and the ETL process from the FRED API.

- **pandas** — Transforming data into a consistent data frame, using forward fills and aggregations to index by day.
- **numpy** — Calculations like Macauley Duration and the Net Present Value formula of bonds.
- **sklearn** — Principal Component Analysis to derive level, slope and curvature of the yield curve.

### Supabase

Stores data and connects to frontend via API connections.

- **yield_curve_data** — Stores daily yields for US Treasuries at all maturities.
- **macro_indicators** — Stores the current macroeconomic indicators on a daily basis.
- **treasury_duration** — Stores the Macauley and Modified duration of each US Treasury note daily.

### Next.js

Frontend showing visualisations, mathematical calculations and summary statistics.

- **TypeScript** — The language used for all frontend files.
- **React** — Components included on the page.tsx files.

### GitHub Actions

Python scripts scheduled to run daily to store new, clean data in Supabase.

- **YAML** — Script scheduling files.
