"use client"

import { useJourney } from "@/lib/journey-context"
import { cn } from "@/lib/utils"

export function ProgressBar() {
  const { progress, journeyType } = useJourney()
  const totalSteps = progress.steps.length
  const currentStep = progress.currentStep

  const percentage = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0

  return (
    <div className="w-full">
      {/* Mobile: thin progress bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium truncate max-w-[160px]">
            {progress.steps[currentStep]?.title}
          </span>
          <span className="text-xs text-muted-foreground">
            {currentStep + 1}/{totalSteps}
          </span>
        </div>
        <div className="h-0.5 bg-foreground/5 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              journeyType === "learn" ? "bg-primary" : "bg-accent"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Desktop: dot indicators */}
      <div className="hidden md:block">
        <div className="flex items-center gap-1">
          {progress.steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === currentStep && journeyType === "learn" && "bg-primary scale-[1.4]",
                  index === currentStep && journeyType === "safe" && "bg-accent scale-[1.4]",
                  index < currentStep && journeyType === "learn" && "bg-primary/60",
                  index < currentStep && journeyType === "safe" && "bg-accent/60",
                  index > currentStep && "bg-foreground/10",
                  step.completed && index !== currentStep && journeyType === "learn" && "bg-primary/60",
                  step.completed && index !== currentStep && journeyType === "safe" && "bg-accent/60"
                )}
                title={step.title}
              />
              {index < progress.steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-px mx-1 transition-all duration-300",
                    index < currentStep && journeyType === "learn" && "bg-primary/30",
                    index < currentStep && journeyType === "safe" && "bg-accent/30",
                    index >= currentStep && "bg-foreground/8"
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-medium">
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
