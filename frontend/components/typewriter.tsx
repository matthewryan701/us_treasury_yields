"use client"

import { useState, useEffect } from "react"

interface TypewriterProps {
  text: string
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
}

export function Typewriter({ text, typingSpeed = 30, deletingSpeed = 30, pauseDuration = 4000 }: TypewriterProps) {
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isPausedBetweenLoops, setIsPausedBetweenLoops] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (isPausedBetweenLoops) {
      timeout = setTimeout(() => {
        setIsPausedBetweenLoops(false)
      }, pauseDuration)
      return () => clearTimeout(timeout)
    }

    if (isPaused) {
      timeout = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, pauseDuration)
      return () => clearTimeout(timeout)
    }

    if (isDeleting) {
      if (displayText.length === 0) {
        setIsDeleting(false)
        setIsPausedBetweenLoops(true)
        return
      }
      timeout = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1))
      }, deletingSpeed)
    } else {
      if (displayText.length === text.length) {
        setIsPaused(true)
        return
      }
      timeout = setTimeout(() => {
        setDisplayText((prev) => text.slice(0, prev.length + 1))
      }, typingSpeed)
    }

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, isPaused, isPausedBetweenLoops, text, typingSpeed, deletingSpeed, pauseDuration])

  return (
    <span className="font-mono text-muted-foreground">
      {displayText}
      <span className="animate-blink ml-0.5 inline-block h-5 w-2.5 translate-y-0.5 bg-foreground" />
    </span>
  )
}
