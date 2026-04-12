"use client"

import { HexagonPattern } from "@/components/hexagon-pattern"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DurationChart } from "@/components/duration-chart"

export default function DurationPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 z-0">
        <HexagonPattern />
      </div>

      <section className="relative z-10 flex min-h-screen w-full flex-col items-center px-4 pt-32 pb-20">
        <div className="w-full max-w-5xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-foreground md:text-6xl">Duration</h1>
            <p className="mt-4 text-lg text-foreground/70">
              Explore the sensitivity of US Treasuries to market interest rates.
            </p>
          </div>

          <div>
            <DurationChart />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}