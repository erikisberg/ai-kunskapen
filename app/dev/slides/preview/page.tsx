import { getCourseData } from "@/lib/course-data"
import { PreviewClient } from "./client"

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string; step?: string }>
}) {
  const params = await searchParams
  const courseSlug = params.course || "anvanda-ai"
  const stepIndex = parseInt(params.step || "0", 10)

  let courseData;
  try {
    courseData = await getCourseData(courseSlug)
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Kunde inte ladda kurs &quot;{courseSlug}&quot;</p>
      </div>
    )
  }

  return (
    <PreviewClient
      journeyType={courseData.journeyType}
      steps={courseData.steps}
      initialStep={stepIndex}
      courseSlug={courseSlug}
    />
  )
}
