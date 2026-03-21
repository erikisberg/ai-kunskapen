import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import * as cms from "@/lib/directus-admin";

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { module_id, type, heading } = body;

  if (!module_id || !type || !heading?.trim()) {
    return NextResponse.json({ error: "module_id, type och heading krävs" }, { status: 400 });
  }

  const slide = await cms.createSlide({
    module_id,
    type,
    heading: heading.trim(),
    body_text: body.body_text || "",
    sort_order: body.sort_order || 0,
    video_url: body.video_url || undefined,
    llm_system_prompt: body.llm_system_prompt || undefined,
    llm_instruction_text: body.llm_instruction_text || undefined,
    llm_max_messages: body.llm_max_messages || undefined,
  });

  // Create sub-items if provided
  if (type === "quiz" && body.quiz_options) {
    for (const opt of body.quiz_options) {
      await cms.createQuizOption({ slide_id: slide.id, ...opt });
    }
  }
  if (type === "scenario" && body.scenario_choices) {
    for (const ch of body.scenario_choices) {
      await cms.createScenarioChoice({ slide_id: slide.id, ...ch });
    }
  }
  if (type === "checklist" && body.checklist_items) {
    for (const item of body.checklist_items) {
      await cms.createChecklistItem({ slide_id: slide.id, ...item });
    }
  }

  return NextResponse.json({ slide });
}
