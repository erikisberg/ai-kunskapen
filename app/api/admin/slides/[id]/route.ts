import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import * as cms from "@/lib/directus-admin";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const slide = await cms.updateSlide(id, body);
  return NextResponse.json({ slide });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await cms.deleteSlide(id);
  return NextResponse.json({ ok: true });
}
