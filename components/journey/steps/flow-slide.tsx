"use client"

import { ArrowRight } from "lucide-react"
import { useJourney, type JourneyType } from "@/lib/journey-context"
import { cn } from "@/lib/utils"

interface FlowStep {
  label: string
  description: string
  icon?: string
}

interface FlowSlideProps {
  type: JourneyType
  title: string
  steps: FlowStep[]
}

export function FlowSlide({ type, title, steps }: FlowSlideProps) {
  const { nextStep, markCurrentStepComplete } = useJourney()

  const handleContinue = () => {
    markCurrentStepComplete()
    nextStep()
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-auto">
        <div className="px-6 md:px-8 py-10 md:py-14">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl tracking-[-0.03em] uppercase mb-10 leading-[1.1]">
              {title}
            </h2>

            <div className="relative">
              {steps.map((step, index) => {
                const isLast = index === steps.length - 1

                return (
                  <div
                    key={index}
                    className="flow-step-enter relative flex items-start gap-4 md:gap-5"
                    style={{
                      animationDelay: `${index * 200}ms`,
                    }}
                  >
                    {/* Vertical connector line + number bubble */}
                    <div className="flex flex-col items-center shrink-0">
                      {/* Number bubble */}
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 border",
                          type === "learn"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-accent/30 text-accent-foreground border-accent/40"
                        )}
                      >
                        {step.icon ? (
                          <span className="text-lg leading-none">{step.icon}</span>
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>

                      {/* Connecting line */}
                      {!isLast && (
                        <div
                          className={cn(
                            "w-px flex-1 min-h-6",
                            type === "learn"
                              ? "bg-primary/15"
                              : "bg-accent/25"
                          )}
                        />
                      )}
                    </div>

                    {/* Content card */}
                    <div
                      className={cn(
                        "flex-1 rounded-lg border bg-card p-4 md:p-5",
                        isLast ? "mb-0" : "mb-3"
                      )}
                    >
                      <h3 className="font-semibold text-foreground text-base md:text-lg leading-snug mb-1">
                        {step.label}
                      </h3>
                      <p className="text-foreground/60 text-sm md:text-base leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom action — matches content-step pattern */}
      <div className="sticky bottom-0 bg-background/80 backdrop-blur-xl border-t border-border py-4">
        <div className="px-6 md:px-8">
          <div className="max-w-2xl mx-auto flex justify-end">
            <button
              onClick={handleContinue}
              className={cn(
                "inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all hover:scale-[1.02]",
                type === "learn"
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-accent-foreground"
              )}
            >
              Fortsätt
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
