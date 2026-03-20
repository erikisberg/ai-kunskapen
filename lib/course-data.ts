/**
 * Course data layer — fetches from Directus CMS.
 * No mock data — requires Directus to be running.
 */

import {
  getTenant,
  getCourses,
  getCourseBySlug,
  getModuleWithSlides,
} from "./directus";

import type {
  Tenant,
  Course,
  Module,
  Slide,
  QuizOption,
  ScenarioChoice,
  ChecklistItem,
} from "./directus";

export type { Tenant, Course, Module, Slide, QuizOption, ScenarioChoice, ChecklistItem };

export type JourneyType = "learn" | "safe";

export interface StepData {
  id: string;
  title: string;
  type: "intro" | "content" | "quiz" | "scenario" | "llm_chat" | "checklist" | "flow" | "complete";
  heading: string;
  bodyText: string;
  systemPrompt?: string;
  instructionText?: string;
  maxMessages?: number;
  suggestedPrompts?: string[];
  quizOptions?: QuizOption[];
  scenarioChoices?: Array<{
    text: string;
    isCorrect: boolean;
    feedback: string;
  }>;
  scenarioType?: "call" | "email" | "message";
  checklistItems?: Array<{
    id: string;
    text: string;
    description?: string;
  }>;
  flowSteps?: Array<{
    label: string;
    description: string;
    icon?: string;
  }>;
}

export interface CourseData {
  course: Course;
  journeyType: JourneyType;
  steps: StepData[];
}

export async function getCourseData(courseSlug: string): Promise<CourseData> {
  const course = await getCourseBySlug(courseSlug);
  if (!course || !course.modules) {
    throw new Error(`Course "${courseSlug}" not found in CMS`);
  }

  const journeyType: JourneyType = courseSlug === "anvanda-ai" ? "learn" : "safe";
  const steps: StepData[] = [];

  for (const module of course.modules) {
    const data = await getModuleWithSlides(courseSlug, module.slug);
    if (!data) continue;

    for (const slide of data.slides) {
      const step: StepData = {
        id: `${courseSlug}-${module.slug}-${slide.sort_order}`,
        title: module.title,
        type: slide.type === "info" ? "content" : (slide.type as StepData["type"]),
        heading: slide.heading,
        bodyText: slide.body_text,
      };

      if (slide.type === "llm_chat") {
        step.systemPrompt = slide.llm_system_prompt || undefined;
        step.instructionText = slide.llm_instruction_text || undefined;
        step.maxMessages = slide.llm_max_messages || 10;
        step.suggestedPrompts = ["Prova att ställa en fråga", "Vad kan du hjälpa mig med?"];
      }

      if (slide.type === "quiz" && slide.quiz_options) {
        step.quizOptions = slide.quiz_options;
      }

      if (slide.type === "scenario" && slide.scenario_choices) {
        step.scenarioChoices = slide.scenario_choices.map((c) => ({
          text: c.choice_text,
          isCorrect: c.is_recommended,
          feedback: c.outcome_text,
        }));
        const lower = slide.body_text.toLowerCase();
        step.scenarioType =
          lower.includes("ringer") || lower.includes("samtal") || lower.includes("telefon")
            ? "call"
            : lower.includes("mejl") || lower.includes("mail")
              ? "email"
              : "message";
      }

      if (slide.type === "checklist" && slide.checklist_items) {
        step.checklistItems = slide.checklist_items.map((item) => ({
          id: item.id,
          text: item.item_text,
        }));
      }

      steps.push(step);
    }
  }

  return { course, journeyType, steps };
}

export async function getAllCourses(): Promise<Course[]> {
  const tenant = await getTenant();
  return getCourses(tenant.id);
}

export { getTenant };
