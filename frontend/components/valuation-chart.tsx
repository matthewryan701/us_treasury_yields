"use client"

import { useState, useMemo, useEffect } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
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

const MATURITY_OPTIONS = [
  { label: "1M", value: 1 / 12 },
  { label: "2M", value: 2 / 12 },
  { label: "3M", value: 3 / 12 },
  { label: "4M", value: 4 / 12 },
  { label: "6M", value: 6 / 12 },
  { label: "1Y", value: 1 },
  { label: "2Y", value: 2 },
  { label: "3Y", value: 3 },
  { label: "5Y", value: 5 },
  { label: "7Y", value: 7 },
  { label: "10Y", value: 10 },
  { label: "20Y", value: 20 },
  { label: "30Y", value: 30 },
] as const

interface ChartDataPoint {
  rate: number
  presentValue: number
  pinnedValue?: number | null
}

interface PinnedConfig {
  faceValue: number
  couponYield: number
  maturityLabel: string
  yearsToMaturity: number
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; dataKey: string }>
  label?: number
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-background/95 px-3 py-2 backdrop-blur-sm">
        <p className="text-sm font-medium text-foreground">Rate: {label?.toFixed(1)}%</p>
        {payload.map((entry) => (
          <p key={entry.dataKey} className="text-sm text-foreground/70">
            {entry.dataKey === "pinnedValue" ? (
              <>
                Pinned PV: <span className="font-medium text-amber-400">
                  ${entry.value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </>
            ) : (
              <>
                Present Value: <span className="font-medium text-foreground">
                  ${entry.value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </>
            )}
          </p>
        ))}
      </div>
    )
  }
  return null
}

function calculatePresentValue(
  faceValue: number,
  couponYield: number,
  marketRate: number,
  yearsToMaturity: number
): number {
  const c = faceValue * (couponYield / 100)
  const r = marketRate / 100
  const n = yearsToMaturity
  const f = faceValue

  if (r === 0) {
    return c * n + f
  }

  const discountFactor = Math.pow(1 + r, -n)
  const annuityFactor = (1 - discountFactor) / r
  const presentValue = c * annuityFactor + f * discountFactor

  return presentValue
}

