"use client"

import { format } from "date-fns"

const INDICATOR_LABELS: Record<string, string> = {
  cpi_yoy: "CPI (YoY)",
  cpi_mom: "CPI (MoM)",
  pce: "PCE",
  ppi: "PPI",
  gdp: "GDP",
  unemployment: "Unemployment",
  credit_spread: "Credit Spread",
  jolts: "Jolts",
  housing_starts: "Housing Starts",
}

const INDICATOR_KEYS = Object.keys(INDICATOR_LABELS)

interface MacroRecord {
  date: string
  quarter?: string
  [key: string]: string | number | null | undefined
}

interface MacroIndicatorsCardProps {
  record: MacroRecord | null
  loading: boolean
  error: string | null
}

export function MacroIndicatorsCard({ record, loading, error }: MacroIndicatorsCardProps) {
  const formattedDate = record?.date
    ? format(new Date(record.date), "MMMM d, yyyy")
    : ""

  return (
    <div className="flex h-full w-full flex-col rounded-xl bg-card/60 p-5 backdrop-blur-sm">
      <h3 className="text-center text-lg font-bold text-foreground">
        Macro Indicators
      </h3>
      {formattedDate && (
        <p className="mt-1 text-center text-xs text-foreground/40">
          As of {formattedDate}
        </p>
      )}

      {record && !loading && !error && (
        <>
          <p className="mt-4 text-center text-lg font-bold text-foreground">
            {record.quarter || "N/A"}
          </p>
          <div className="mt-3 border-t border-foreground/10" />
        </>
      )}

      {loading && (
        <div className="mt-4 flex flex-1 items-center justify-center">
          <p className="text-xs text-foreground/30">Loading...</p>
        </div>
      )}

      {error && !loading && (
        <div className="mt-4 flex flex-1 items-center justify-center">
          <p className="text-xs text-foreground/30">{error}</p>
        </div>
      )}

      {record && !loading && !error && (
        <>
          <div className="mt-4 flex flex-col gap-2.5">
            {INDICATOR_KEYS.map((key) => {
              const value = record[key]
              const formattedValue = value != null
                ? key === "housing_starts"
                  ? Math.round(Number(value)).toString()
                  : Number(value).toFixed(2)
                : "N/A"
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground/80">
                    {INDICATOR_LABELS[key]}
                  </span>
                  <span className="text-xs font-semibold text-foreground/80">
                    {formattedValue}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="mt-auto pt-4">
            <p className="text-[10px] leading-relaxed text-foreground/30">
              All of the data displayed is from the Federal Reserve Economic
              Database (FRED) as of {formattedDate}.
            </p>
          </div>
        </>
      )}
    </div>
  )
}