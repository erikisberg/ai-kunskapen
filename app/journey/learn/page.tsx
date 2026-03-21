import { getCourseData } from "@/lib/course-data"
import { auth } from "@/lib/auth"
import { LearnJourneyClient } from "./client"
import { CourseGate } from "@/components/course-gate"

export default async function LearnJourneyPage() {
  const session = await auth()

  if (!session?.user) {
    return <CourseGate courseType="learn" />
  }

  const courseData = await getCourseData("anvanda-ai")

  return (
    <LearnJourneyClient
      journeyType={courseData.journeyType}
      steps={courseData.steps}
    />
  )
}
