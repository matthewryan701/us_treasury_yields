import { HexagonPattern } from "@/components/hexagon-pattern"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqData = [
  {
    question: "What is this tool?",
    answer: "This application visualises the US Treasury yield curve across different maturities and allows you to explore how the curve behaves over time using interpolation and stochastic interest-rate models."
  },
  {
    question: "Where does the yield data come from?",
    answer: "All yield data is sourced from the FRED (Federal Reserve Bank of St. Louis), using publicly available daily yield curve rates. No proprietary or paid data sources are used."
  },
  {
    question: "How often is the data updated?",
    answer: "The data is updated daily, typically after the Treasury publishes the latest rates. If markets are closed (weekends or holidays), the most recent available data is shown."
  },
  {
    question: "What maturities are included?",
    answer: "The visualiser includes standard Treasury maturities ranging from 1 month to 30 years, depending on data availability for the selected date."
  },
  {
    question: "What is interpolation and why is it used?",
    answer: "Interpolation is used to estimate yields at maturities where no exact Treasury instrument exists. This helps create a smooth and continuous yield curve rather than a set of disconnected points."
  },
  {
    question: "Which interpolation methods are supported?",
    answer: "Common methods include: Linear interpolation, Cubic spline interpolation, Nelson-Siegel, and Nelson-Siegel Svensson. Each method has different trade-offs between smoothness and realism."
  },
  {
    question: "What stochastic models are available?",
    answer: "The stochastic models tab allows you to explore yield curve dynamics using models such as: Vasicek, Cox-Ingersoll-Ross (CIR), Hull-White, and Ho-Lee. These models are for educational and exploratory purposes."
  },
  {
    question: "Are these models meant for trading or investment decisions?",
    answer: "No. This tool is not financial advice and should not be used as the sole basis for trading or investment decisions. It is designed for learning, research, and visual exploration."
  },
  {
    question: "Who is this tool for?",
    answer: "This tool is useful for: Students learning fixed income concepts, Researchers exploring yield curve dynamics, Developers building financial visualisations, and Anyone curious about interest rates."
  },
  {
    question: "How can I report a bug or suggest a feature?",
    answer: "Please visit the About or Documentation tab for contact details and contribution guidelines."
  }
]

export default function FAQPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 z-0">
        <HexagonPattern />
      </div>

      <section className="relative z-10 flex min-h-screen w-full flex-col items-center px-4 pt-32 pb-20">
        <div className="w-full max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="text-6xl font-bold text-foreground md:text-8xl">FAQ</h1>
            <p className="mt-4 text-lg text-foreground/70">Frequently asked questions about YieldLabs.</p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqData.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="rounded-xl border border-foreground/10 bg-foreground/5 px-6 backdrop-blur-sm"
              >
                <AccordionTrigger className="text-left text-lg font-medium text-foreground hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-foreground/70">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Footer />
    </main>
  )
}
