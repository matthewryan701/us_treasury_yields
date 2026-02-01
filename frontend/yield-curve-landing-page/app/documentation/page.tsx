import { HexagonPattern } from "@/components/hexagon-pattern"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function DocumentationPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 z-0">
        <HexagonPattern />
      </div>

      <section className="relative z-10 flex h-screen w-full flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-foreground md:text-8xl">Documentation</h1>
          <p className="mt-4 text-lg text-foreground/70">Learn how to use YieldLabs and access API documentation.</p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
