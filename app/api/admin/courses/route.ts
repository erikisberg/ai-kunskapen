import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getTenant } from "@/lib/directus";
import * as cms from "@/lib/directus-admin";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[åä]/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description } = await req.json();
  if (!title?.trim()) return NextResponse.json({ error: "Titel krävs" }, { status: 400 });

  const tenant = await getTenant();
  const course = await cms.createCourse({
    tenant_id: tenant.id,
    title: title.trim(),
    slug: slugify(title),
    description: description?.trim() || "",
  });

  return NextResponse.json({ course });
}
