"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedTitleProps {
  title: string
  className?: string
}

export function AnimatedTitle({ title, className = "" }: AnimatedTitleProps) {
  const titleRef = useRef<HTMLDivElement>(null)
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

    if (titleRef.current) {
      observer.observe(titleRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={titleRef}
      className={`flex flex-col items-center transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      } ${className}`}
    >
      <h2 className="mb-4 text-3xl font-semibold text-foreground md:text-4xl">{title}</h2>
      <div className="mb-12 h-px w-48 bg-foreground/30" />
    </div>
  )
}
