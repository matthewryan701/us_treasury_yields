"use client"

import Link from "next/link"

import { useRef, useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { format } from "date-fns"
import { Typewriter } from "@/components/typewriter"
import { AnimatedCard } from "@/components/animated-card"
import { AnimatedTitle } from "@/components/animated-title"
import { HexagonPattern } from "@/components/hexagon-pattern"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const INDICATOR_LABELS: Record<string, string> = {
  cpi_yoy: "Consumer Price Index YoY",
  cpi_mom: "Consumer Price Index MoM",
  pce: "Personal Consumption Expenditures",
  ppi: "Producer Price Index",
  gdp: "Gross Domestic Product",
  unemployment: "Unemployment Rate",
  credit_spread: "Credit Spread",
  jolts: "Job Openings and Labour Turnover Survey",
  housing_starts: "Housing Starts",
}

const INDICATOR_KEYS = Object.keys(INDICATOR_LABELS)

interface MacroRecord {
  date: string
  quarter?: string
  [key: string]: string | number | null | undefined
}

export default function Home() {
  const platformRef = useRef<HTMLElement>(null)

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

  return (
    <main className="relative min-h-screen snap-y snap-proximity overflow-x-hidden bg-background">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 z-0">
        <HexagonPattern />
      </div>

      <section className="relative z-10 flex h-screen w-full snap-start flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-foreground md:text-8xl">YieldLabs</h1>
          <div className="mt-4 text-lg text-foreground/70">
            <Typewriter
              texts={[
                "Mathematically Modelling US Fixed Income.",
                "Analsing Credit Spreads For Recession Indicators.",
                "Breaking Down The Yield Curve into Principal Components.",
                "Valuing Bonds At Different Market Interest Rates.",
                "Exploring Bond Sensitivity Using Duration."]}
              typingSpeed={40}
              deletingSpeed={40}
              pauseDuration={3000}
            />
          </div>
        </div>
      </section>

      <section
        ref={platformRef}
        className="relative z-10 flex w-full snap-start flex-col items-center justify-center px-4 pt-16"
      >
        <div className="flex w-full max-w-7xl flex-col items-center">
          <div className="mb-4">
            <AnimatedTitle title="Platform Overview" />
          </div>

          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
            <AnimatedCard className="flex-1">
              <div className="flex h-full flex-col p-2">
                <h2 className="mb-4 text-4xl font-semibold text-foreground">Yield Curve</h2>
                <p className="mb-6 text-base text-foreground/70">
                  Gain insight into the US-Treasury yield curve. View spreads and the level, slope and
                  curvature of the yield curve.
                </p>
                <div className="flex-grow" />
                <div className="flex h-16 items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-14 w-14 text-white"
                  >
                    <path d="M3 3v18h18" />
                    <path d="M7 16l4-4 4 4 5-6" />
                  </svg>
                </div>
                <Link
                  href="/yield-curve"
                  className="mt-8 flex items-center justify-center gap-2 text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
                >
                  <span className="text-base">View the yield curve</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </Link>
              </div>
            </AnimatedCard>

            <AnimatedCard className="flex-1">
              <div className="flex h-full flex-col p-2">
                <h2 className="mb-4 text-4xl font-semibold text-foreground">Valuation</h2>
                <p className="mb-6 text-base text-foreground/70">
                  Explore how bond pricing is affected by different market interest rates
                  and parameters.
                </p>
                <div className="flex-grow" />
                <div className="flex h-16 items-center justify-center">
                  <span className="text-5xl text-white" style={{ fontFamily: "'STIX Two Math'" }}>
                    f′(x)
                  </span>
                </div>
                <Link
                  href="/valuation"
                  className="mt-8 flex items-center justify-center gap-2 text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
                >
                  <span className="text-base">View valuation curve</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </Link>
              </div>
            </AnimatedCard>

            <AnimatedCard className="flex-1">
              <div className="flex h-full flex-col p-2">
                <h2 className="mb-4 text-4xl font-semibold text-foreground">Duration</h2>
                <p className="mb-6 text-base text-foreground/70">
                  Understand interest rate risk by analysing bond price sensitivity
                  with Macauley and Modified Duration.
                </p>
                <div className="flex-grow" />
                <div className="flex h-16 items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-14 w-14 text-white"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <Link href="/duration" className="mt-8 flex items-center justify-center gap-2 text-foreground/70 hover:text-foreground transition-colors cursor-pointer">
                  <span className="text-base">View bond duration</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </Link>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      <section className="relative z-10 flex w-full snap-start flex-col items-center justify-center px-4 pt-8 pb-16">
        <div className="flex w-full max-w-7xl flex-col items-center">
          <div className="mb-4">
            <AnimatedTitle title="Current Indicators" />
          </div>

          <AnimatedCard className="w-full">
            <div className="p-2">
              {macroLoading && (
                <div className="flex min-h-[200px] items-center justify-center">
                  <p className="text-base text-foreground/40">Loading indicators...</p>
                </div>
              )}

              {macroError && !macroLoading && (
                <div className="flex min-h-[200px] items-center justify-center">
                  <p className="text-base text-foreground/40">{macroError}</p>
                </div>
              )}

              {macroRecord && !macroLoading && !macroError && (
                <>
                  <div className="mx-auto grid max-w-4xl grid-cols-1 gap-x-12 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                    {INDICATOR_KEYS.map((key) => {
                      const value = macroRecord[key]
                      const formattedValue = value != null
                        ? key === "housing_starts"
                          ? Math.round(Number(value)).toString()
                          : Number(value).toFixed(2)
                        : "N/A"
                      return (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm text-foreground/70">
                            {INDICATOR_LABELS[key]}
                          </span>
                          <span className="text-sm font-semibold text-foreground">
                            {formattedValue}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  <p className="mt-6 text-center text-xs text-foreground/30">
                    As of {format(new Date(macroRecord.date), "MMMM d, yyyy")}
                  </p>
                </>
              )}
            </div>
          </AnimatedCard>
        </div>
      </section>

      <section className="relative z-10 flex w-full snap-start flex-col items-center justify-center px-4 pt-8 pb-16">
        <div className="flex w-full max-w-7xl flex-col items-center">
          <div className="mb-4">
            <AnimatedTitle title="Tech Stack" />
          </div>

          <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatedCard className="flex-1">
              <div className="flex h-full flex-col items-center justify-center text-center py-6">
                <h2 className="mb-8 text-3xl font-semibold text-foreground">Supabase</h2>
                <svg viewBox="0 0 109 113" className="h-20 w-20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
                    fill="url(#paint0_linear_supabase)"
                  />
                  <path
                    d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
                    fill="url(#paint1_linear_supabase)"
                    fillOpacity="0.2"
                  />
                  <path
                    d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z"
                    fill="#3ECF8E"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_supabase"
                      x1="53.9738"
                      y1="54.974"
                      x2="94.1635"
                      y2="71.8295"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#249361" />
                      <stop offset="1" stopColor="#3ECF8E" />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_supabase"
                      x1="36.1558"
                      y1="30.578"
                      x2="54.4844"
                      y2="65.0806"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop />
                      <stop offset="1" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
                <p className="mt-6 text-sm text-foreground/40">Database, API Integration</p>
              </div>
            </AnimatedCard>

            <AnimatedCard className="flex-1">
              <div className="flex h-full flex-col items-center justify-center text-center py-6">
                <h2 className="mb-8 text-3xl font-semibold text-foreground">Python</h2>
                <img src="/images/python.png" alt="Scikit-Learn logo" className="h-20 w-auto" />
                <p className="mt-6 text-sm text-foreground/40">Pandas, Numpy, Sklearn</p>
              </div>
            </AnimatedCard>

            <AnimatedCard className="flex-1">
              <div className="flex h-full flex-col items-center justify-center text-center py-6">
                <h2 className="mb-8 text-3xl font-semibold text-foreground">Next.JS</h2>
                <img src="/images/next.webp" className="h-20 w-auto" />
                <p className="mt-6 text-sm text-foreground/40">TypeScript, React</p>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}