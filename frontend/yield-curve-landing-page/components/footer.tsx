import Link from "next/link"

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-foreground/10 bg-background px-4 pt-16 pb-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          {/* Platform Column */}
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-foreground">Platform</h3>
            <div className="mb-4 h-px w-full bg-foreground/20" />
            <ul className="space-y-3">
              <li>
                <Link href="/yield-curve" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                  Current Market State
                </Link>
              </li>
              <li>
                <Link href="/stochastic-models" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                  Model Dynamics
                </Link>
              </li>
              <li>
                <Link href="/documentation" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Data Sources Column */}
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-foreground">Data Sources</h3>
            <div className="mb-4 h-px w-full bg-foreground/20" />
            <ul className="space-y-3">
              <li>
                <a href="https://fred.stlouisfed.org/docs/api/fred/" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                  FRED API
                </a>
              </li>
              <li>
                <a href="https://tradingeconomics.com/api/" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                  Trading Economics API
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-foreground">Resources</h3>
            <div className="mb-4 h-px w-full bg-foreground/20" />
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <a href="https://supabase.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                  Supabase
                </a>
              </li>
              <li>
                <a href="https://fastapi.tiangolo.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                  FastAPI
                </a>
              </li>
              <li>
                <a href="https://scikit-learn.org/stable/" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                  Scikit-Learn
                </a>
              </li>
              <li>
                <a href="https://v0.app/" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                  V0
                </a>
              </li>
            </ul>
          </div>

          {/* Contacts Column */}
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-foreground">Contacts</h3>
            <div className="mb-4 h-px w-full bg-foreground/20" />
            <ul className="space-y-3">
              <li>
                <a href="https://www.linkedin.com/in/matthewryan701/" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://github.com/matthewryan701" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="mailto:matthewryan701@gmail.com" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section with logo */}
        <div className="mt-12 flex items-center justify-between border-t border-foreground/10 pt-8">
          <span className="text-2xl font-bold tracking-tight text-foreground">YieldLabs</span>
          <span className="text-sm text-foreground/50">&copy; {new Date().getFullYear()} YieldLabs. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
