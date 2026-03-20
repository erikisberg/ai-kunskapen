"use client"

import Link from "next/link"
import { ArrowLeft, X, BookOpen, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b-2 border-foreground">
        <div className="px-4 md:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Back / Logo */}
            <div className="flex items-center gap-4">
              {isFirstStep ? (
                <Button variant="ghost" size="icon" className="rounded-xl border-2 border-foreground" asChild>
                  <Link href="/">
                    <X className="w-5 h-5" />
                    <span className="sr-only">Stang</span>
                  </Link>
                </Button>
              ) : (
                <Button variant="ghost" size="icon" className="rounded-xl border-2 border-foreground" onClick={previousStep}>
                  <ArrowLeft className="w-5 h-5" />
                  <span className="sr-only">Tillbaka</span>
                </Button>
              )}
              
              <div className="hidden sm:flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 flex items-center justify-center border-2 border-foreground rounded-xl",
                  type === "learn" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
                )}>
                  {type === "learn" ? (
                    <BookOpen className="w-5 h-5" />
                  ) : (
                    <Shield className="w-5 h-5" />
                  )}
                </div>
                <span className="text-sm font-semibold uppercase tracking-wide">
                  {type === "learn" ? "Anvand AI" : "Skydda dig"}
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
              className="text-sm font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors"
            >
              [ Avsluta ]
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
