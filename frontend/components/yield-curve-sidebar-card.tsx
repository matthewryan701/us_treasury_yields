interface YieldCurveSidebarCardProps {
  title: string
  side: "left" | "right"
}

export function YieldCurveSidebarCard({ title, side }: YieldCurveSidebarCardProps) {
  return (
    <div className="flex h-full w-full flex-col rounded-xl border border-foreground/10 bg-foreground/5 p-5 backdrop-blur-sm">
      <h3 className="text-sm font-medium text-foreground/70">{title}</h3>
      <div className="mt-4 flex flex-1 items-center justify-center">
        <p className="text-xs text-foreground/30">
          {side === "left" ? "Statistics" : "Controls"} coming soon
        </p>
      </div>
    </div>
  )
}
