"use client"

import { useState } from "react"
import Link from "next/link"
import { HexagonPattern } from "@/components/hexagon-pattern"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ChevronDown } from "lucide-react"

export default function DocumentationPage() {
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false)
  const [isYieldCurveOpen, setIsYieldCurveOpen] = useState(false)
  const [isValuationOpen, setIsValuationOpen] = useState(false)
  const [isDurationOpen, setIsDurationOpen] = useState(false)

  return (
    <main className="relative min-h-screen bg-background">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 z-0">
        <HexagonPattern />
      </div>

      <section className="relative z-10 flex min-h-screen w-full flex-col items-center px-4 pt-32 pb-20">
        <div className="w-full max-w-7xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-foreground md:text-6xl">Documentation</h1>
            <p className="mt-4 text-lg text-foreground/70">
              Explore the methodology and technicalities of the platform.
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-4 lg:max-w-5xl">
            {/* ── 1. Data Sources + Methodology ── */}
            <div className="rounded-2xl bg-card/60 backdrop-blur-sm">
              <button
                onClick={() => setIsMethodologyOpen(!isMethodologyOpen)}
                className="flex w-full items-center justify-between p-6 text-left md:p-10"
              >
                <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                  1. Data Sources &amp; Methodology
                </h2>
                <ChevronDown
                  className={`hidden h-6 w-6 shrink-0 text-foreground/50 transition-transform duration-300 md:block ${isMethodologyOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${isMethodologyOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6 md:px-10 md:pb-10">
                    {/* 1.1 */}
                    <h3 className="mt-2 text-xl font-semibold text-foreground md:text-2xl">
                      1.1 Data Source
                    </h3>
                    <p className="mt-4 leading-relaxed text-foreground/70">
                      For this project, I retrieved data from the Federal Reserve Economic Database API.
                      This is a publicly available API which allows users to build applications relating
                      to the US economy. Getting the primary source of data from this project from a
                      credible source allowed for data integrity to be maintained, and for me to be able
                      to build a robust data pipeline.
                    </p>
                    <p className="mt-3">
                      <a
                        href="https://fred.stlouisfed.org/docs/api/fred/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
                      >
                        https://fred.stlouisfed.org/docs/api/fred/
                      </a>
                    </p>

                    {/* 1.2 */}
                    <h3 className="mt-10 text-xl font-semibold text-foreground md:text-2xl">
                      1.2 Raw Data
                    </h3>
                    <p className="mt-4 leading-relaxed text-foreground/70">
                      The backbone of the data used for this project were a variety of macroeconomic
                      indicators and bond yields. Firstly, I got the yields of US Treasuries of varying
                      maturities, ranging from 1 month to 30 years. All can be seen on the{" "}
                      <Link
                        href="/yield-curve"
                        className="font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
                      >
                        Yield Curve
                      </Link>{" "}
                      tab. Along with this, the following macroeconomic indicators were retrieved:
                    </p>
                    <ul className="mt-4 space-y-2 pl-5 text-foreground/70">
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        Consumer Price Index (CPI)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        Personal Consumption Expenditures (PCE)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        Producer Price Index (PPI)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        Gross Domestic Product (GDP)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        Unemployment Rate
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        Credit Spread
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        Job Openings and Labour Turnover Survey (JOLTS)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        Housing Starts
                      </li>
                    </ul>

                    {/* 1.3 */}
                    <h3 className="mt-10 text-xl font-semibold text-foreground md:text-2xl">
                      1.3 Data Pipeline
                    </h3>

                    {/* Pipeline SVG */}
                    <div className="mt-6 flex items-center justify-center">
                      <img
                        src="/images/data_pipeline_horizontal.svg"
                        alt="Data pipeline visualisation"
                        className="w-full max-w-2xl"
                      />
                    </div>

                    <p className="mt-6 leading-relaxed text-foreground/70">
                      Once retrieving the data from the FRED API in Python, it was cleaned and processed
                      into the format that was needed for analysis. Spreads were derived from the yield
                      curve as recession indicators, as well as principal components to reduce the
                      dimensions and give trading signals from the curve. Most indicators are released on
                      a monthly or quarterly basis, so forward fills were applied to many columns to have
                      daily indexing on my DataFrame.
                    </p>
                    <p className="mt-4 leading-relaxed text-foreground/70">
                      The data was stored in a cloud-based Postgres database called{" "}
                      <span className="font-medium text-foreground">Supabase</span>. This allowed me to
                      benefit from the built-in security and infrastructure of a cloud-based solution, and
                      allowed me to connect to my frontend through API calls.
                    </p>
                    <p className="mt-4 leading-relaxed text-foreground/70">
                      My frontend was developed in{" "}
                      <span className="font-medium text-foreground">Next.js</span>, using React
                      components and written in TypeScript. This connected my database through API calls
                      to my Supabase tables.
                    </p>
                    <p className="mt-4 leading-relaxed text-foreground/70">
                      Finally, the Python scripts were scheduled to run on a daily basis using GitHub
                      Actions, at 6:00pm GMT. This meant that each time the Federal Reserve released new
                      macroeconomic data, the scripts would process the data and store them in Supabase.
                      This meant I had up-to-date financial data in a consistent format in my database,
                      still being updated daily.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 2. Yield Curve ── */}
            <div className="rounded-2xl bg-card/60 backdrop-blur-sm">
              <button
                onClick={() => setIsYieldCurveOpen(!isYieldCurveOpen)}
                className="flex w-full items-center justify-between p-6 text-left md:p-10"
              >
                <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                  2. Yield Curve
                </h2>
                <ChevronDown
                  className={`hidden h-6 w-6 shrink-0 text-foreground/50 transition-transform duration-300 md:block ${isYieldCurveOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${isYieldCurveOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6 md:px-10 md:pb-10">
                    {/* 2.1 */}
                    <h3 className="mt-2 text-xl font-semibold text-foreground md:text-2xl">
                      2.1 Spreads
                    </h3>
                    <p className="mt-4 leading-relaxed text-foreground/70">
                      The page shows the spreads of the yield curve, which can be extremely useful for
                      understanding the macro environment. Breaking this down, the 2s10s spread shows the
                      difference between the 2-year and 10-year yield, the 3m10y spread shows the
                      difference between the 3-month and 10-year yield and the 5s30s spread shows the
                      difference between the 5-year and 30-year yield.
                    </p>
                    <p className="mt-4 leading-relaxed text-foreground/70">
                      The <span className="font-medium text-foreground">2s10s spread</span> is the most
                      quoted. It captures the middle of the curve. The 2-year yield is heavily influenced
                      by short-term Federal Reserve interest rate decisions because it has a shorter
                      maturity, whereas the 10-year yield represents longer term expectations for things
                      like inflation and growth. When this spread goes below 0, it can be a recession
                      indicator.
                    </p>
                    <p className="mt-4 leading-relaxed text-foreground/70">
                      The <span className="font-medium text-foreground">3m10y spread</span> is sometimes
                      preferred over the 2s10s. This is because the 3-month yield follows the market
                      expectations for Fed interest rate decisions a lot more closely than the 2-year
                      yield, which already includes some forward looking factors like inflation and GDP
                      growth. Similarly, when the 3m10y spread inverts below 0, it can be a recession
                      indicator.
                    </p>
                    <p className="mt-4 leading-relaxed text-foreground/70">
                      The <span className="font-medium text-foreground">5s30s spread</span> is a lot more
                      forward looking than the other two. It looks deeper into future macroeconomic
                      expectations, and is less to do with what will happen with interest rates in the
                      short term.
                    </p>

                    {/* 2.2 */}
                    <h3 className="mt-10 text-xl font-semibold text-foreground md:text-2xl">
                      2.2 Level, Slope, Curvature
                    </h3>
                    <p className="mt-4 leading-relaxed text-foreground/70">
                      The yield curve can be decomposed into three principal factors that together explain
                      most of its variation. These factors form the basis of our regime classification
                      framework.
                    </p>
                    <p className="mt-4 leading-relaxed text-foreground/70">
                      <span className="font-medium text-foreground">Level</span> represents the overall
                      height of the yield curve and the direction the yields are shifting across all
                      maturities collectively. A high level environment generally corresponds to inflation
                      expectations, while a low level environment suggests decreased fear of inflation.
                    </p>
                    <p className="mt-4 leading-relaxed text-foreground/70">
                      <span className="font-medium text-foreground">Slope</span> captures the difference
                      between long-term and short-term yields. A steep curve (positive slope) suggests the
                      market expects economic expansion and/or future rate hikes, while a flat or inverted
                      curve (negative slope) signals expectations of slowing growth or anticipated interest
                      rate cuts.
                    </p>
                    <p className="mt-4 leading-relaxed text-foreground/70">
                      <span className="font-medium text-foreground">Curvature</span> describes the
                      relative yields of mid-term maturities compared to short and long term yields.
                      Curvature is most relevant for relative value positioning and butterfly trades. A
                      high curvature can represent uncertainty for the macro environment.
                    </p>

                    {/* 2.3 */}
                    <h3 className="mt-10 text-xl font-semibold text-foreground md:text-2xl">
                      2.3 Market Regime Classification
                    </h3>
                    <p className="mt-4 leading-relaxed text-foreground/70">
                      There are four types of market regime that are derived from the principal components
                      of the yield curve, i.e. the level, slope and curvature. The four types of regime
                      are{" "}
                      <span className="font-medium text-foreground">Bull Steepening</span>,{" "}
                      <span className="font-medium text-foreground">Bull Flattening</span>,{" "}
                      <span className="font-medium text-foreground">Bear Steepening</span> and{" "}
                      <span className="font-medium text-foreground">Bear Flattening</span>.
                    </p>
                    <p className="mt-4 leading-relaxed text-foreground/70">
                      In market regime classification, the Bull / Bear corresponds to the prices of bonds
                      in the market. In a bull market, bond prices are rising meaning yields are falling,
                      whereas in a bear market, bond prices are falling so yields are rising. This is all
                      to do with the level of the curve being positive or negative.
                    </p>
                    <p className="mt-4 leading-relaxed text-foreground/70">
                      The Steepening / Flattening corresponds to how the short-term and long-term yields
                      are behaving in relation to each other. Ultimately, in a steepening market the
                      differences between these are increasing whereas in a flattening market the
                      differences are decreasing.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 3. Valuation ── */}
            <div className="rounded-2xl bg-card/60 backdrop-blur-sm">
              <button
                onClick={() => setIsValuationOpen(!isValuationOpen)}
                className="flex w-full items-center justify-between p-6 text-left md:p-10"
              >
                <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                  3. Valuation
                </h2>
                <ChevronDown
                  className={`hidden h-6 w-6 shrink-0 text-foreground/50 transition-transform duration-300 md:block ${isValuationOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${isValuationOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6 md:px-10 md:pb-10">
                    {/* 3.1 */}
                    <h3 className="mt-2 text-xl font-semibold text-foreground md:text-2xl">
                      3.1 Coupon Payments
                    </h3>
                    <p className="mt-4 leading-relaxed text-foreground/70">
                      We are able to calculate the valuation of bonds using the Net Present Value formula.
                      This discounts all of the future cash flows of the bonds by the market interest
                      rate. This is because new bonds can be issued at the market interest rate, which
                      could make the price of the original bond relatively expensive / cheaper /
                      par-value.
                    </p>
                    <p className="mt-4 leading-relaxed text-foreground/70">
                      As seen on the graph where the vertical dashed line intersects the curve, if this
                      market interest rate remains the same as the bond&apos;s initial coupon payments,
                      then the valuation of the bond is simply its face value. This means no gain or loss
                      has been made from holding the bond. This would be a{" "}
                      <span className="font-medium text-foreground">par-value bond</span>.
                    </p>
                    <p className="mt-4 leading-relaxed text-foreground/70">
                      To the left of the vertical line are all of the possible{" "}
                      <span className="font-medium text-foreground">premium bonds</span>. These occur
                      when a bond has been bought at a certain interest rate, and then the market interest
                      rate has dropped. This means the original bond pays a better coupon-payment than any
                      new bonds that can be issued, increasing its value.
                    </p>
                    <p className="mt-4 leading-relaxed text-foreground/70">
                      To the right are all the{" "}
                      <span className="font-medium text-foreground">discount bonds</span>. These occur
                      when interest rates increase after a bond has been issued. This means investors can
                      now issue new bonds at a better coupon rate, making the original bond less valuable
                      to investors.
                    </p>

                    {/* 3.2 */}
                    <h3 className="mt-10 text-xl font-semibold text-foreground md:text-2xl">
                      3.2 Bond Maturities
                    </h3>
                    <p className="mt-4 leading-relaxed text-foreground/70">
                      Bonds of higher maturities are more sensitive to changes in interest rates. This is
                      because if interest rates change, the holder of the bond would bear the benefits or
                      negatives of the bond&apos;s original coupon payments for a longer period of time.
                    </p>
                    <p className="mt-4 leading-relaxed text-foreground/70">
                      This can be seen on the graph. Bonds with higher maturities are more convex whereas
                      bonds with lower maturities are more linear. To add to this, bonds with higher
                      maturities have much steeper gradients, representing the larger gain or loss with a
                      change in interest rates.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 4. Duration ── */}
            <div className="rounded-2xl bg-card/60 backdrop-blur-sm">
              <button
                onClick={() => setIsDurationOpen(!isDurationOpen)}
                className="flex w-full items-center justify-between p-6 text-left md:p-10"
              >
                <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                  4. Duration
                </h2>
                <ChevronDown
                  className={`hidden h-6 w-6 shrink-0 text-foreground/50 transition-transform duration-300 md:block ${isDurationOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${isDurationOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6 md:px-10 md:pb-10">
                    {/* 4.1 */}
                    <h3 className="mt-2 text-xl font-semibold text-foreground md:text-2xl">
                      4.1 Macaulay Duration
                    </h3>
                    <p className="mt-4 leading-relaxed text-foreground/70">
                      The Macaulay Duration measures the average time to receive the value from your bond.
                      Since all bond coupon payments are equal throughout the life of a bond, you would
                      expect this average time to be half of the bond&apos;s maturity. However, an
                      investor would also be receiving the face value that they paid for the bond on the
                      final coupon payment. This brings the average time forward. These coupon payments
                      are all discounted by the market interest rate, so they are very heavily dependent
                      on what happens in markets.
                    </p>
                    <p className="mt-4 leading-relaxed text-foreground/70">
                      My model assumes that the yield (or the market interest rate) remains the same as
                      the coupon payment for the bond. This is because the data from FRED is the CMT yield
                      for par bonds. This is a simplifying assumption.
                    </p>

                    {/* 4.2 */}
                    <h3 className="mt-10 text-xl font-semibold text-foreground md:text-2xl">
                      4.2 Modified Duration
                    </h3>
                    <p className="mt-4 leading-relaxed text-foreground/70">
                      The Modified Duration is the derivative of the bond price with respect to the yield
                      or market interest rates. Essentially, it represents how many basis points a
                      bond&apos;s price would change, in a positive or negative direction, with a 1%
                      change in interest rates.
                    </p>
                    <p className="mt-4 leading-relaxed text-foreground/70">
                      Intuitively, this can be confusing because this is also measured in years. However,
                      it represents percentage in its most useful case.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}