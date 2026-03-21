import { getCourseData } from "@/lib/course-data"
import { auth } from "@/lib/auth"
import { LearnJourneyClient } from "./client"
import { CourseGate } from "@/components/course-gate"
import { getUserProgress } from "@/lib/progress"

export default async function LearnJourneyPage() {
  const session = await auth()

  if (!session?.user) {
    return <CourseGate courseType="learn" />
  }

  const courseData = await getCourseData("anvanda-ai")

  // Find where user left off
  let initialStep = 0
  try {
    const progress = await getUserProgress(session.user.id as string)
    const completedIds = new Set(
      progress
        .filter((p) => p.courseSlug === "anvanda-ai")
        .map((p) => p.moduleSlug)
    )

    // Find first uncompleted step
    for (let i = 0; i < courseData.steps.length; i++) {
      if (completedIds.has(courseData.steps[i].id)) {
        initialStep = i + 1
      } else {
        break
      }
    }
    // Don't go past the end
    if (initialStep >= courseData.steps.length) {
      initialStep = courseData.steps.length - 1
    }
  } catch {}

  return (
    <LearnJourneyClient
      journeyType={courseData.journeyType}
      steps={courseData.steps}
      initialStep={initialStep}
    />
  )
}
