"use client"

import { ArrowRight, BookOpen, Shield, Clock, Sparkles } from "lucide-react"
import { useJourney, type JourneyType } from "@/lib/journey-context"
import { cn } from "@/lib/utils"

interface IntroStepProps {
  type: JourneyType
}

export function IntroStep({ type }: IntroStepProps) {
  const { nextStep, markCurrentStepComplete } = useJourney()

  const handleStart = () => {
    markCurrentStepComplete()
    nextStep()
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl text-center animate-slide-up">
        <div className={cn(
          "w-24 h-24 flex items-center justify-center mx-auto mb-10 border-2 border-foreground",
          type === "learn" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
        )}>
          {type === "learn" ? (
            <BookOpen className="w-10 h-10" />
          ) : (
            <Shield className="w-10 h-10" />
          )}
        </div>

        <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.5rem,8vw,5rem)] leading-[0.9] tracking-[-0.045em] uppercase mb-8">
          {type === "learn" 
            ? <>VALKOMMEN TILL<br /><span className="text-primary">DIN AI-RESA</span></> 
            : <>LAR DIG<br /><span className="text-primary">SKYDDA DIG</span></>
          }
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed">
          {type === "learn"
            ? "Under de kommande minuterna kommer du att lara dig grunderna i hur du pratar med AI-chatbotar och hur du kan anvanda dem i din vardag."
            : "Under de kommande minuterna kommer du att lara dig kanna igen AI-baserade bedragarier, deepfakes och hur du skyddar dig sjalv och din familj."
          }
        </p>

        <div className="flex items-center justify-center gap-8 mb-12 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>ca 20 minuter</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span>{type === "learn" ? "Praktiska ovningar" : "Verkliga scenarion"}</span>
          </div>
        </div>

        <button 
          onClick={handleStart}
          className={cn(
            "inline-flex items-center gap-3 font-[family-name:var(--font-display)] text-xl tracking-[-0.02em] uppercase transition-opacity hover:opacity-80",
            type === "learn" ? "text-primary" : "text-accent"
          )}
        >
          [ VI BORJAR ]
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="mt-10 text-sm text-muted-foreground">
          Du kan pausa nar du vill och fortsatta senare.
        </p>
      </div>
    </div>
  )
}
