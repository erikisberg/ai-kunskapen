"use client"

import { useState } from "react"
import { ArrowRight, Phone, Mail, MessageSquare, AlertTriangle, Check, X } from "lucide-react"
import { useJourney, type JourneyType } from "@/lib/journey-context"
import { cn } from "@/lib/utils"

interface ScenarioChoice {
  text: string
  isCorrect: boolean
  feedback: string
}

interface ScenarioStepProps {
  type: JourneyType
  title: string
  description: string
  scenarioType: "call" | "email" | "message"
  scenarioContent: React.ReactNode
  question: string
  choices: ScenarioChoice[]
}

export function ScenarioStep({ 
  type, 
  title, 
  description,
  scenarioType,
  scenarioContent,
  question,
  choices 
}: ScenarioStepProps) {
  const { nextStep, markCurrentStepComplete } = useJourney()
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleSelectChoice = (index: number) => {
    if (showResult) return
    setSelectedChoice(index)
    setShowResult(true)
  }

  const handleContinue = () => {
    markCurrentStepComplete()
    nextStep()
  }

  const selectedIsCorrect = selectedChoice !== null && choices[selectedChoice]?.isCorrect

  const ScenarioIcon = {
    call: Phone,
    email: Mail,
    message: MessageSquare,
  }[scenarioType]

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-auto">
        <div className="px-4 md:px-8 py-8 md:py-12">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 flex items-center justify-center bg-accent text-accent-foreground border border-border">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-xl tracking-[-0.045em] uppercase">{title}</h2>
                <p className="text-muted-foreground">{description}</p>
              </div>
            </div>

            {/* Scenario Card */}
            <div className="mb-8 border border-border overflow-hidden">
              {/* Scenario Header */}
              <div className="flex items-center gap-3 p-4 bg-secondary border-b border-border">
                <div className="w-10 h-10 bg-card flex items-center justify-center border border-border">
                  <ScenarioIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-[family-name:var(--font-display)] text-sm tracking-[-0.02em] uppercase">
                    {scenarioType === "call" && "INKOMMANDE SAMTAL"}
                    {scenarioType === "email" && "NYTT MEJL"}
                    {scenarioType === "message" && "NYTT MEDDELANDE"}
                  </p>
                  <p className="text-xs text-muted-foreground">Just nu</p>
                </div>
              </div>
              
              {/* Scenario Content */}
              <div className="p-6 bg-card">
                {scenarioContent}
              </div>
            </div>

            {/* Question */}
            <div className="mb-6">
              <p className="text-xl font-medium mb-6">{question}</p>
              
              <div className="space-y-3">
                {choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectChoice(index)}
                    disabled={showResult}
                    className={cn(
                      "w-full text-left p-5 border rounded-lg transition-all",
                      "focus:outline-none focus:ring-2 focus:ring-foreground",
                      !showResult && "hover:bg-secondary/50 border-border hover:border-foreground/30",
                      showResult && choice.isCorrect && "border-primary bg-primary/10",
                      showResult && selectedChoice === index && !choice.isCorrect && "border-destructive bg-destructive/10",
                      !showResult && "border-foreground/30"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      {showResult && (
                        <div className={cn(
                          "w-8 h-8 flex items-center justify-center flex-shrink-0",
                          choice.isCorrect && "bg-primary text-primary-foreground",
                          selectedChoice === index && !choice.isCorrect && "bg-destructive text-destructive-foreground"
                        )}>
                          {choice.isCorrect ? (
                            <Check className="w-4 h-4" />
                          ) : selectedChoice === index ? (
                            <X className="w-4 h-4" />
                          ) : null}
                        </div>
                      )}
                      <span className={cn("text-lg", !showResult && "ml-0", showResult && !choice.isCorrect && selectedChoice !== index && "ml-12")}>
                        {choice.text}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback */}
            {showResult && selectedChoice !== null && (
              <div className={cn(
                "border rounded-lg animate-slide-up p-6",
                selectedIsCorrect ? "border-primary bg-primary/5" : "border-accent bg-accent/20"
              )}>
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-10 h-10 flex items-center justify-center flex-shrink-0",
                    selectedIsCorrect ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
                  )}>
                    {selectedIsCorrect ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="font-bold">!</span>
                    )}
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-display)] text-lg tracking-[-0.02em] uppercase mb-2">
                      {selectedIsCorrect ? "BRA VAL" : "VAR FORSIKTIG"}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">{choices[selectedChoice].feedback}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed bottom action */}
      {showResult && (
        <div className="sticky bottom-0 bg-background border-t border-border py-4">
          <div className="px-4 md:px-8">
            <div className="max-w-2xl mx-auto flex justify-end">
              <button 
                onClick={handleContinue}
                className="inline-flex items-center gap-2 font-[family-name:var(--font-display)] text-lg tracking-[-0.02em] uppercase transition-opacity hover:opacity-80"
              >
                Fortsätt
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
