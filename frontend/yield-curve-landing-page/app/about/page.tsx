import Image from "next/image"
import { HexagonPattern } from "@/components/hexagon-pattern"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 z-0">
        <HexagonPattern />
      </div>

      <section className="relative z-10 flex min-h-screen w-full flex-col items-center px-4 pt-32 pb-20">
        <div className="w-full max-w-7xl">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="text-6xl font-bold text-foreground md:text-8xl">
              About <span className="text-foreground">YieldLabs</span>
            </h1>
            <p className="mt-4 text-lg text-foreground/70">The development behind the platform.</p>
          </div>

          {/* Content Card */}
          <div className="flex flex-col gap-0 overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5 backdrop-blur-sm lg:flex-row">
            {/* Left Side - Profile Card */}
            <div className="flex flex-col items-center bg-background/50 p-8 lg:w-2/5 lg:items-start">
              {/* Profile Image */}
              <div className="mb-6 aspect-square w-full max-w-sm overflow-hidden rounded-lg">
                <Image
                  src="/images/matthew-ryan.jpg"
                  alt="Matthew Ryan"
                  width={400}
                  height={400}
                  className="h-full w-full object-cover object-top"
                />
              </div>

              {/* Name and Title */}
              <h2 className="text-3xl font-bold text-foreground">Matthew Ryan</h2>
              <p className="mt-1 text-lg font-medium uppercase tracking-wider text-foreground/70">Founder</p>
              <p className="mt-1 text-base text-foreground/60">BSc Mathematics with Data Science at LSE</p>

              {/* Contact Links */}
              <div className="mt-6 flex flex-col gap-3">
                <a
                  href="https://www.linkedin.com/in/matthewryan701/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 transition-colors hover:text-blue-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
                <a
                  href="mailto:matthewryan701@gmail.com"
                  className="flex items-center gap-2 text-blue-400 transition-colors hover:text-blue-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span>matthewryan701@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Right Side - Bio Text */}
            <div className="flex flex-col justify-center p-8 lg:w-3/5 lg:p-12">
              <h3 className="mb-4 text-2xl font-bold text-foreground">About Me</h3>
              <p className="mb-6 text-base leading-relaxed text-foreground/70">
                {"I'm a first-year BSc Mathematics with Data Science student at the London School of Economics with a strong interest in how data science is applied within finance and fintech. I was born in Budapest and moved to the UK at the age of eight, and I'm bilingual in Hungarian and English, making me adaptable and comfortable working in diverse environments."}
              </p>
              <p className="mb-8 text-base leading-relaxed text-foreground/70">
                {"My academic interests sit at the intersection of statistics, programming, and financial markets. I'm particularly drawn to problems involving real-world data, where mathematical theory meets practical decision-making - from time series analysis to risk and market modelling."}
              </p>

              <h3 className="mb-4 text-2xl font-bold text-foreground">Why YieldLabs?</h3>
              <p className="mb-6 text-base leading-relaxed text-foreground/70">
                I built YieldLabs as a way to explore how data science techniques are used in financial markets through a hands-on, end-to-end project. Yield curves are a fundamental tool in finance, yet they bring together many concepts I wanted to understand more deeply: data pipelines, interpolation methods, time series behaviour, and economic interpretation.
              </p>
              <p className="text-base leading-relaxed text-foreground/70">
                This project allows me to move beyond coursework by working with real market data, experimenting with different modelling approaches, and presenting insights in a clear and interactive way. YieldLabs reflects my broader goal: to build a strong foundation in data science while staying grounded in applications that have real financial impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
