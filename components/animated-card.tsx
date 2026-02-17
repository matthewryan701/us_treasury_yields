"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedCard({ children, className = "" }: AnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={cardRef}
      className={`group relative rounded-2xl border border-white/20 bg-white/5 p-8 backdrop-blur-sm transition-all duration-700 hover:border-white/40 hover:bg-white/10 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      } ${className}`}
    >
      {/* Animated glow effect */}
      <span className="absolute inset-0 -z-10 rounded-2xl bg-white/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

      {/* Animated border gradient */}
      <span className="absolute inset-0 -z-20 animate-pulse rounded-2xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 blur-sm" />

      {/* Outer enchanted glow */}
      <span className="absolute -inset-1 -z-30 rounded-2xl bg-white/5 blur-md" />

      {children}
    </div>
  )
}
