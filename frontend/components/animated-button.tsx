"use client"

interface AnimatedButtonProps {
  onClick?: () => void
}

export function AnimatedButton({ onClick }: AnimatedButtonProps) {
  return (
    <button
      onClick={onClick}
      className="group relative flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10"
    >
      {/* Animated glow effect */}
      <span className="absolute inset-0 -z-10 rounded-full bg-white/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

      {/* Animated border gradient */}
      <span className="absolute inset-0 -z-20 animate-pulse rounded-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 blur-sm" />

      {/* Outer enchanted glow */}
      <span className="absolute -inset-1 -z-30 rounded-full bg-white/5 blur-md" />

      <span>Get started</span>
    </button>
  )
}
