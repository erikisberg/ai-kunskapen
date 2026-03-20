"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ArrowRight, ChevronDown, PenLine, Globe, Cpu, Sparkles, MessageCircle, CheckCircle2, Mic, Bot, Phone, AlertTriangle, Banknote, XCircle } from "lucide-react"
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

// Map icon names to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  pen: PenLine,
  globe: Globe,
  cpu: Cpu,
  sparkles: Sparkles,
  message: MessageCircle,
  check: CheckCircle2,
  mic: Mic,
  bot: Bot,
  phone: Phone,
  alert: AlertTriangle,
  money: Banknote,
  x: XCircle,
}

function getStepIcon(index: number, icon?: string) {
  if (icon && iconMap[icon]) {
    const Icon = iconMap[icon]
    return <Icon className="w-5 h-5" />
  }
  // Default icons for "how AI works" flow
  const defaultIcons = [PenLine, Globe, Cpu, Sparkles, MessageCircle, CheckCircle2]
  const Icon = defaultIcons[index % defaultIcons.length]
  return <Icon className="w-5 h-5" />
}

export function FlowSlide({ type, title, steps }: FlowSlideProps) {
  const { nextStep, markCurrentStepComplete } = useJourney()
  const [activeStep, setActiveStep] = useState(0)
  const allRevealed = activeStep >= steps.length - 1

  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1)
    }
  }

  const handleContinue = () => {
    markCurrentStepComplete()
    nextStep()
  }

  const accentColor = type === "learn" ? "primary" : "accent"

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-auto">
        <div className="px-6 md:px-8 py-10 md:py-14">
          <div className="max-w-xl mx-auto">
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl tracking-[-0.03em] uppercase mb-3 leading-[1.1]">
              {title}
            </h2>
            <p className="text-muted-foreground mb-10">
              Tryck dig igenom varje steg i processen.
            </p>

            {/* Flow visualization */}
            <div className="relative">
              {steps.map((step, index) => {
                const isVisible = index <= activeStep
                const isCurrent = index === activeStep
                const isPast = index < activeStep
                const isLast = index === steps.length - 1

                return (
                  <div key={index} className="relative">
                    {/* Animated step */}
                    <AnimatePresence>
                      {isVisible && (
                        <motion.div
                          initial={{ opacity: 0, y: 24, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                          className="relative mb-1"
                        >
                          <div
                            className={cn(
                              "flex items-start gap-4 p-5 rounded-xl border transition-all duration-300",
                              isCurrent && "bg-card shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] border-border",
                              isPast && "bg-secondary/30 border-transparent",
                            )}
                          >
                            {/* Icon circle */}
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 20 }}
                              className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300",
                                isCurrent && type === "learn" && "bg-primary text-primary-foreground",
                                isCurrent && type === "safe" && "bg-accent text-accent-foreground",
                                isPast && "bg-foreground/5 text-foreground/30",
                              )}
                            >
                              {getStepIcon(index, step.icon)}
                            </motion.div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={cn(
                                  "text-[11px] font-mono tabular-nums",
                                  isCurrent ? "text-muted-foreground" : "text-foreground/20"
                                )}>
                                  {String(index + 1).padStart(2, "0")}
                                </span>
                                <h3 className={cn(
                                  "font-semibold leading-snug transition-colors duration-300",
                                  isCurrent ? "text-foreground" : "text-foreground/40"
                                )}>
                                  {step.label}
                                </h3>
                              </div>
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{
                                  opacity: isCurrent ? 1 : 0.4,
                                  height: "auto",
                                }}
                                transition={{ duration: 0.3 }}
                                className="text-sm leading-relaxed text-foreground/60"
                              >
                                {step.description}
                              </motion.p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Connecting arrow */}
                    {!isLast && isVisible && (
                      <motion.div
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className="flex justify-center py-1"
                        style={{ originY: 0 }}
                      >
                        <svg width="2" height="24" className={cn(
                          isPast ? "text-foreground/10" : (type === "learn" ? "text-primary/30" : "text-accent/40")
                        )}>
                          <line x1="1" y1="0" x2="1" y2="20" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                          <polygon points="0,20 2,20 1,24" fill="currentColor" />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                )
              })}

              {/* Placeholder for unrevealed steps */}
              {!allRevealed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 p-5 rounded-xl border border-dashed border-foreground/10"
                >
                  <div className="w-12 h-12 rounded-xl bg-foreground/3 flex items-center justify-center">
                    <span className="text-foreground/15 text-sm font-mono">{activeStep + 2}</span>
                  </div>
                  <span className="text-foreground/20 text-sm">
                    {steps.length - activeStep - 1} steg kvar...
                  </span>
                </motion.div>
              )}
            </div>

            {/* Next step button */}
            {!allRevealed && (
              <motion.div
                className="mt-8 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={handleNextStep}
                  className={cn(
                    "inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium transition-all hover:scale-[1.03] active:scale-[0.98]",
                    type === "learn"
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent text-accent-foreground"
                  )}
                >
                  Visa nästa steg
                  <ChevronDown className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1.5 mt-6">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i <= activeStep ? "w-6" : "w-1.5",
                    i <= activeStep && type === "learn" && "bg-primary",
                    i <= activeStep && type === "safe" && "bg-accent",
                    i > activeStep && "bg-foreground/10",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom — only when done */}
      <AnimatePresence>
        {allRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky bottom-0 bg-background/80 backdrop-blur-xl border-t border-border py-4"
          >
            <div className="px-6 md:px-8">
              <div className="max-w-xl mx-auto flex justify-end">
                <button
                  onClick={handleContinue}
                  className={cn(
                    "inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all hover:scale-[1.02]",
                    type === "learn"
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent text-accent-foreground"
                  )}
                >
                  Fortsatt
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
