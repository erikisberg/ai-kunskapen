import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import * as schema from "@/lib/schema";
import Link from "next/link";
import { BookOpen, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/logout-button";

export default async function DashboardPage() {
  let session;
  try {
    session = await auth();
  } catch {
    redirect("/");
  }

  if (!session?.user?.id) redirect("/");

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, session.user.id))
    .limit(1);

  if (!user) redirect("/");

  let orgName = null;
  if (user.orgId) {
    const [org] = await db
      .select({ name: schema.organizations.name })
      .from(schema.organizations)
      .where(eq(schema.organizations.id, user.orgId))
      .limit(1);
    orgName = org?.name || null;
  }

  // Get user's progress
  const userProgress = await db
    .select()
    .from(schema.progress)
    .where(eq(schema.progress.userId, user.id));

  const learnModules = userProgress.filter((p) => p.courseSlug === "anvanda-ai");
  const safeModules = userProgress.filter((p) => p.courseSlug === "forsta-risken");

  // Total modules per course (from CMS, hardcoded for now)
  const totalLearnModules = 9;
  const totalSafeModules = 11;

  const learnProgress = Math.round((learnModules.length / totalLearnModules) * 100);
  const safeProgress = Math.round((safeModules.length / totalSafeModules) * 100);

  const courses = [
    {
      slug: "learn",
      href: "/journey/learn",
      title: "Lär dig använda AI",
      icon: BookOpen,
      progress: learnProgress,
      completed: learnModules.length,
      total: totalLearnModules,
      color: "primary",
    },
    {
      slug: "safe",
      href: "/journey/safe",
      title: "Förstå risken med AI",
      icon: ShieldCheck,
      progress: safeProgress,
      completed: safeModules.length,
      total: totalSafeModules,
      color: "accent",
    },
  ];

  const allDone = learnProgress >= 100 && safeProgress >= 100;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-[family-name:var(--font-display)] text-xl uppercase">
            AI-kunskapen
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl uppercase tracking-[-0.03em] mb-2 leading-[1.1]">
            {user.name ? `Hej, ${user.name}!` : "Din översikt"}
          </h1>
          {orgName && (
            <p className="text-muted-foreground">{orgName}</p>
          )}
        </div>

        {/* Course cards */}
        <div className="space-y-4 mb-10">
          {courses.map((course) => {
            const Icon = course.icon;
            const isDone = course.progress >= 100;

            return (
              <Link
                key={course.slug}
                href={course.href}
                className="block border border-border rounded-xl p-6 bg-card hover:shadow-sm transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center",
                        course.color === "primary"
                          ? "bg-primary/10 text-primary"
                          : "bg-accent/10 text-foreground"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg">{course.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {isDone
                          ? "Slutförd!"
                          : `${course.completed} av ${course.total} moduler`}
                      </p>
                    </div>
                  </div>
                  {isDone ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  )}
                </div>

                {/* Progress bar */}
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      course.color === "primary" ? "bg-primary" : "bg-accent",
                      isDone && "bg-green-500"
                    )}
                    style={{ width: `${Math.min(course.progress, 100)}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Certificate banner */}
        {allDone && (
          <div className="rounded-xl bg-primary p-8 text-primary-foreground text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase mb-2">
              AI-redo 2026
            </h2>
            <p className="opacity-80 max-w-sm mx-auto">
              Du har slutfört båda kurserna. Bra jobbat! Ditt företag är ett
              steg närmare en AI-redo arbetsplats.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
