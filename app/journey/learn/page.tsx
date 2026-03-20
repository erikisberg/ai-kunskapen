import { getCourseData } from "@/lib/course-data"
import { LearnJourneyClient } from "./client"

export default async function LearnJourneyPage() {
  const courseData = await getCourseData("anvanda-ai")

  return (
    <LearnJourneyClient
      journeyType={courseData.journeyType}
      steps={courseData.steps}
    />
  )
}
