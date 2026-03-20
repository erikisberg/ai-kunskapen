import { NextResponse } from "next/server";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ totalCompletions: 0, courseStats: {} });
  }
  const { getAggregatedStats } = await import("@/lib/progress");
  const stats = await getAggregatedStats();
  return NextResponse.json(stats);
}
