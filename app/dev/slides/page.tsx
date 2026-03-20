import { getCourseData } from "@/lib/course-data"
import Link from "next/link"

export default async function DevSlidesPage() {
  let learn, safe;
  try {
    learn = await getCourseData("anvanda-ai");
    safe = await getCourseData("risken-med-ai");
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Kunde inte ladda kursdata. Kör Directus?</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Tillbaka
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-2">Slide-översikt (dev)</h1>
        <p className="text-muted-foreground mb-12">Alla slides i båda kurserna. Klicka för att hoppa direkt till steget.</p>

        {[learn, safe].map((course) => (
          <div key={course.course.slug} className="mb-16">
            <h2 className="text-2xl font-semibold mb-1">{course.course.title}</h2>
            <p className="text-sm text-muted-foreground mb-6">{course.steps.length} steg · {course.journeyType === "learn" ? "Lila" : "Gul"} tema</p>

            <div className="space-y-3">
              {course.steps.map((step, i) => (
                <Link
                  key={step.id}
                  href={`/dev/slides/preview?course=${course.course.slug}&step=${i}`}
                  className="block border border-border rounded-lg p-4 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded bg-foreground/5 flex items-center justify-center flex-shrink-0 text-sm font-mono text-muted-foreground">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                          step.type === "intro" ? "bg-blue-100 text-blue-700" :
                          step.type === "content" ? "bg-gray-100 text-gray-700" :
                          step.type === "llm_chat" ? "bg-purple-100 text-purple-700" :
                          step.type === "quiz" ? "bg-green-100 text-green-700" :
                          step.type === "scenario" ? "bg-orange-100 text-orange-700" :
                          step.type === "checklist" ? "bg-teal-100 text-teal-700" :
                          step.type === "flow" ? "bg-indigo-100 text-indigo-700" :
                          step.type === "complete" ? "bg-yellow-100 text-yellow-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {step.type}
                        </span>
                        <h3 className="font-medium text-sm truncate">{step.heading}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {step.bodyText.slice(0, 150)}...
                      </p>
                      {step.type === "quiz" && step.quizOptions && (
                        <p className="text-xs text-green-600 mt-1">{step.quizOptions.length} svarsalternativ</p>
                      )}
                      {step.type === "scenario" && step.scenarioChoices && (
                        <p className="text-xs text-orange-600 mt-1">{step.scenarioChoices.length} val</p>
                      )}
                      {step.type === "checklist" && step.checklistItems && (
                        <p className="text-xs text-teal-600 mt-1">{step.checklistItems.length} punkter</p>
                      )}
                      {step.type === "llm_chat" && (
                        <p className="text-xs text-purple-600 mt-1">Max {step.maxMessages || 10} meddelanden</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
