"use client"

import { useJourney } from "@/lib/journey-context"
import { cn } from "@/lib/utils"

export function ProgressBar() {
  const { progress, journeyType } = useJourney()
  const totalSteps = progress.steps.length
  const currentStep = progress.currentStep
  const completedSteps = progress.steps.filter(s => s.completed).length
  
  const percentage = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0

  return (
    <div className="w-full">
      {/* Mobile: Simple progress bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-xs font-medium uppercase tracking-wide truncate max-w-[180px]">
            {progress.steps[currentStep]?.title}
          </span>
          <span className="text-xs text-muted-foreground">
            {currentStep + 1} / {totalSteps}
          </span>
        </div>
        <div className="h-1 bg-foreground/10 overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-500 ease-out",
              journeyType === "learn" ? "bg-primary" : "bg-accent"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Desktop: Step indicators */}
      <div className="hidden md:block">
        <div className="flex items-center gap-1">
          {progress.steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div
                className={cn(
                  "w-2.5 h-2.5 transition-all duration-300",
                  index === currentStep && journeyType === "learn" && "bg-primary scale-150",
                  index === currentStep && journeyType === "safe" && "bg-accent scale-150",
                  index < currentStep && journeyType === "learn" && "bg-primary",
                  index < currentStep && journeyType === "safe" && "bg-accent",
                  index > currentStep && "bg-foreground/20",
                  step.completed && index !== currentStep && journeyType === "learn" && "bg-primary",
                  step.completed && index !== currentStep && journeyType === "safe" && "bg-accent"
                )}
                title={step.title}
              />
              {index < progress.steps.length - 1 && (
                <div 
                  className={cn(
                    "flex-1 h-px mx-1 transition-all duration-300",
                    index < currentStep && journeyType === "learn" && "bg-primary",
                    index < currentStep && journeyType === "safe" && "bg-accent",
                    index >= currentStep && "bg-foreground/20"
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs font-semibold uppercase tracking-wide">
            {progress.steps[currentStep]?.title}
          </span>
          <span className="text-xs text-muted-foreground">
            {currentStep + 1} av {totalSteps}
          </span>
        </div>
      </div>
    </div>
  )
}
