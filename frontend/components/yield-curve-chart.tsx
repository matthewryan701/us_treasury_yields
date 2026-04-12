"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { format } from "date-fns"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Input } from "@/components/ui/input"

const MATURITY_COLUMNS = [
  { key: "y_1m", label: "1M" },
  { key: "y_3m", label: "3M" },
  { key: "y_6m", label: "6M" },
  { key: "y_1y", label: "1Y" },
  { key: "y_2y", label: "2Y" },
  { key: "y_3y", label: "3Y" },
  { key: "y_5y", label: "5Y" },
  { key: "y_7y", label: "7Y" },
  { key: "y_10y", label: "10Y" },
  { key: "y_20y", label: "20Y" },
  { key: "y_30y", label: "30Y" },
] as const

interface YieldRow {
  date: string
  [key: string]: string | number | null
}

interface ChartDataPoint {
  maturity: string
  yield: number | null
  pinnedYield?: number | null
}

interface PinnedData {
  date: string
  points: { maturity: string; yield: number | null }[]
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; dataKey: string }>
  label?: string
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-background/95 px-3 py-2 backdrop-blur-sm">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {payload.map((entry) => (
          <p key={entry.dataKey} className="text-sm text-foreground/70">
            {entry.dataKey === "pinnedYield" ? (
              <>
                Pinned: <span className="font-medium text-amber-400">{entry.value?.toFixed(2)}%</span>
              </>
            ) : (
              <>
                Yield: <span className="font-medium text-foreground">{entry.value?.toFixed(2)}%</span>
              </>
            )}
          </p>
        ))}
      </div>
    )
  }
  return null
}

interface YieldCurveChartProps {
  onYieldDataChange?: (data: YieldRow | null, loading: boolean) => void
}

