"use client"

import { useState } from "react"

const SPREAD_LABELS: Record<string, string> = {
  "2s10s": "2s10s",
  "3m10y": "3m10y",
  "5s30s": "5s30s",
}

const COMPONENT_LABELS: Record<string, string> = {
  PC1: "Level",
  PC2: "Slope",
  PC3: "Curvature",
}

const SPREAD_KEYS = Object.keys(SPREAD_LABELS)
const COMPONENT_KEYS = Object.keys(COMPONENT_LABELS)

interface YieldRecord {
  date: string
  [key: string]: string | number | null
}

interface StatisticsCardProps {
  record: YieldRecord | null
  loading: boolean
}

export function StatisticsCard({ record, loading }: StatisticsCardProps) {
  const [spreadsInfoOpen, setSpreadsInfoOpen] = useState(false)
  const [componentsInfoOpen, setComponentsInfoOpen] = useState(false)

  return (
    <div className="flex h-full w-full flex-col rounded-xl bg-card/60 p-5 backdrop-blur-sm">
      <h3 className="text-center text-lg font-bold text-foreground">
        Statistics
      </h3>

      {loading && (
        <div className="mt-4 flex flex-1 items-center justify-center">
          <p className="text-xs text-foreground/30">Loading...</p>
        </div>
      )}

      {record && !loading && (
        <>
          <p className="mt-4 text-center text-lg font-bold text-foreground">
            Spreads
          </p>
          <div className="mt-3 border-t border-foreground/10" />

          <div className="mt-4 flex flex-col gap-2.5">
            {SPREAD_KEYS.map((key) => {
              const value = record[key]
              const formattedValue = value != null ? Number(value).toFixed(2) : "N/A"
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground/80">
                    {SPREAD_LABELS[key]}
                  </span>
                  <span className="text-xs font-semibold text-foreground/80">
                    {formattedValue}
                  </span>
                </div>
              )
            })}
          </div>

          <button
            onClick={() => setSpreadsInfoOpen(!spreadsInfoOpen)}
            className="mt-3 flex w-full items-center justify-between rounded-lg bg-foreground/5 px-3 py-2 transition-all hover:bg-foreground/10"
          >
            <span className="text-xs font-medium text-foreground/60">Spread Information</span>
            <svg
              className={`h-4 w-4 transition-transform text-foreground/60 ${spreadsInfoOpen ? "rotate-180" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {spreadsInfoOpen && (
            <div className="mt-2 rounded-lg bg-foreground/10 p-3">
              <p className="text-[10px] leading-relaxed text-foreground/30">
                The inversions of the 2s10s and 3m10y spreads below 0 are strong signals for a recession, whereas the 5s30s spread inverting below 0 shows markets expecting deflation/underwhelming long-term growth.
              </p>
            </div>
          )}

          <p className="mt-6 text-center text-lg font-bold text-foreground">
            Components
          </p>
          <div className="mt-3 border-t border-foreground/10" />

          <div className="mt-4 flex flex-col gap-2.5">
            {COMPONENT_KEYS.map((key) => {
              const value = record[key]
              const formattedValue = value != null ? Number(value).toFixed(2) : "N/A"
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground/80">
                    {COMPONENT_LABELS[key]}
                  </span>
                  <span className="text-xs font-semibold text-foreground/80">
                    {formattedValue}
                  </span>
                </div>
              )
            })}
          </div>

          <button
            onClick={() => setComponentsInfoOpen(!componentsInfoOpen)}
            className="mt-3 flex w-full items-center justify-between rounded-lg bg-foreground/5 px-3 py-2 transition-all hover:bg-foreground/10"
          >
            <span className="text-xs font-medium text-foreground/60">Component Information</span>
            <svg
              className={`h-4 w-4 transition-transform text-foreground/60 ${componentsInfoOpen ? "rotate-180" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {componentsInfoOpen && (
            <div className="mt-2 rounded-lg bg-foreground/10 p-3">
              <p className="text-[10px] leading-relaxed text-foreground/30">
                Level represents the positive / negative movement of bond yields as a whole. A positive Slope represents steepening where short-rates rise less than long-rates; a negative Slope represents flattening where short-rates rise more than long-rates. Curvature shows the magnitude of the dip in the yield curve.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}