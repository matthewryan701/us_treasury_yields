"use client"

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

interface StatisticsCardMobileProps {
  record: YieldRecord | null
  loading: boolean
}

export function StatisticsCardMobile({ record, loading }: StatisticsCardMobileProps) {
  return (
    <div className="w-full rounded-xl bg-card/60 p-4 backdrop-blur-sm">
      <h3 className="text-center text-base font-bold text-foreground">
        Statistics
      </h3>

      {loading && (
        <div className="mt-4 flex items-center justify-center py-4">
          <p className="text-xs text-foreground/30">Loading...</p>
        </div>
      )}

      {record && !loading && (
        <div className="mt-3 grid grid-cols-2 gap-x-4">
          <div>
            <p className="text-center text-sm font-bold text-foreground">Spreads</p>
            <div className="mt-2 border-t border-foreground/10" />
            <div className="mt-3 flex flex-col gap-2.5">
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
          </div>

          <div>
            <p className="text-center text-sm font-bold text-foreground">Components</p>
            <div className="mt-2 border-t border-foreground/10" />
            <div className="mt-3 flex flex-col gap-2.5">
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
          </div>
        </div>
      )}
    </div>
  )
}