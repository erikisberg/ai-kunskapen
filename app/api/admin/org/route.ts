import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import * as schema from "@/lib/schema";

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
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, industry, description, employeeCount } = await req.json();

  if (!name?.trim()) {
    return NextResponse.json({ error: "Namn krävs" }, { status: 400 });
  }

  const [org] = await db
    .insert(schema.organizations)
    .values({
      name: name.trim(),
      slug: slugify(name),
      industry: industry?.trim() || null,
      description: description?.trim() || null,
      employeeCount: employeeCount || null,
    })
    .returning();

  return NextResponse.json({ org });
}
