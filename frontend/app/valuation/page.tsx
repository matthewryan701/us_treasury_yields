"use client"

import { HexagonPattern } from "@/components/hexagon-pattern"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ValuationChart } from "@/components/valuation-chart"

export default function ValuationPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 z-0">
        <HexagonPattern />
      </div>

      <section className="relative z-10 flex min-h-screen w-full flex-col items-center px-4 pt-32 pb-20">
        <div className="w-full max-w-5xl">
          {/* Title - matching yield curve page positioning */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-foreground md:text-6xl">Valuation</h1>
            <p className="mt-4 text-lg text-foreground/70">
              Calculate the present value of bonds based on market interest rates.
            </p>
          </div>

          {/* Chart */}
          <div>
            <ValuationChart />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
