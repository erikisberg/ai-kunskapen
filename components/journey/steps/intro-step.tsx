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
    <div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl text-center animate-slide-up">
        <div className={cn(
          "w-16 h-16 flex items-center justify-center mx-auto mb-10 rounded-xl",
          type === "learn" ? "bg-primary/10 text-primary" : "bg-accent/20 text-accent-foreground"
        )}>
          {type === "learn" ? (
            <BookOpen className="w-7 h-7" />
          ) : (
            <Shield className="w-7 h-7" />
          )}
        </div>

        <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.5rem,8vw,5rem)] leading-[1.1] tracking-[-0.035em] uppercase mb-8">
          {type === "learn"
            ? <>Välkommen till<br /><span className="text-primary">din AI-resa</span></>
            : <>Lär dig<br /><span className="text-primary">skydda dig</span></>
          }
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed">
          {type === "learn"
            ? "Under de kommande minuterna kommer du att lära dig grunderna i hur du pratar med AI-chatbotar och hur du kan använda dem i din vardag."
            : "Under de kommande minuterna kommer du att lära dig känna igen AI-baserade bedrägerier, deepfakes och hur du skyddar dig själv och din familj."
          }
        </p>

        <div className="flex items-center justify-center gap-6 mb-12 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>ca 20 minuter</span>
          </div>
          <span className="text-foreground/10">·</span>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>{type === "learn" ? "Praktiska övningar" : "Verkliga scenarion"}</span>
          </div>
        </div>

        <button
          onClick={handleStart}
          className={cn(
            "inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-medium text-lg transition-all hover:scale-[1.02]",
            type === "learn"
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-accent text-accent-foreground hover:bg-accent/90"
          )}
        >
          Vi börjar
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="mt-10 text-sm text-muted-foreground">
          Du kan pausa när du vill och fortsätta senare.
        </p>
      </div>
    </div>
  )
}
