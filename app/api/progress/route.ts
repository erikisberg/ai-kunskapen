import { NextResponse } from "next/server";

const isDbConfigured = !!process.env.DATABASE_URL;

export async function GET() {
  if (!isDbConfigured) {
    return NextResponse.json([]);
  }
  const { auth } = await import("@/lib/auth");
  const { getUserProgress } = await import("@/lib/progress");
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Inte inloggad" }, { status: 401 });
  }
  const progressData = await getUserProgress((session as any).user.id);
  return NextResponse.json(progressData);
}

export async function POST(req: Request) {
  const { courseSlug, moduleSlug } = await req.json();

  if (!courseSlug || !moduleSlug) {
    return NextResponse.json({ error: "courseSlug och moduleSlug krävs" }, { status: 400 });
  }

  if (isDbConfigured) {
    const { recordAnonymousStat } = await import("@/lib/progress");
    const { auth } = await import("@/lib/auth");
    await recordAnonymousStat(courseSlug, moduleSlug, "module_completed");
    const session = await auth();
    if (session) {
      const { saveModuleCompletion } = await import("@/lib/progress");
      await saveModuleCompletion((session as any).user.id, courseSlug, moduleSlug);
    }
  }

  return NextResponse.json({ ok: true });
}
