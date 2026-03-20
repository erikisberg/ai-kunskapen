import { getCourseData } from "@/lib/course-data"
import { SafeJourneyClient } from "./client"

export default async function SafeJourneyPage() {
  const courseData = await getCourseData("risken-med-ai")

  return (
    <SafeJourneyClient
      journeyType={courseData.journeyType}
      steps={courseData.steps}
    />
  )
}
