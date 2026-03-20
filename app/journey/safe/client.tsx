"use client"

import { JourneyProvider } from "@/lib/journey-context"
import { DynamicJourney } from "@/components/journey/dynamic-journey"
import type { StepData, JourneyType } from "@/lib/course-data"

export function SafeJourneyClient({
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
