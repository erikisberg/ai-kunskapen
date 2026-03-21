import { getCourseData } from "@/lib/course-data"
import { auth } from "@/lib/auth"
import { SafeJourneyClient } from "./client"
import { CourseGate } from "@/components/course-gate"
import { getUserProgress } from "@/lib/progress"

export default async function SafeJourneyPage() {
  const session = await auth()

  if (!session?.user) {
    return <CourseGate courseType="safe" />
  }

  const courseData = await getCourseData("risken-med-ai")

  let initialStep = 0
  try {
    const progress = await getUserProgress(session.user.id as string)
    const completedIds = new Set(
      progress
        .filter((p) => p.courseSlug === "forsta-risken")
        .map((p) => p.moduleSlug)
    )

    for (let i = 0; i < courseData.steps.length; i++) {
      if (completedIds.has(courseData.steps[i].id)) {
        initialStep = i + 1
      } else {
        break
      }
    }
    if (initialStep >= courseData.steps.length) {
      initialStep = courseData.steps.length - 1
    }
  } catch {}

  return (
    <SafeJourneyClient
      journeyType={courseData.journeyType}
      steps={courseData.steps}
      initialStep={initialStep}
    />
  )
}
