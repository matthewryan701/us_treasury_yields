"use client"

import Link from "next/link"

import { useRef } from "react"
import { Typewriter } from "@/components/typewriter"
import { AnimatedCard } from "@/components/animated-card"
import { AnimatedTitle } from "@/components/animated-title"
import { HexagonPattern } from "@/components/hexagon-pattern"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function Home() {
  const platformRef = useRef<HTMLElement>(null)

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
              text="Modelling the US-Treasury Yield Curve with stochastic calculus and cutting-edge technology."
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

          <div className="flex w-full flex-col gap-8 md:flex-row">
            <AnimatedCard className="flex-1">
              <div className="flex h-full flex-col p-2">
                <h2 className="mb-4 text-4xl font-semibold text-foreground">Current Market State</h2>
                <p className="mb-6 text-base text-foreground/70">
                  Get ahead of the competition, staying informed about the latest macroeconomic indicators. View the
                  daily evolution of the yield curve spanning back to 2001. Explore state-of-the-art interpolation
                  models such as Cubic-Spline and Nelson-Siegel, as a benchmark for pricing commercial bonds.
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
                  <span className="text-base">View the current yield curve</span>
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
                <h2 className="mb-4 text-4xl font-semibold text-foreground">Model Dynamics</h2>
                <p className="mb-6 text-base text-foreground/70">
                  Generate on-demand Monte Carlo simulations using models like Vasicek, Hull-White and Ho-Lee, to
                  visualise the evolution of key financial metrics like short rate, 2s10s and 10y yield distribution.
                  Implement stress testing scenarios to minimise portfolio risk and be prepared for any uncertainties.
                </p>
                <div className="flex-grow" />
                <div className="flex h-16 items-center justify-center">
                  <span className="text-5xl text-white" style={{ fontFamily: "'STIX Two Math'" }}>
                    f′(x)
                  </span>
                </div>
                <Link
                  href="/stochastic-models"
                  className="mt-8 flex items-center justify-center gap-2 text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
                >
                  <span className="text-base">View stochastic paths</span>
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
            <AnimatedTitle title="Capabilities" />
          </div>

          <AnimatedCard className="w-full">
            <div className="p-2">
              <p className="mb-10 text-center text-lg text-foreground/80">
                YieldLabs is a platform designed for investors, risk managers and economists to explore quantitative
                macroeconomic interactions in a feasible way. The mission of this platform ultimately comes down to
                three pillars.
              </p>

              <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                <div>
                  <h3 className="mb-4 text-2xl font-semibold text-foreground">Understand the Market</h3>
                  <ul className="space-y-3 text-base text-foreground/70">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>View today's yield curve vs history</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Inspect spreads, inversions, and PCA factors</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Track macro indicators and upcoming events</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-4 text-2xl font-semibold text-foreground">Explore Structure</h3>
                  <ul className="space-y-3 text-base text-foreground/70">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Interpolate curves using established models</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Decompose movements into level, slope and curvature</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Compare regimes across cycles</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-4 text-2xl font-semibold text-foreground">Simulate Risk</h3>
                  <ul className="space-y-3 text-base text-foreground/70">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Generate stochastic rate paths</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Stress portfolios and curve segments</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Calibrate models to live market data</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Link
                href="/documentation"
                className="mt-10 flex items-center justify-center gap-2 text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
              >
                <span className="text-base">View the full documentation here</span>
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
      </section>

      <section className="relative z-10 flex w-full snap-start flex-col items-center justify-center px-4 pt-8 pb-16">
        <div className="flex w-full max-w-7xl flex-col items-center">
          <div className="mb-4">
            <AnimatedTitle title="Tech Stack" />
          </div>

          <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
              </div>
            </AnimatedCard>

            <AnimatedCard className="flex-1">
              <div className="flex h-full flex-col items-center justify-center text-center py-6">
                <h2 className="mb-8 text-3xl font-semibold text-foreground">FastAPI</h2>
                <svg viewBox="0 0 154 154" className="h-20 w-20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="77" cy="77" r="77" fill="#05998B" />
                  <path
                    d="M81.375 18.667L47.792 84.792H74.417L72.625 135.333L106.208 69.208H79.583L81.375 18.667Z"
                    fill="white"
                  />
                </svg>
              </div>
            </AnimatedCard>

            <AnimatedCard className="flex-1">
              <div className="flex h-full flex-col items-center justify-center text-center py-6">
                <h2 className="mb-8 text-3xl font-semibold text-foreground">Scikit-Learn</h2>
                <img src="/images/sklearn.png" alt="Scikit-Learn logo" className="h-20 w-auto" />
              </div>
            </AnimatedCard>

            <AnimatedCard className="flex-1">
              <div className="flex h-full flex-col items-center justify-center text-center py-6">
                <h2 className="mb-8 text-3xl font-semibold text-foreground">V0</h2>
                <svg viewBox="0 0 76 65" className="h-20 w-20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="white" />
                </svg>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
