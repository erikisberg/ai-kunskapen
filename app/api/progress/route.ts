import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  saveModuleCompletion,
  getUserProgress,
  recordAnonymousStat,
} from "@/lib/progress";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Inte inloggad" }, { status: 401 });
  }

  const progressData = await getUserProgress(session.user.id);
  return NextResponse.json(progressData);
}

export async function POST(req: Request) {
  const { courseSlug, moduleSlug } = await req.json();

  if (!courseSlug || !moduleSlug) {
    return NextResponse.json(
      { error: "courseSlug och moduleSlug krävs" },
      { status: 400 }
    );
  }

  // Always record anonymous stat
  await recordAnonymousStat(courseSlug, moduleSlug, "module_completed");

  // Save individual progress if logged in
  const session = await auth();
  if (session?.user?.id) {
    await saveModuleCompletion(session.user.id, courseSlug, moduleSlug);
  }

  return NextResponse.json({ ok: true });
}
