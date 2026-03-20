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
            "w-32 h-32 flex items-center justify-center mx-auto border-2 border-foreground",
            type === "learn" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
          )}>
            <Award className="w-14 h-14" />
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-card border-2 border-foreground">
            <span className="font-[family-name:var(--font-display)] text-sm tracking-[-0.02em] uppercase">AVKLARAT</span>
          </div>
        </div>

        <h1 className="font-[family-name:var(--font-display)] text-[clamp(2rem,6vw,4rem)] leading-[0.9] tracking-[-0.045em] uppercase mb-8 mt-4">
          {type === "learn" 
            ? <>GRATTIS!<br /><span className="text-primary">DU AR REDO</span></> 
            : <>BRA JOBBAT!<br /><span className="text-primary">DU AR FORBEREDD</span></>
          }
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed">
          {type === "learn"
            ? "Du har lart dig grunderna i hur du pratar med AI-chatbotar och hur du kan anvanda dem for att gora vardagen enklare."
            : "Du har lart dig kanna igen vanliga AI-bedragarier och vet hur du skyddar dig och din familj."
          }
        </p>

        {/* Stats */}
        <div className="border-2 border-foreground p-8 mb-10">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="font-[family-name:var(--font-display)] text-5xl tracking-[-0.045em]">
                {progress.steps.length}
              </p>
              <p className="text-sm text-muted-foreground mt-2 uppercase tracking-wide">steg genomforda</p>
            </div>
            <div>
              <p className="font-[family-name:var(--font-display)] text-5xl tracking-[-0.045em]">
                {progress.startedAt && progress.completedAt 
                  ? Math.round((progress.completedAt.getTime() - progress.startedAt.getTime()) / 60000)
                  : "~20"
                }
              </p>
              <p className="text-sm text-muted-foreground mt-2 uppercase tracking-wide">minuter</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4 mb-10">
          <button
            onClick={handleShare}
            className="inline-flex items-center justify-center gap-2 w-full py-4 border-2 border-foreground hover:bg-secondary transition-colors font-[family-name:var(--font-display)] text-lg tracking-[-0.02em] uppercase"
          >
            {shared ? (
              <>
                <Check className="w-5 h-5" />
                KOPIERAT
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                DELA MED EN VAN
              </>
            )}
          </button>

          <Link 
            href={`/journey/${otherJourney}`}
            className={cn(
              "inline-flex items-center justify-center gap-3 w-full py-4 border-2 border-foreground font-[family-name:var(--font-display)] text-lg tracking-[-0.02em] uppercase transition-opacity hover:opacity-80",
              otherJourney === "learn" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
            )}
          >
            {otherJourney === "learn" ? (
              <>
                <BookOpen className="w-5 h-5" />
                FORTSATT MED &quot;ANVAND AI&quot;
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                FORTSATT MED &quot;SKYDDA DIG&quot;
              </>
            )}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home className="w-5 h-5" />
          Tillbaka till startsidan
        </Link>
      </div>
    </div>
  )
}
