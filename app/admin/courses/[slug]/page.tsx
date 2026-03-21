import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { getCourseBySlug, getModuleWithSlides } from "@/lib/directus";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CourseEditor } from "./editor";
import { HelpDialog } from "./help-dialog";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CourseEditorPage({ params }: Props) {
  const admin = await requireAdmin();
  if (!admin) redirect("/");

  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) redirect("/admin/courses");

  // Fetch all slides for each module
  const modulesWithSlides = await Promise.all(
    (course.modules || []).map(async (mod) => {
      const data = await getModuleWithSlides(slug, mod.slug);
      return {
        ...mod,
        slides: data?.slides || [],
      };
    })
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link href="/admin/courses" className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-semibold">{course.title}</h1>
            <p className="text-xs text-muted-foreground">{course.slug}</p>
          </div>
          <HelpDialog />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <CourseEditor
          courseId={course.id}
          courseSlug={course.slug}
          modules={modulesWithSlides}
        />
      </main>
    </div>
  );
}
