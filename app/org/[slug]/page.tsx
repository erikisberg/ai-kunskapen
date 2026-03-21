import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import * as schema from "@/lib/schema";
import { eq, sql, count, and, inArray } from "drizzle-orm";
import Link from "next/link";
import { Users, CheckCircle2, Heart, BookOpen, ShieldCheck, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PublicOrgDashboard({ params }: Props) {
  const { slug } = await params;

  let org;
  try {
    const [found] = await db
      .select()
      .from(schema.organizations)
      .where(eq(schema.organizations.slug, slug))
      .limit(1);
    org = found;
  } catch {
    notFound();
  }

  if (!org) notFound();

  // All invitations
  const invitations = await db
    .select()
    .from(schema.invitations)
    .where(eq(schema.invitations.orgId, org.id))
    .orderBy(schema.invitations.createdAt);

  // All org users with their progress
  const orgUsers = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.orgId, org.id));

  const userIds = orgUsers.map((u) => u.id);

  // Get all progress for org users
  let allProgress: { userId: string; courseSlug: string; moduleSlug: string }[] = [];
  if (userIds.length > 0) {
    allProgress = await db
      .select({
        userId: schema.progress.userId,
        courseSlug: schema.progress.courseSlug,
        moduleSlug: schema.progress.moduleSlug,
      })
      .from(schema.progress)
      .where(inArray(schema.progress.userId, userIds));
  }

  // Build per-person data — deduplicate by email
  const seenEmails = new Set<string>();
  const people = invitations
    .filter((inv) => {
      if (seenEmails.has(inv.email)) return false;
      seenEmails.add(inv.email);
      return true;
    })
    .map((inv) => {
      const user = orgUsers.find((u) => u.email === inv.email);
      const userProgress = user
        ? allProgress.filter((p) => p.userId === user.id)
        : [];

      const learnModules = userProgress.filter((p) => p.courseSlug === "anvanda-ai");
      const safeModules = userProgress.filter((p) => p.courseSlug === "forsta-risken");

      const hasStarted = inv.status === "accepted";
      const learnDone = learnModules.length >= 9;
      const safeDone = safeModules.length >= 11;
      const completedAnyCourse = learnDone || safeDone;

      return {
        email: inv.email,
        name: user?.name,
        inviteStatus: inv.status,
        hasStarted,
        learnModules: learnModules.length,
        safeModules: safeModules.length,
        learnDone,
        safeDone,
        completedAnyCourse,
        bothDone: learnDone && safeDone,
      };
    });

  // Aggregate stats
  const total = people.length;
  const accepted = people.filter((p) => p.hasStarted).length;
  const completedAtLeastOne = people.filter((p) => p.completedAnyCourse).length;
  const donation = (completedAtLeastOne * (org.pricePerUser || 0)) / 100;
  const completionRate = total > 0 ? Math.round((completedAtLeastOne / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <Link href="/" className="font-[family-name:var(--font-display)] text-sm uppercase text-muted-foreground tracking-widest mb-3 block">
            AI-kunskapen
          </Link>
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl uppercase tracking-[-0.03em] leading-[1.1]">
            {org.name}
          </h1>
          {org.industry && (
            <p className="text-muted-foreground mt-1">{org.industry}</p>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="border border-border rounded-xl p-5 bg-card text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-3xl font-semibold tabular-nums">{accepted}</p>
            <p className="text-xs text-muted-foreground mt-1">Deltagare</p>
          </div>
          <div className="border border-border rounded-xl p-5 bg-card text-center">
            <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <p className="text-3xl font-semibold tabular-nums">{completedAtLeastOne}</p>
            <p className="text-xs text-muted-foreground mt-1">Slutfört</p>
          </div>
          <div className="border border-border rounded-xl p-5 bg-card text-center">
            <BookOpen className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-3xl font-semibold tabular-nums">{completionRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">Genomförande</p>
          </div>
          <div className="border border-border rounded-xl p-5 bg-card text-center">
            <Heart className="w-6 h-6 mx-auto mb-2 text-red-400" />
            <p className="text-3xl font-semibold tabular-nums">{donation.toLocaleString("sv-SE")}</p>
            <p className="text-xs text-muted-foreground mt-1">Bidrag (kr)</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Framsteg</span>
            <span className="text-sm text-muted-foreground">{completedAtLeastOne} av {total}</span>
          </div>
          <div className="h-3 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${Math.min(completionRate, 100)}%` }}
            />
          </div>
        </div>

        {/* People table */}
        {people.length > 0 && (
          <div className="mb-10">
            <h2 className="font-[family-name:var(--font-display)] text-xl uppercase mb-4">
              Anställda
            </h2>
            <div className="border border-border rounded-xl overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Person</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">
                      <span className="hidden sm:inline">Lär dig använda AI</span>
                      <span className="sm:hidden">Kurs 1</span>
                    </th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">
                      <span className="hidden sm:inline">Förstå risken</span>
                      <span className="sm:hidden">Kurs 2</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {people.map((person) => (
                    <tr key={person.email} className="border-b border-border last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0",
                            person.bothDone
                              ? "bg-green-500/10 text-green-600"
                              : person.hasStarted
                                ? "bg-primary/10 text-primary"
                                : "bg-secondary text-muted-foreground"
                          )}>
                            {(person.name?.[0] || person.email[0]).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            {person.name && (
                              <p className="font-medium text-sm truncate">{person.name}</p>
                            )}
                            <p className="text-xs text-muted-foreground truncate">{person.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {person.bothDone ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Klar
                          </span>
                        ) : person.hasStarted ? (
                          <span className="inline-flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            Aktiv
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" />
                            Inbjuden
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <CourseStatus done={person.learnDone} modules={person.learnModules} total={9} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <CourseStatus done={person.safeDone} modules={person.safeModules} total={11} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Charity info */}
        {org.charityName && donation > 0 && (
          <div className="rounded-xl bg-primary p-6 text-primary-foreground text-center mb-8">
            <Heart className="w-8 h-8 mx-auto mb-3 opacity-80" />
            <p className="text-lg font-semibold mb-1">
              {donation.toLocaleString("sv-SE")} kr till {org.charityName}
            </p>
            <p className="text-sm opacity-70">
              Tack vare att {completedAtLeastOne} anställda slutfört kursen
            </p>
          </div>
        )}

        {/* Badge if all done */}
        {completionRate >= 100 && (
          <div className="rounded-xl border-2 border-primary p-8 text-center">
            <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-primary" />
            <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase mb-2">
              AI-redo arbetsplats 2026
            </h2>
            <p className="text-muted-foreground text-sm">
              Alla anställda har slutfört AI-kunskapen.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function CourseStatus({ done, modules, total }: { done: boolean; modules: number; total: number }) {
  if (done) {
    return <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />;
  }
  if (modules === 0) {
    return <Circle className="w-4 h-4 text-foreground/10 mx-auto" />;
  }
  // In progress — show mini progress bar
  const pct = Math.round((modules / total) * 100);
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="w-12 h-1.5 rounded-full bg-secondary overflow-hidden">
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] text-muted-foreground tabular-nums">{pct}%</span>
    </div>
  );
}