export function ValuationChart() {
  const [faceValue, setFaceValue] = useState(10000)
  const [maturityLabel, setMaturityLabel] = useState("10Y")
  const [couponYield, setCouponYield] = useState(4.5)
  const [isMobile, setIsMobile] = useState(false)
  const [pinnedConfig, setPinnedConfig] = useState<PinnedConfig | null>(null)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)")
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  const yearsToMaturity = useMemo(() => {
    const option = MATURITY_OPTIONS.find((o) => o.label === maturityLabel)
    return option ? option.value : 10
  }, [maturityLabel])

  const chartData = useMemo(() => {
    const data: ChartDataPoint[] = []
    for (let rate = 0; rate <= 15; rate += 0.5) {
      const pv = calculatePresentValue(faceValue, couponYield, rate, yearsToMaturity)
      const pinnedPv = pinnedConfig
        ? calculatePresentValue(pinnedConfig.faceValue, pinnedConfig.couponYield, rate, pinnedConfig.yearsToMaturity)
        : null
      data.push({
        rate,
        presentValue: pv,
        pinnedValue: pinnedPv,
      })
    }
    return data
  }, [faceValue, couponYield, yearsToMaturity, pinnedConfig])

  const pvAtCoupon = useMemo(() => {
    return calculatePresentValue(faceValue, couponYield, couponYield, yearsToMaturity)
  }, [faceValue, couponYield, yearsToMaturity])

  const pinnedPvAtCoupon = useMemo(() => {
    if (!pinnedConfig) return null
    return calculatePresentValue(pinnedConfig.faceValue, pinnedConfig.couponYield, pinnedConfig.couponYield, pinnedConfig.yearsToMaturity)
  }, [pinnedConfig])

  const allValues = [
    ...chartData.map((d) => d.presentValue),
    ...chartData.map((d) => d.pinnedValue ?? null),
  ].filter((v): v is number => v != null)

  const yMin = Math.floor(Math.min(...allValues) / 1000) * 1000
  const yMax = Math.ceil(Math.max(...allValues) / 1000) * 1000

  const isPinned = pinnedConfig !== null
  const isCurrentConfigPinned =
    pinnedConfig !== null &&
    pinnedConfig.faceValue === faceValue &&
    pinnedConfig.couponYield === couponYield &&
    pinnedConfig.maturityLabel === maturityLabel

  const handlePin = () => {
    if (isCurrentConfigPinned) return
    setPinnedConfig({ faceValue, couponYield, maturityLabel, yearsToMaturity })
  }

  const handleUnpin = () => {
    setPinnedConfig(null)
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Controls */}
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
          <span className="text-sm font-medium text-foreground/70">Face Value:</span>
          <Input
            type="number"
            value={faceValue}
            onChange={(e) => setFaceValue(Number(e.target.value) || 0)}
            className="w-[120px] border-foreground/10 bg-foreground/5 text-foreground"
          />
        </div>

        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
          <span className="text-sm font-medium text-foreground/70">Maturity:</span>
          <Select value={maturityLabel} onValueChange={setMaturityLabel}>
            <SelectTrigger className="w-[120px] border-foreground/10 bg-foreground/5 text-foreground sm:w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-foreground/10 bg-background">
              {MATURITY_OPTIONS.map((option) => (
                <SelectItem key={option.label} value={option.label}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
          <span className="text-sm font-medium text-foreground/70">Coupon Yield (%):</span>
          <Input
            type="number"
            step="0.25"
            min="0"
            max="15"
            value={couponYield}
            onChange={(e) => {
              const val = Math.round(Number(e.target.value) * 4) / 4
              setCouponYield(val || 0)
            }}
            className="w-[120px] border-foreground/10 bg-foreground/5 text-foreground sm:w-[100px]"
          />
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

      {/* Chart */}
      <div className="relative w-full rounded-xl bg-card/60 p-4 backdrop-blur-sm">
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
              dataKey="rate"
              type="number"
              domain={[0, 15]}
              ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]}
              tick={isMobile ? false : { fill: "rgba(255,255,255,0.8)", fontSize: 12 }}
              axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
              tickLine={{ stroke: "rgba(255,255,255,0.2)" }}
              tickFormatter={(v: number) => `${v.toFixed(0)}%`}
              label={{
                value: "Market Interest Rate",
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
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              label={{
                value: "Present Value",
                angle: -90,
                position: "insideLeft",
                offset: 4,
                fill: "rgba(255,255,255,0.8)",
                fontSize: 13,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              x={couponYield}
              stroke="rgba(255,255,255,0.7)"
              strokeDasharray="6 3"
              strokeWidth={2}
              label={{
                value: `Coupon: ${couponYield}%`,
                position: "top",
                fill: "rgba(255,255,255,0.85)",
                fontSize: 12,
                fontWeight: 500,
              }}
            />
            <ReferenceLine
              y={pvAtCoupon}
              stroke="rgba(255,255,255,0.7)"
              strokeDasharray="6 3"
              strokeWidth={2}
              label={{
                value: `PV: $${pvAtCoupon.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                position: "right",
                fill: "rgba(255,255,255,0.85)",
                fontSize: 12,
                fontWeight: 500,
              }}
            />
            {pinnedConfig && pinnedPvAtCoupon !== null && (
              <>
                <ReferenceLine
                  x={pinnedConfig.couponYield}
                  stroke="rgba(251,191,36,0.5)"
                  strokeDasharray="6 3"
                  strokeWidth={2}
                />
                <ReferenceLine
                  y={pinnedPvAtCoupon}
                  stroke="rgba(251,191,36,0.5)"
                  strokeDasharray="6 3"
                  strokeWidth={2}
                />
              </>
            )}
            {pinnedConfig && (
              <Line
                type="monotone"
                dataKey="pinnedValue"
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
              dataKey="presentValue"
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
      </div>

      {/* Formula & Description */}
      <div className="flex flex-col gap-4 rounded-xl bg-card/60 px-6 py-6 backdrop-blur-sm lg:flex-row lg:gap-8">
        {/* Left side — formula + labels */}
        <div className="flex flex-col items-start gap-4 lg:shrink-0">
          <img
            src="https://latex.codecogs.com/svg.image?\color{white}PV=C\cdot\frac{1-(1+r)^{-n}}{r}+F\cdot(1+r)^{-n}"
            alt="Present Value formula: PV = C × (1 - (1+r)^(-n)) / r + F × (1+r)^(-n)"
            className="h-12"
          />
          <div className="flex flex-col items-start gap-2">
            <span className="flex items-center gap-2 text-xs text-foreground/50">
              <img src="https://latex.codecogs.com/svg.image?\color{white}PV" alt="PV" className="h-3" />
              <span>= Present Value</span>
            </span>
            <span className="flex items-center gap-2 text-xs text-foreground/50">
              <img src="https://latex.codecogs.com/svg.image?\color{white}C" alt="C" className="h-3" />
              <span>= Coupon Payment</span>
            </span>
            <span className="flex items-center gap-2 text-xs text-foreground/50">
              <img src="https://latex.codecogs.com/svg.image?\color{white}r" alt="r" className="h-3" />
              <span>= Market Interest Rate</span>
            </span>
            <span className="flex items-center gap-2 text-xs text-foreground/50">
              <img src="https://latex.codecogs.com/svg.image?\color{white}n" alt="n" className="h-3" />
              <span>= Years to Maturity</span>
            </span>
            <span className="flex items-center gap-2 text-xs text-foreground/50">
              <img src="https://latex.codecogs.com/svg.image?\color{white}F" alt="F" className="h-3" />
              <span>= Face Value</span>
            </span>
          </div>
        </div>
        {/* Right side — description (desktop: beside, mobile: below) */}
        <div className="text-sm leading-relaxed text-foreground/60 lg:border-l lg:border-foreground/10 lg:pl-8">
          <p>
            The formula is used to calculate the Net Present Value of a bond, which is the discounted internal rate of return of its future cash flows.
          </p>
          <p className="mt-3">
            The graph shows the <span className="font-medium text-foreground/80">par value</span> bonds at the dashed vertical line. To the left of this are the <span className="font-medium text-foreground/80">premium bonds</span> and to the right are the <span className="font-medium text-foreground/80">discount bonds</span>.
          </p>
          <p className="mt-3">
            Bonds with higher maturities are more sensitive to changes in interest rates. Explore this with the pin feature!
          </p>
        </div>
      </div>
    </div>
  )
}