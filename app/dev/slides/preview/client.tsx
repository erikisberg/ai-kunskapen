"use client"

import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { JourneyProvider, useJourney } from "@/lib/journey-context"
import { JourneyContent } from "@/components/journey/dynamic-journey"
import type { StepData, JourneyType } from "@/lib/course-data"
import type { Step } from "@/lib/journey-context"
import { useEffect, useState } from "react"

function PreviewInner({
  journeyType,
  steps,
  initialStep,
  courseSlug,
}: {
  journeyType: JourneyType
  steps: StepData[]
  initialStep: number
  courseSlug: string
}) {
  const { progress, setJourneyType, goToStep } = useJourney()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const contextSteps: Step[] = steps.map((s) => ({
      id: s.id,
      title: s.title,
      type: s.type === "llm_chat" ? "chat" : s.type,
      completed: false,
    }))
    setJourneyType(journeyType, contextSteps)
  }, [journeyType, steps, setJourneyType])

  // Wait for context to be initialized, then jump to the right step
  useEffect(() => {
    if (progress.steps.length > 0 && progress.currentStep !== initialStep) {
      goToStep(initialStep)
      setReady(true)
    } else if (progress.steps.length > 0 && progress.currentStep === initialStep) {
      setReady(true)
    }
  }, [progress.steps.length, progress.currentStep, initialStep, goToStep])

  if (!ready) return null

  const total = steps.length

  return (
    <div className="min-h-screen flex flex-col">
      {/* Dev toolbar */}
      <div className="bg-foreground text-background px-4 py-2 flex items-center justify-between text-xs z-[100] sticky top-0">
        <div className="flex items-center gap-4">
          <Link href="/dev/slides" className="hover:text-background/70">
            ← Alla slides
          </Link>
          <span className="text-background/50">
            {courseSlug} · Steg {initialStep + 1}/{total} · {steps[initialStep]?.type}
          </span>
          <span className="text-background/30 font-mono">
            {steps[initialStep]?.heading}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {initialStep > 0 && (
            <Link
              href={`/dev/slides/preview?course=${courseSlug}&step=${initialStep - 1}`}
              className="flex items-center gap-1 hover:text-background/70"
            >
              <ArrowLeft className="w-3 h-3" /> Förra
            </Link>
          )}
          {initialStep < total - 1 && (
            <Link
              href={`/dev/slides/preview?course=${courseSlug}&step=${initialStep + 1}`}
              className="flex items-center gap-1 hover:text-background/70"
            >
              Nästa <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>

      {/* Slide content only — no journey layout */}
      <div className="flex-1 flex flex-col">
        <JourneyContent journeyType={journeyType} steps={steps} />
      </div>
    </div>
  )
}

export function PreviewClient({
  journeyType,
  steps,
  initialStep,
  courseSlug,
}: {
  journeyType: JourneyType
  steps: StepData[]
  initialStep: number
  courseSlug: string
}) {
  return (
    <JourneyProvider>
      <PreviewInner
        journeyType={journeyType}
        steps={steps}
        initialStep={initialStep}
        courseSlug={courseSlug}
      />
    </JourneyProvider>
  )
}
