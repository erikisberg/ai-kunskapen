"use client"

import { useEffect, useState } from "react"
import { JourneyProvider } from "@/lib/journey-context"
import { DynamicJourney } from "@/components/journey/dynamic-journey"
import type { CourseData } from "@/lib/course-data"

export default function LearnJourneyPage() {
  const [courseData, setCourseData] = useState<CourseData | null>(null)

  useEffect(() => {
    async function load() {
      const { getCourseData } = await import("@/lib/course-data")
      const data = await getCourseData("anvanda-ai")
      setCourseData(data)
    }
    load()
  }, [])

  if (!courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Laddar kurs...</p>
        </div>
      </div>
    )
  }

  return (
    <JourneyProvider>
      <DynamicJourney
        journeyType={courseData.journeyType}
        steps={courseData.steps}
      />
    </JourneyProvider>
  )
}
