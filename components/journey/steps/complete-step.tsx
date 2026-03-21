"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, Shield, Award, Home, Share2, Check } from "lucide-react"
import { useJourney, type JourneyType } from "@/lib/journey-context"
import { cn } from "@/lib/utils"
import confetti from "canvas-confetti"

interface CompleteStepProps {
  type: JourneyType
}

export function CompleteStep({ type }: CompleteStepProps) {
  const { markCurrentStepComplete, progress } = useJourney()
  const [shared, setShared] = useState(false)

  useEffect(() => {
    markCurrentStepComplete()
    
    // Celebration confetti with bold colors
    const duration = 2500
    const end = Date.now() + duration

    const colors = type === "learn"
      ? ['#7546FF', '#5a35cc', '#8b6aff']
      : ['#F8FE22', '#d4d91d', '#ffff66']

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 65,
        origin: { x: 0 },
        colors: colors
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 65,
        origin: { x: 1 },
        colors: colors
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    frame()
  }, [markCurrentStepComplete, type])

  const handleShare = async () => {
    const text = type === "learn" 
      ? "Jag har precis lart mig anvanda AI i vardagen via AI-skolan!"
      : "Jag har precis lart mig skydda mig mot AI-bedragarier via AI-skolan!"
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI-skolan',
          text: text,
          url: window.location.origin,
        })
        setShared(true)
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text + " " + window.location.origin)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    }
  }

  const otherJourney = type === "learn" ? "safe" : "learn"

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl text-center animate-slide-up">
        {/* Badge */}
        <div className="relative inline-block mb-10">
          <div className={cn(
            "w-32 h-32 flex items-center justify-center mx-auto border border-border",
            type === "learn" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
          )}>
            <Award className="w-14 h-14" />
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-card border border-border">
            <span className="font-[family-name:var(--font-display)] text-sm tracking-[-0.02em] uppercase">AVKLARAT</span>
          </div>
        </div>

        <h1 className="font-[family-name:var(--font-display)] text-[clamp(2rem,6vw,4rem)] leading-[0.9] tracking-[-0.045em] uppercase mb-8 mt-4">
          {type === "learn"
            ? <>Grattis!<br /><span className="text-primary">Du är redo</span></>
            : <>Bra jobbat!<br /><span className="text-primary">Du är förberedd</span></>
          }
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed">
          {type === "learn"
            ? "Du har lärt dig grunderna i hur du pratar med AI-chatbotar och hur du kan använda dem för att göra vardagen enklare."
            : "Du har lärt dig känna igen vanliga AI-bedrägerier och vet hur du skyddar dig och din familj."
          }
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 mb-10 max-w-sm mx-auto">
          <Link
            href={`/journey/${otherJourney}`}
            className={cn(
              "inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full font-medium transition-all hover:scale-[1.03] active:scale-[0.98]",
              otherJourney === "learn" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
            )}
          >
            {otherJourney === "learn" ? (
              <>
                <BookOpen className="w-4 h-4" />
                Fortsätt med "Använd AI"
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Fortsätt med "Förstå risken"
              </>
            )}
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full font-medium border border-border hover:bg-secondary transition-colors"
          >
            {shared ? (
              <>
                <Check className="w-4 h-4" />
                Kopierat!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                Dela med en vän
              </>
            )}
          </button>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home className="w-4 h-4" />
          Till din översikt
        </Link>
      </div>
    </div>
  )
}
