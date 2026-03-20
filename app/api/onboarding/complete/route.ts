import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import * as schema from "@/lib/schema";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await db
    .update(schema.users)
    .set({ onboarded: true })
    .where(eq(schema.users.id, session.user.id));

  return NextResponse.json({ ok: true });
}
