"use client"

import Link from "next/link"
import { ArrowLeft, X, BookOpen, Shield } from "lucide-react"
import { useJourney, type JourneyType } from "@/lib/journey-context"
import { ProgressBar } from "./progress-bar"
import { cn } from "@/lib/utils"

interface JourneyLayoutProps {
  children: React.ReactNode
  type: JourneyType
}

export function JourneyLayout({ children, type }: JourneyLayoutProps) {
  const { progress, previousStep } = useJourney()
  const isFirstStep = progress.currentStep === 0

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header — matching glass style from landing */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="px-4 md:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Back / Close */}
            <div className="flex items-center gap-3">
              {isFirstStep ? (
                <Link
                  href="/"
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:bg-secondary transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span className="sr-only">Stäng</span>
                </Link>
              ) : (
                <button
                  onClick={previousStep}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:bg-secondary transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="sr-only">Tillbaka</span>
                </button>
              )}

              <div className="hidden sm:flex items-center gap-2.5">
                <div className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-lg",
                  type === "learn" ? "bg-primary/10 text-primary" : "bg-accent/20 text-accent-foreground"
                )}>
                  {type === "learn" ? (
                    <BookOpen className="w-4 h-4" />
                  ) : (
                    <Shield className="w-4 h-4" />
                  )}
                </div>
                <span className="text-sm font-medium">
                  {type === "learn" ? "Använd AI" : "Skydda dig"}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex-1 max-w-md">
              <ProgressBar />
            </div>

            {/* Exit */}
            <Link
              href="/"
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Avsluta
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  )
}