export function YieldCurveChart({ onYieldDataChange }: YieldCurveChartProps) {
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [currentRecord, setCurrentRecord] = useState<YieldRow | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [marketRegime, setMarketRegime] = useState<string | null>(null)
  const [pinnedData, setPinnedData] = useState<PinnedData | null>(null)
  const [initialized, setInitialized] = useState(false)

  const onYieldDataChangeRef = useRef(onYieldDataChange)
  onYieldDataChangeRef.current = onYieldDataChange

  const pinnedDataRef = useRef(pinnedData)
  pinnedDataRef.current = pinnedData

  const mergeWithPinned = useCallback(
    (points: { maturity: string; yield: number | null }[], pinned: PinnedData | null): ChartDataPoint[] => {
      return points.map((p) => {
        const pinnedPoint = pinned?.points.find((pp) => pp.maturity === p.maturity)
        return {
          ...p,
          pinnedYield: pinnedPoint?.yield ?? null,
        }
      })
    },
    []
  )

  const fetchYieldData = useCallback(
    async (dateStr: string) => {
      setLoading(true)
      setError(null)

      const supabase = createClient()

      const start = new Date(dateStr + "T00:00:00Z")
      const end = new Date(dateStr + "T23:59:59Z")

      if (isNaN(start.getTime())) {
        setError("Invalid date.")
        setLoading(false)
        return
      }

      const { data, error: fetchError } = await supabase
        .from("yield_curve_data")
        .select("*")
        .gte("date", start.toISOString())
        .lte("date", end.toISOString())
        .limit(1)

      if (fetchError) {
        setError("Failed to fetch yield data.")
        setLoading(false)
        return
      }

      if (!data || data.length === 0) {
        setError("No data available for this date.")
        setChartData([])
        setLoading(false)
        return
      }

      const row: YieldRow = data[0]
      const points = MATURITY_COLUMNS.map((col) => ({
        maturity: col.label,
        yield: row[col.key] != null ? Number(row[col.key]) : null,
      }))

      const PC1 = row.PC1 != null ? Number(row.PC1) : null
      const PC2 = row.PC2 != null ? Number(row.PC2) : null

      let regime: string | null = null
      if (PC1 != null && PC2 != null) {
        const direction = PC1 > 0 ? "Bear" : PC1 < 0 ? "Bull" : "Neutral"
        const slope = PC2 > 0 ? "Steepening" : PC2 < 0 ? "Flattening" : "Neutral"
        regime = `Market Regime: ${direction} ${slope}`
      }

      setMarketRegime(regime)
      setChartData(mergeWithPinned(points, pinnedDataRef.current))
      setCurrentRecord(row)
      setLoading(false)

      onYieldDataChangeRef.current?.(row, false)
    },
    [mergeWithPinned]
  )

  // Fetch most recent date on mount — runs once
  useEffect(() => {
    if (initialized) return
    setInitialized(true)

    async function fetchLatestDate() {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from("yield_curve_data")
        .select("date")
        .order("date", { ascending: false })
        .limit(1)

      if (fetchError || !data || data.length === 0) {
        setError("Could not load latest data.")
        return
      }

      const latestDateStr = data[0].date.split("T")[0]
      setSelectedDate(latestDateStr)
      fetchYieldData(latestDateStr)
    }

    fetchLatestDate()
  }, [initialized, fetchYieldData])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSelectedDate(val)
    if (val) {
      fetchYieldData(val)
    }
  }

  const handlePin = () => {
    if (!currentRecord || !selectedDate) return

    if (pinnedData?.date === selectedDate) return

    const points = MATURITY_COLUMNS.map((col) => ({
      maturity: col.label,
      yield: currentRecord[col.key] != null ? Number(currentRecord[col.key]) : null,
    }))

    const newPinned: PinnedData = { date: selectedDate, points }
    setPinnedData(newPinned)
    pinnedDataRef.current = newPinned
    setChartData((prev) => mergeWithPinned(prev, newPinned))
  }

  const handleUnpin = () => {
    setPinnedData(null)
    pinnedDataRef.current = null
    setChartData((prev) =>
      prev.map((p) => ({ ...p, pinnedYield: undefined }))
    )
  }

  const isPinned = pinnedData !== null

  const allYields = [
    ...chartData.map((d) => d.yield),
    ...chartData.map((d) => d.pinnedYield ?? null),
  ].filter((v): v is number => v != null)

  const yMin = allYields.length > 0 ? Math.floor(Math.min(...allYields) * 10) / 10 - 0.2 : 0
  const yMax = allYields.length > 0 ? Math.ceil(Math.max(...allYields) * 10) / 10 + 0.2 : 6

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start sm:gap-3">
          <span className="text-sm font-medium text-foreground/70">Date:</span>
          <div className="relative">
            <Input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-[160px] appearance-none border-foreground/10 bg-foreground/5 pr-8 text-foreground sm:w-[150px] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground/50"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {isPinned ? (
            <button
              onClick={handleUnpin}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 transition-all hover:bg-red-500/20 hover:text-red-400"
              title="Unpin curve"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handlePin}
              disabled={!currentRecord || loading}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5 text-foreground/50 transition-all hover:bg-foreground/10 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
              title="Pin current curve"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="17" x2="12" y2="22" />
                <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex flex-1 items-center justify-center rounded-lg bg-card/60 px-4 py-2.5 backdrop-blur-sm sm:ml-4">
          <span className="text-sm font-medium text-foreground/70">
            {marketRegime || "Market Regime: —"}
          </span>
        </div>
      </div>

      <div className="relative w-full rounded-xl bg-card/60 p-4 backdrop-blur-sm">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/60 backdrop-blur-sm">
            <p className="text-sm text-foreground/50">Loading...</p>
          </div>
        )}
        {error && !loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/60 backdrop-blur-sm">
            <p className="text-sm text-foreground/50">{error}</p>
          </div>
        )}
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 16, right: 24, left: 8, bottom: 8 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
            />
            <XAxis
              dataKey="maturity"
              tick={{ fill: "rgba(255,255,255,0.8)", fontSize: 12 }}
              axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
              tickLine={{ stroke: "rgba(255,255,255,0.2)" }}
              label={{
                value: "Maturity",
                position: "insideBottom",
                offset: -4,
                fill: "rgba(255,255,255,0.8)",
                fontSize: 13,
              }}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.8)", fontSize: 12 }}
              axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
              tickLine={{ stroke: "rgba(255,255,255,0.2)" }}
              domain={[yMin, yMax]}
              tickFormatter={(v: number) => `${v.toFixed(1)}%`}
              label={{
                value: "Bond Yield",
                angle: -90,
                position: "insideLeft",
                offset: 4,
                fill: "rgba(255,255,255,0.8)",
                fontSize: 13,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            {pinnedData && (
              <Line
                type="monotone"
                dataKey="pinnedYield"
                stroke="rgba(251,191,36,0.7)"
                strokeWidth={2}
                strokeDasharray="6 3"
                dot={{
                  r: 3,
                  fill: "rgba(251,191,36,0.8)",
                  stroke: "rgba(251,191,36,0.3)",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 5,
                  fill: "rgba(251,191,36,1)",
                  stroke: "rgba(251,191,36,0.4)",
                  strokeWidth: 2,
                }}
                connectNulls
                name="Pinned"
              />
            )}
            <Line
              type="monotone"
              dataKey="yield"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth={2}
              dot={{
                r: 4,
                fill: "rgba(255,255,255,0.9)",
                stroke: "rgba(255,255,255,0.3)",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "white",
                stroke: "rgba(255,255,255,0.4)",
                strokeWidth: 2,
              }}
              connectNulls
              name="Current"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}