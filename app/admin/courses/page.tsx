import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { getTenant, getCourses } from "@/lib/directus";
import Link from "next/link";
import { BookOpen, Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { CreateCourseForm } from "./create-course-form";

export default async function CoursesPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/");

  const tenant = await getTenant();
  const courses = await getCourses(tenant.id);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="font-[family-name:var(--font-display)] text-xl uppercase">Kurser</h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <CreateCourseForm />

        <div className="space-y-3 mt-8">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/admin/courses/${course.slug}`}
              className="flex items-center justify-between p-5 border border-border rounded-xl bg-card hover:shadow-sm hover:border-primary/20 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">{course.title}</h2>
                  <p className="text-sm text-muted-foreground">{course.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  course.status === "published"
                    ? "bg-green-500/10 text-green-600"
                    : "bg-amber-500/10 text-amber-600"
                }`}>
                  {course.status === "published" ? "Publicerad" : "Draft"}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}

          {courses.length === 0 && (
            <p className="text-center text-muted-foreground py-12">Inga kurser skapade.</p>
          )}
        </div>
      </main>
    </div>
  );
}
