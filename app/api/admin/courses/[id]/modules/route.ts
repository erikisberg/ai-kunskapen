import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import * as cms from "@/lib/directus-admin";

function slugify(name: string): string {
  return name.toLowerCase().replace(/[åä]/g, "a").replace(/ö/g, "o").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: courseId } = await params;
  const { title, sort_order } = await req.json();
  if (!title?.trim()) return NextResponse.json({ error: "Titel krävs" }, { status: 400 });

  const mod = await cms.createModule({
    course_id: courseId,
    title: title.trim(),
    slug: slugify(title),
    sort_order: sort_order || 0,
  });

  return NextResponse.json({ module: mod });
}
