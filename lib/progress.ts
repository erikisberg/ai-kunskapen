import { db } from "./db";
import { progress, anonymousStats } from "./schema";
import { eq, and, sql } from "drizzle-orm";

export async function saveModuleCompletion(
  userId: string,
  courseSlug: string,
  moduleSlug: string
): Promise<void> {
  // Upsert — don't create duplicate completions
  const existing = await db
    .select()
    .from(progress)
    .where(
      and(
        eq(progress.userId, userId),
        eq(progress.courseSlug, courseSlug),
        eq(progress.moduleSlug, moduleSlug)
      )
    )
    .limit(1);

  if (existing.length === 0) {
    await db.insert(progress).values({
      userId,
      courseSlug,
      moduleSlug,
    });
  }
}

export async function getUserProgress(
  userId: string
): Promise<{ courseSlug: string; moduleSlug: string; completedAt: Date }[]> {
  const rows = await db
    .select({
      courseSlug: progress.courseSlug,
      moduleSlug: progress.moduleSlug,
      completedAt: progress.completedAt,
    })
    .from(progress)
    .where(eq(progress.userId, userId));

  return rows;
}

export async function getAggregatedStats(): Promise<{
  totalCompletions: number;
  courseStats: Record<string, number>;
}> {
  const rows = await db
    .select({
      courseSlug: anonymousStats.courseSlug,
      count: sql<number>`count(*)`,
    })
    .from(anonymousStats)
    .where(eq(anonymousStats.eventType, "module_completed"))
    .groupBy(anonymousStats.courseSlug);

  const courseStats: Record<string, number> = {};
  let totalCompletions = 0;

  for (const row of rows) {
    courseStats[row.courseSlug] = Number(row.count);
    totalCompletions += Number(row.count);
  }

  return { totalCompletions, courseStats };
}

export async function recordAnonymousStat(
  courseSlug: string,
  moduleSlug: string,
  eventType: "module_started" | "module_completed"
): Promise<void> {
  await db.insert(anonymousStats).values({
    courseSlug,
    moduleSlug,
    eventType,
  });
}
