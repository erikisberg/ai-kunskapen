import { getCourseData } from "@/lib/course-data"
import { auth } from "@/lib/auth"
import { SafeJourneyClient } from "./client"
import { CourseGate } from "@/components/course-gate"

export default async function SafeJourneyPage() {
  const session = await auth()

  if (!session?.user) {
    return <CourseGate courseType="safe" />
  }

  const courseData = await getCourseData("risken-med-ai")

  return (
    <SafeJourneyClient
      journeyType={courseData.journeyType}
      steps={courseData.steps}
    />
  )
}
