# YieldLabs — Fixed Income & Interest Rate Modelling

**Live app:** [https://v0-yieldlabs.vercel.app/)

YieldLabs uses public macroeconomic data from the FRED API to analyse the yield curve, value bonds at different interest rates
and explore their sensitivity to changes in interest rates using duration.

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
