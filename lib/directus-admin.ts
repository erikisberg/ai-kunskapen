/**
 * Directus admin operations — CRUD for courses, modules, slides.
 * Uses Directus REST API directly for write operations.
 */

const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055";
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || "";

async function directusFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${DIRECTUS_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DIRECTUS_TOKEN}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Directus ${res.status}: ${text}`);
  }

  return res.json();
}

// --- Courses ---

export async function createCourse(data: {
  tenant_id: string;
  title: string;
  slug: string;
  description: string;
  accent_color?: string;
  sort_order?: number;
}) {
  const result = await directusFetch("/items/courses", {
    method: "POST",
    body: JSON.stringify({
      accent_color: "#7546FF",
      sort_order: 0,
      ...data,
    }),
  });
  return result.data;
}

export async function updateCourse(id: string, data: Partial<{
  title: string;
  slug: string;
  description: string;
  accent_color: string;
  sort_order: number;
}>) {
  const result = await directusFetch(`/items/courses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return result.data;
}

export async function deleteCourse(id: string) {
  await directusFetch(`/items/courses/${id}`, { method: "DELETE" });
}

// --- Modules ---

export async function createModule(data: {
  course_id: string;
  title: string;
  slug: string;
  description?: string;
  sort_order?: number;
  estimated_minutes?: number;
}) {
  const result = await directusFetch("/items/modules", {
    method: "POST",
    body: JSON.stringify({
      description: "",
      sort_order: 0,
      estimated_minutes: 5,
      ...data,
    }),
  });
  return result.data;
}

export async function updateModule(id: string, data: Partial<{
  title: string;
  slug: string;
  description: string;
  sort_order: number;
  estimated_minutes: number;
}>) {
  const result = await directusFetch(`/items/modules/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return result.data;
}

export async function deleteModule(id: string) {
  await directusFetch(`/items/modules/${id}`, { method: "DELETE" });
}

// --- Slides ---

export async function createSlide(data: {
  module_id: string;
  type: string;
  heading: string;
  body_text?: string;
  sort_order?: number;
  video_url?: string;
  llm_system_prompt?: string;
  llm_instruction_text?: string;
  llm_max_messages?: number;
}) {
  const result = await directusFetch("/items/slides", {
    method: "POST",
    body: JSON.stringify({
      body_text: "",
      sort_order: 0,
      ...data,
    }),
  });
  return result.data;
}

export async function updateSlide(id: string, data: Partial<{
  type: string;
  heading: string;
  body_text: string;
  sort_order: number;
  video_url: string | null;
  llm_system_prompt: string | null;
  llm_instruction_text: string | null;
  llm_max_messages: number | null;
}>) {
  const result = await directusFetch(`/items/slides/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return result.data;
}

export async function deleteSlide(id: string) {
  await directusFetch(`/items/slides/${id}`, { method: "DELETE" });
}

// --- Quiz options ---

export async function createQuizOption(data: {
  slide_id: string;
  option_text: string;
  is_correct: boolean;
  feedback_text?: string;
  sort_order?: number;
}) {
  const result = await directusFetch("/items/quiz_options", {
    method: "POST",
    body: JSON.stringify({ feedback_text: "", sort_order: 0, ...data }),
  });
  return result.data;
}

export async function updateQuizOption(id: string, data: Partial<{
  option_text: string;
  is_correct: boolean;
  feedback_text: string;
  sort_order: number;
}>) {
  const result = await directusFetch(`/items/quiz_options/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return result.data;
}

export async function deleteQuizOption(id: string) {
  await directusFetch(`/items/quiz_options/${id}`, { method: "DELETE" });
}

// --- Scenario choices ---

export async function createScenarioChoice(data: {
  slide_id: string;
  choice_text: string;
  outcome_text?: string;
  is_recommended: boolean;
  sort_order?: number;
}) {
  const result = await directusFetch("/items/scenario_choices", {
    method: "POST",
    body: JSON.stringify({ outcome_text: "", sort_order: 0, ...data }),
  });
  return result.data;
}

export async function updateScenarioChoice(id: string, data: Partial<{
  choice_text: string;
  outcome_text: string;
  is_recommended: boolean;
  sort_order: number;
}>) {
  const result = await directusFetch(`/items/scenario_choices/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return result.data;
}

export async function deleteScenarioChoice(id: string) {
  await directusFetch(`/items/scenario_choices/${id}`, { method: "DELETE" });
}

// --- Checklist items ---

export async function createChecklistItem(data: {
  slide_id: string;
  item_text: string;
  sort_order?: number;
}) {
  const result = await directusFetch("/items/checklist_items", {
    method: "POST",
    body: JSON.stringify({ sort_order: 0, ...data }),
  });
  return result.data;
}

export async function updateChecklistItem(id: string, data: Partial<{
  item_text: string;
  sort_order: number;
}>) {
  const result = await directusFetch(`/items/checklist_items/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return result.data;
}

export async function deleteChecklistItem(id: string) {
  await directusFetch(`/items/checklist_items/${id}`, { method: "DELETE" });
}
