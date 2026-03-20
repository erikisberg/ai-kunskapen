"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, X, BookOpen, Shield, User } from "lucide-react"
import { useJourney, type JourneyType } from "@/lib/journey-context"
import { ProgressBar } from "./progress-bar"
import { cn } from "@/lib/utils"

interface JourneyLayoutProps {
  children: React.ReactNode
  type: JourneyType
}

function UserAvatar() {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.user?.email) setEmail(data.user.email)
      })
      .catch(() => {})
  }, [])

  if (!email) return null

  const initial = email[0].toUpperCase()

  return (
    <Link
      href="/dashboard"
      className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold shrink-0"
      title={email}
    >
      {initial}
    </Link>
  )
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

            {/* User avatar + Exit */}
            <div className="flex items-center gap-2.5">
              <UserAvatar />
              <Link
                href="/dashboard"
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Avsluta
              </Link>
            </div>
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
