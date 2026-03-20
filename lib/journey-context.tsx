"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type JourneyType = "learn" | "safe"

export interface Step {
  id: string
  title: string
  type: "intro" | "content" | "quiz" | "scenario" | "chat" | "checklist" | "complete"
  completed: boolean
}

export interface JourneyProgress {
  currentStep: number
  steps: Step[]
  startedAt: Date | null
  completedAt: Date | null
}

interface JourneyContextType {
  journeyType: JourneyType | null
  progress: JourneyProgress
  setJourneyType: (type: JourneyType) => void
  goToStep: (stepIndex: number) => void
  nextStep: () => void
  previousStep: () => void
  markCurrentStepComplete: () => void
  resetJourney: () => void
  isComplete: boolean
}

const learnSteps: Step[] = [
  { id: "learn-intro", title: "Välkommen", type: "intro", completed: false },
  { id: "learn-what-is-ai", title: "Vad är AI?", type: "content", completed: false },
  { id: "learn-first-chat", title: "Din första AI-chatt", type: "chat", completed: false },
  { id: "learn-prompts", title: "Konsten att fråga", type: "content", completed: false },
  { id: "learn-practice", title: "Övning: Skriv bättre frågor", type: "chat", completed: false },
  { id: "learn-quiz", title: "Snabbkoll", type: "quiz", completed: false },
  { id: "learn-use-cases", title: "AI i vardagen", type: "content", completed: false },
  { id: "learn-tips", title: "Tips att ta med", type: "checklist", completed: false },
  { id: "learn-complete", title: "Grattis!", type: "complete", completed: false },
]

const safeSteps: Step[] = [
  { id: "safe-intro", title: "Välkommen", type: "intro", completed: false },
  { id: "safe-threats", title: "AI-hot idag", type: "content", completed: false },
  { id: "safe-deepfakes", title: "Vad är deepfakes?", type: "content", completed: false },
  { id: "safe-scenario-call", title: "Scenario: Samtalet", type: "scenario", completed: false },
  { id: "safe-scams", title: "AI-bedrägerier", type: "content", completed: false },
  { id: "safe-scenario-email", title: "Scenario: Mejlet", type: "scenario", completed: false },
  { id: "safe-quiz", title: "Snabbkoll", type: "quiz", completed: false },
  { id: "safe-protect", title: "Skydda dig", type: "checklist", completed: false },
  { id: "safe-complete", title: "Du är redo!", type: "complete", completed: false },
]

const defaultProgress: JourneyProgress = {
  currentStep: 0,
  steps: [],
  startedAt: null,
  completedAt: null,
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined)

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [journeyType, setJourneyTypeState] = useState<JourneyType | null>(null)
  const [progress, setProgress] = useState<JourneyProgress>(defaultProgress)

  const setJourneyType = useCallback((type: JourneyType) => {
    const steps = type === "learn" ? learnSteps : safeSteps
    setJourneyTypeState(type)
    setProgress({
      currentStep: 0,
      steps: steps.map(s => ({ ...s })),
      startedAt: new Date(),
      completedAt: null,
    })
  }, [])

  const goToStep = useCallback((stepIndex: number) => {
    setProgress(prev => ({
      ...prev,
      currentStep: Math.max(0, Math.min(stepIndex, prev.steps.length - 1)),
    }))
  }, [])

  const nextStep = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, prev.steps.length - 1),
    }))
  }, [])

  const previousStep = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
    }))
  }, [])

  const markCurrentStepComplete = useCallback(() => {
    setProgress(prev => {
      const newSteps = [...prev.steps]
      if (newSteps[prev.currentStep]) {
        newSteps[prev.currentStep] = { ...newSteps[prev.currentStep], completed: true }
      }
      const allComplete = newSteps.every(s => s.completed)
      return {
        ...prev,
        steps: newSteps,
        completedAt: allComplete ? new Date() : null,
      }
    })
  }, [])

  const resetJourney = useCallback(() => {
    setJourneyTypeState(null)
    setProgress(defaultProgress)
  }, [])

  const isComplete = progress.steps.length > 0 && progress.steps.every(s => s.completed)

  return (
    <JourneyContext.Provider
      value={{
        journeyType,
        progress,
        setJourneyType,
        goToStep,
        nextStep,
        previousStep,
        markCurrentStepComplete,
        resetJourney,
        isComplete,
      }}
    >
      {children}
    </JourneyContext.Provider>
  )
}

export function useJourney() {
  const context = useContext(JourneyContext)
  if (context === undefined) {
    throw new Error("useJourney must be used within a JourneyProvider")
  }
  return context
}
