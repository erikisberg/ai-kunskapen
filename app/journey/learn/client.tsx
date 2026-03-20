"use client"

import { JourneyProvider } from "@/lib/journey-context"
import { DynamicJourney } from "@/components/journey/dynamic-journey"
import type { StepData, JourneyType } from "@/lib/course-data"

export function LearnJourneyClient({
  journeyType,
  steps,
}: {
  journeyType: JourneyType
  steps: StepData[]
}) {
  return (
    <JourneyProvider>
      <DynamicJourney journeyType={journeyType} steps={steps} />
    </JourneyProvider>
  )
}
