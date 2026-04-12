"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { HexagonPattern } from "@/components/hexagon-pattern"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { YieldCurveChart } from "@/components/yield-curve-chart"
import { YieldCurveSidebarCard } from "@/components/yield-curve-sidebar-card"
import { MacroIndicatorsCard } from "@/components/macro-indicators-card"
import { StatisticsCard } from "@/components/statistics-card"
import { MacroIndicatorsCardMobile } from "@/components/macro-indicators-card-mobile"
import { StatisticsCardMobile } from "@/components/statistics-card-mobile"

interface YieldRecord {
  date: string
  [key: string]: string | number | null
}

interface MacroRecord {
  date: string
  quarter?: string
  [key: string]: string | number | null | undefined
}

export default function YieldCurvePage() {
  const [yieldData, setYieldData] = useState<YieldRecord | null>(null)
  const [dataLoading, setDataLoading] = useState(false)

  // Fetch macro data once at the page level
  const [macroRecord, setMacroRecord] = useState<MacroRecord | null>(null)
  const [macroLoading, setMacroLoading] = useState(true)
  const [macroError, setMacroError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLatestMacro() {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from("macro_indicators")
        .select("*")
        .order("date", { ascending: false })
        .limit(1)

      if (fetchError) {
        setMacroError("Failed to load indicators.")
        setMacroLoading(false)
        return
      }

      if (!data || data.length === 0) {
        setMacroError("No indicator data available.")
        setMacroLoading(false)
        return
      }

      setMacroRecord(data[0] as MacroRecord)
      setMacroLoading(false)
    }

    fetchLatestMacro()
  }, [])

  const handleYieldDataChange = (data: YieldRecord | null, loading: boolean) => {
    setYieldData(data)
    setDataLoading(loading)
  }

  return (
    <main className="relative min-h-screen bg-background">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 z-0">
        <HexagonPattern />
      </div>

      <section className="relative z-10 flex min-h-screen w-full flex-col items-center px-4 pt-32 pb-20">
        <div className="w-full max-w-7xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-foreground md:text-6xl">Yield Curve</h1>
            <p className="mt-4 text-lg text-foreground/70">
              Explore the US Treasury yield curve data and analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr_240px]">
            <div className="hidden lg:block">
              <div className="sticky top-28" style={{ height: "488px" }}>
                <MacroIndicatorsCard
                  record={macroRecord}
                  loading={macroLoading}
                  error={macroError}
                />
              </div>
            </div>

            <div>
              <YieldCurveChart onYieldDataChange={handleYieldDataChange} />
            </div>

            <div className="hidden lg:block">
              <div className="sticky top-28" style={{ height: "488px" }}>
                <StatisticsCard record={yieldData} loading={dataLoading} />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-4 lg:hidden">
            <div className="w-full max-w-lg">
              <StatisticsCardMobile record={yieldData} loading={dataLoading} />
            </div>
            {/* Description card — mobile only */}
            <div className="w-full max-w-lg rounded-xl bg-card/60 px-6 py-6 backdrop-blur-sm">
              <div className="text-sm leading-relaxed text-foreground/60">
                <p>
                  The <span className="font-medium text-foreground/80">spreads</span> show various differences between bond yields at different maturities. If these invert below 0, it can signal a recession.
                </p>
                <p className="mt-3">
                  <span className="font-medium text-foreground/80">Level</span> represents the parallel movement of all yields, <span className="font-medium text-foreground/80">slope</span> represents the movement of long-term yields in relation to short-term yields, and <span className="font-medium text-foreground/80">curvature</span> represents the movement of mid-term yields in relation to the short and long term yields. See the <a href="/documentation" className="font-medium text-foreground/80 underline underline-offset-2 transition-colors hover:text-foreground">documentation</a> for more information on how these relate to interest rates / inflation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}