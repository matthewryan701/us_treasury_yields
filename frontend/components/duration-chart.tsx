"use client"

import { useState, useEffect, useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

const MATURITY_OPTIONS = [
  "1Y", "2Y", "3Y", "5Y", "7Y", "10Y", "20Y", "30Y",
] as const

type DurationType = "macaulay" | "modified"

interface DurationRow {
  date: string
  maturity: string
  yield: number
  macaulay_duration: number
  modified_duration: number
}

interface ChartDataPoint {
  date: string
  displayDate: string
  duration: number
  yieldValue: number
  pinnedDuration?: number | null
}

interface PinnedConfig {
  maturity: string
  durationType: DurationType
  startDate: string
  endDate: string
  data: DurationRow[]
}

function CustomTooltip({
  active,
  payload,
  label,
  durationType,
}: {
  active?: boolean
  payload?: Array<{ value: number; dataKey: string }>
  label?: string
  durationType: DurationType
}) {
  if (active && payload && payload.length) {
    const durationEntry = payload.find((e) => e.dataKey === "duration")
    const pinnedEntry = payload.find((e) => e.dataKey === "pinnedDuration")
    return (
      <div className="rounded-lg bg-background/95 px-3 py-2 backdrop-blur-sm">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {durationEntry && !isNaN(durationEntry.value) && (
          <p className="text-sm text-foreground/70">
            {durationType === "macaulay" ? "Macaulay" : "Modified"} Duration:{" "}
            <span className="font-medium text-foreground">
              {durationEntry.value?.toFixed(4)} yrs
            </span>
          </p>
        )}
        {pinnedEntry && pinnedEntry.value != null && (
          <p className="text-sm text-foreground/70">
            Pinned:{" "}
            <span className="font-medium text-amber-400">
              {pinnedEntry.value?.toFixed(4)} yrs
            </span>
          </p>
        )}
      </div>
    )
  }
  return null
}

export function DurationChart() {
  const [maturity, setMaturity] = useState<string>("10Y")
  const [durationType, setDurationType] = useState<DurationType>("macaulay")
  const [data, setData] = useState<DurationRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [datesInitialized, setDatesInitialized] = useState(false)
  const [pinnedConfig, setPinnedConfig] = useState<PinnedConfig | null>(null)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)")
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  // Initialize default date range from the latest record
  useEffect(() => {
    async function initDates() {
      try {
        const supabase = createClient()
        const { data: latestRows, error: err } = await supabase
          .from("treasury_duration")
          .select("date")
          .eq("maturity", maturity)
          .order("date", { ascending: false })
          .limit(1)

        if (err) throw err
        if (latestRows && latestRows.length > 0) {
          const latest = new Date(latestRows[0].date + "T00:00:00")
          const fiveBack = new Date(latest)
          fiveBack.setFullYear(fiveBack.getFullYear() - 5)
          setEndDate(latestRows[0].date)
          setStartDate(fiveBack.toISOString().split("T")[0])
        }
      } catch {
        // fallback: leave empty, fetch will handle it
      } finally {
        setDatesInitialized(true)
      }
    }
    initDates()
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!datesInitialized) return

    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        const supabase = createClient()

        let allRows: DurationRow[] = []
        const pageSize = 1000
        let from = 0
        let hasMore = true

        while (hasMore) {
          let query = supabase
            .from("treasury_duration")
            .select("date, maturity, yield, macaulay_duration, modified_duration")
            .eq("maturity", maturity)
            .order("date", { ascending: true })
            .range(from, from + pageSize - 1)

          if (startDate) query = query.gte("date", startDate)
          if (endDate) query = query.lte("date", endDate)

          const { data: rows, error: fetchError } = await query

          if (fetchError) throw fetchError

          if (rows && rows.length > 0) {
            allRows = allRows.concat(rows)
            from += pageSize
            hasMore = rows.length === pageSize
          } else {
            hasMore = false
          }
        }

        setData(allRows)
      } catch (err: any) {
        setError(err.message ?? "Failed to fetch duration data")
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [maturity, startDate, endDate, datesInitialized])

  const pinnedMap = useMemo(() => {
    if (!pinnedConfig) return null
    const map = new Map<string, number>()
    for (const row of pinnedConfig.data) {
      const val =
        pinnedConfig.durationType === "macaulay"
          ? Number(row.macaulay_duration)
          : Number(row.modified_duration)
      map.set(row.date, val)
    }
    return map
  }, [pinnedConfig])

  const chartData: ChartDataPoint[] = useMemo(() => {
    // Collect all dates from both datasets
    const dateSet = new Set<string>()
    for (const row of data) dateSet.add(row.date)
    if (pinnedConfig) {
      for (const row of pinnedConfig.data) dateSet.add(row.date)
    }
    const allDates = Array.from(dateSet).sort()

    const currentMap = new Map<string, DurationRow>()
    for (const row of data) currentMap.set(row.date, row)

    return allDates.map((date) => {
      const row = currentMap.get(date)
      return {
        date,
        displayDate: new Date(date + "T00:00:00").toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        }),
        duration: row
          ? durationType === "macaulay"
            ? Number(row.macaulay_duration)
            : Number(row.modified_duration)
          : NaN,
        yieldValue: row ? Number(row.yield) : NaN,
        pinnedDuration: pinnedMap?.get(date) ?? null,
      }
    })
  }, [data, durationType, pinnedConfig, pinnedMap])

  const latestDate = data.length > 0 ? data[data.length - 1].date : null

  const isPinned = pinnedConfig !== null
  const isCurrentConfigPinned =
    pinnedConfig !== null &&
    pinnedConfig.maturity === maturity &&
    pinnedConfig.durationType === durationType &&
    pinnedConfig.startDate === startDate &&
    pinnedConfig.endDate === endDate

  const handlePin = () => {
    if (isCurrentConfigPinned) return
    setPinnedConfig({ maturity, durationType, startDate, endDate, data: [...data] })
  }

  const handleUnpin = () => {
    setPinnedConfig(null)
  }

  const yDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 1]
    const vals = [
      ...chartData.map((d) => d.duration),
      ...chartData.map((d) => d.pinnedDuration ?? NaN),
    ].filter((v) => !isNaN(v))
    if (vals.length === 0) return [0, 1]
    const min = Math.min(...vals)
    const max = Math.max(...vals)
    const pad = (max - min) * 0.1 || 0.5
    return [Math.max(0, Math.floor((min - pad) * 10) / 10), Math.ceil((max + pad) * 10) / 10]
  }, [chartData])

  // Thin out tick labels so they don't overlap
  const xTicks = useMemo(() => {
    if (chartData.length === 0) return []
    const target = isMobile ? 4 : 8
    const step = Math.max(1, Math.floor(chartData.length / target))
    return chartData.filter((_, i) => i % step === 0).map((d) => d.date)
  }, [chartData, isMobile])

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Controls */}
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
          <span className="text-sm font-medium text-foreground/70">Maturity:</span>
          <Select value={maturity} onValueChange={setMaturity}>
            <SelectTrigger className="w-[120px] border-foreground/10 bg-foreground/5 text-foreground sm:w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-foreground/10 bg-background">
              {MATURITY_OPTIONS.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-full items-center sm:w-auto sm:justify-start">
          <div className="flex w-full items-center rounded-lg bg-foreground/5 p-1 sm:w-auto">
            <button
              onClick={() => setDurationType("macaulay")}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm transition-all sm:flex-none ${durationType === "macaulay"
                ? "bg-foreground/10 font-bold text-foreground"
                : "font-normal text-foreground/40 hover:text-foreground/60"
                }`}
            >
              Macaulay
            </button>
            <button
              onClick={() => setDurationType("modified")}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm transition-all sm:flex-none ${durationType === "modified"
                ? "bg-foreground/10 font-bold text-foreground"
                : "font-normal text-foreground/40 hover:text-foreground/60"
                }`}
            >
              Modified
            </button>
          </div>
        </div>

        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
          <span className="text-sm font-medium text-foreground/70">From:</span>
          <div className="relative">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
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
        </div>

        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
          <span className="text-sm font-medium text-foreground/70">To:</span>
          <div className="relative">
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
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
        </div>

        {/* Pin button — hidden on mobile, shown inline on desktop */}
        <div className="hidden sm:block">
          {isPinned ? (
            <button
              onClick={handleUnpin}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 transition-all hover:bg-red-500/20 hover:text-red-400"
              title="Unpin curve"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handlePin}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5 text-foreground/50 transition-all hover:bg-foreground/10 hover:text-foreground"
              title="Pin current curve"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="17" x2="12" y2="22" />
                <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Pin button — top right on mobile only */}
      <div className="flex justify-end sm:hidden">
        {isPinned ? (
          <button
            onClick={handleUnpin}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 transition-all hover:bg-red-500/20 hover:text-red-400"
            title="Unpin curve"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handlePin}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5 text-foreground/50 transition-all hover:bg-foreground/10 hover:text-foreground"
            title="Pin current curve"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="17" x2="12" y2="22" />
              <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
            </svg>
          </button>
        )}
      </div>

      {/* Time series chart */}
      <div className="relative w-full rounded-xl bg-card/60 p-4 backdrop-blur-sm">
        {loading ? (
          <div className="flex h-[400px] items-center justify-center">
            <p className="text-sm text-foreground/50">Loading chart…</p>
          </div>
        ) : error ? (
          <div className="flex h-[400px] items-center justify-center">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-[400px] items-center justify-center">
            <p className="text-sm text-foreground/50">No data available.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={chartData}
              margin={{ top: 16, right: 24, left: 16, bottom: 8 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
              />
              <XAxis
                dataKey="date"
                ticks={xTicks}
                tickFormatter={(v: string) => {
                  const d = new Date(v + "T00:00:00")
                  return d.toLocaleDateString("en-US", {
                    month: "short",
                    year: "2-digit",
                  })
                }}
                tick={
                  isMobile
                    ? { fill: "rgba(255,255,255,0.8)", fontSize: 10 }
                    : { fill: "rgba(255,255,255,0.8)", fontSize: 12 }
                }
                axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
                tickLine={{ stroke: "rgba(255,255,255,0.2)" }}
                label={{
                  value: "Date",
                  position: "insideBottom",
                  offset: -4,
                  fill: "rgba(255,255,255,0.8)",
                  fontSize: 13,
                }}
              />
              <YAxis
                domain={yDomain}
                tick={{ fill: "rgba(255,255,255,0.8)", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
                tickLine={{ stroke: "rgba(255,255,255,0.2)" }}
                tickFormatter={(v: number) => v.toFixed(2)}
                label={{
                  value:
                    durationType === "macaulay"
                      ? "Macaulay Duration (yrs)"
                      : "Modified Duration (yrs)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 4,
                  fill: "rgba(255,255,255,0.8)",
                  fontSize: 13,
                }}
              />
              <Tooltip
                content={<CustomTooltip durationType={durationType} />}
              />
              {pinnedConfig && (
                <Line
                  type="monotone"
                  dataKey="pinnedDuration"
                  stroke="rgba(251,191,36,0.7)"
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  dot={false}
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
                dataKey="duration"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 6,
                  fill: "white",
                  stroke: "rgba(255,255,255,0.4)",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Formula & Description */}
      <div className="flex flex-col gap-4 rounded-xl bg-card/60 px-6 py-6 backdrop-blur-sm lg:flex-row lg:gap-8">
        {/* Left side — formulae + labels */}
        <div className="flex flex-col items-start gap-5 lg:shrink-0">
          {/* Macaulay Duration */}
          <div className="flex flex-col items-start gap-3">
            <img
              src="https://latex.codecogs.com/svg.image?\color{white}D_{Mac}=\frac{\sum_{t=1}^{n}t\cdot\frac{C_t}{(1+y)^t}}{P}"
              alt="Macaulay Duration formula"
              className="h-14"
            />
            <div className="flex flex-col items-start gap-1.5">
              <span className="flex items-center gap-2 text-xs text-foreground/50">
                <img src="https://latex.codecogs.com/svg.image?\color{white}D_{Mac}" alt="D_Mac" className="h-3.5" />
                <span>= Macaulay Duration</span>
              </span>
              <span className="flex items-center gap-2 text-xs text-foreground/50">
                <img src="https://latex.codecogs.com/svg.image?\color{white}C_t" alt="C_t" className="h-3.5" />
                <span>= Cash flow at time t</span>
              </span>
              <span className="flex items-center gap-2 text-xs text-foreground/50">
                <img src="https://latex.codecogs.com/svg.image?\color{white}y" alt="y" className="h-3" />
                <span>= Yield to Maturity</span>
              </span>
              <span className="flex items-center gap-2 text-xs text-foreground/50">
                <img src="https://latex.codecogs.com/svg.image?\color{white}P" alt="P" className="h-3" />
                <span>= Bond Price</span>
              </span>
              <span className="flex items-center gap-2 text-xs text-foreground/50">
                <img src="https://latex.codecogs.com/svg.image?\color{white}t" alt="t" className="h-3" />
                <span>= Time period</span>
              </span>
              <span className="flex items-center gap-2 text-xs text-foreground/50">
                <img src="https://latex.codecogs.com/svg.image?\color{white}n" alt="n" className="h-3" />
                <span>= Total number of periods</span>
              </span>
            </div>
          </div>

          {/* Modified Duration */}
          <div className="flex flex-col items-start gap-3">
            <img
              src="https://latex.codecogs.com/svg.image?\color{white}D_{Mod}=\frac{D_{Mac}}{1+\frac{y}{m}}"
              alt="Modified Duration formula"
              className="h-14"
            />
            <div className="flex flex-col items-start gap-1.5">
              <span className="flex items-center gap-2 text-xs text-foreground/50">
                <img src="https://latex.codecogs.com/svg.image?\color{white}D_{Mod}" alt="D_Mod" className="h-3.5" />
                <span>= Modified Duration</span>
              </span>
              <span className="flex items-center gap-2 text-xs text-foreground/50">
                <img src="https://latex.codecogs.com/svg.image?\color{white}m" alt="m" className="h-3" />
                <span>= Compounding periods per year</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right side — description (desktop: beside, mobile: below) */}
        <div className="text-sm leading-relaxed text-foreground/60 lg:border-l lg:border-foreground/10 lg:pl-8">
          <p>
            The formulae shown are used to represent the Macaulay Duration and the Modified Duration.
          </p>
          <p className="mt-3">
            There is a subtle difference between the two. The <span className="font-medium text-foreground/80">Macaulay Duration</span> is the weighted average time to receive all of a bond's future cash flows, measuring on average how long you are at risk of interest rate changes for. The <span className="font-medium text-foreground/80">Modified Duration</span> measures the sensitivity of a bond's price to a change in interest rates; it represents the percentage change of a bond's price for a 100 basis point change in interest rates.
          </p>
          <p className="mt-3">
            Since the data from FRED represents the CMT par yields of bonds, the assumption is that the coupon yield is equal to the discount rate. This makes the bonds par value. This means all calculations of duration are made from the standpoint of a par value bond.
          </p>
        </div>
      </div>
    </div>
  )
}