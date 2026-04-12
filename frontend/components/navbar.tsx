"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  const mobileNavLinks = [
    { href: "/yield-curve", label: "Yield Curve" },
    { href: "/valuation", label: "Valuation" },
    { href: "/duration", label: "Duration" },
    { href: "/documentation", label: "Documentation" },
    { href: "/about", label: "About" },
  ]

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={`fixed left-1/2 top-4 z-50 w-[92%] max-w-7xl -translate-x-1/2 transition-all duration-300 hidden lg:block ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
      >
        <div className="flex items-center justify-between rounded-full border border-foreground/10 bg-background/80 px-8 py-4 backdrop-blur-md">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
            YieldLabs
          </Link>

          {/* Navigation Links - centered */}
          <div className="flex items-center gap-10">
            <Link href="/yield-curve" className="text-sm text-foreground/70 transition-colors hover:text-foreground">
              Yield Curve
            </Link>
            <Link href="/valuation" className="text-sm text-foreground/70 transition-colors hover:text-foreground">
              Valuation
            </Link>
            <Link href="/duration" className="text-sm text-foreground/70 transition-colors hover:text-foreground">
              Duration
            </Link>
            <Link href="/documentation" className="text-sm text-foreground/70 transition-colors hover:text-foreground">
              Documentation
            </Link>
            <Link href="/about" className="text-sm text-foreground/70 transition-colors hover:text-foreground">
              About
            </Link>
          </div>

          {/* GitHub button on the right */}
          <a
            href="https://github.com/matthewryan701/us_treasury_yields"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/70 transition-colors hover:text-foreground"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav
        className={`fixed left-1/2 top-4 z-50 w-[90%] -translate-x-1/2 transition-all duration-300 lg:hidden ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
      >
        <div className="flex items-center justify-between rounded-full border border-foreground/10 bg-background/95 px-5 py-3 backdrop-blur-md">
          {/* Logo */}
          <Link href="/" className="text-lg font-bold tracking-tight text-foreground">
            YieldLabs
          </Link>

          {/* Right side - GitHub + Hamburger */}
          <div className="flex items-center gap-4">
            {/* GitHub button */}
            <a
              href="https://github.com/matthewryan701/us_treasury_yields"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 transition-colors hover:text-foreground"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>

            {/* Hamburger / Close icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground/70 transition-colors hover:text-foreground"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-white transition-transform duration-300 ease-in-out lg:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex h-full flex-col px-8 pt-24">
          <div className="flex flex-col gap-6">
            {mobileNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-bold text-black transition-opacity hover:opacity-70"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
