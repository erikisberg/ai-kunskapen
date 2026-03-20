import { NextResponse } from "next/server";
import { getAggregatedStats } from "@/lib/progress";

export async function GET() {
  const stats = await getAggregatedStats();
  return NextResponse.json(stats);
}
