import { createDirectus, rest, staticToken, readItems, readItem } from "@directus/sdk";

// --- CMS Types (match Directus collections) ---

export type Tenant = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  primary_color: string;
  secondary_color: string;
  footer_text: string;
  domain: string | null;
};

export type Course = {
  id: string;
  tenant_id: string;
  title: string;
  slug: string;
  description: string;
  accent_color: string;
  illustration: string | null;
  sort_order: number;
  status: "draft" | "published";
  modules?: Module[];
};

export type Module = {
  id: string;
  course_id: string;
  title: string;
  slug: string;
  description: string;
  sort_order: number;
  estimated_minutes: number;
};

export type SlideType =
  | "info"
  | "llm_chat"
  | "quiz"
  | "scenario"
  | "flow"
  | "checklist";

export type Slide = {
  id: string;
  module_id: string;
  sort_order: number;
  type: SlideType;
  heading: string;
  body_text: string;
  illustration: string | null;
  video_url: string | null;
  llm_system_prompt: string | null;
  llm_instruction_text: string | null;
  llm_max_messages: number | null;
  quiz_options?: QuizOption[];
  scenario_choices?: ScenarioChoice[];
  checklist_items?: ChecklistItem[];
};

export type QuizOption = {
  id: string;
  slide_id: string;
  option_text: string;
  is_correct: boolean;
  feedback_text: string;
  sort_order: number;
};

export type ScenarioChoice = {
  id: string;
  slide_id: string;
  choice_text: string;
  outcome_text: string;
  is_recommended: boolean;
  sort_order: number;
};

export type ChecklistItem = {
  id: string;
  slide_id: string;
  item_text: string;
  sort_order: number;
};

// --- Directus Schema ---

type Schema = {
  tenants: Tenant[];
  courses: Course[];
  modules: Module[];
  slides: Slide[];
  quiz_options: QuizOption[];
  scenario_choices: ScenarioChoice[];
  checklist_items: ChecklistItem[];
};

// --- Client ---

const directus = createDirectus<Schema>(
  process.env.DIRECTUS_URL || "http://localhost:8055"
)
  .with(staticToken(process.env.DIRECTUS_TOKEN || ""))
  .with(rest());

// --- Fetchers ---

export async function getTenant(): Promise<Tenant> {
  const tenants = await directus.request(
    readItems("tenants", { limit: 1 })
  );
  if (!tenants.length) throw new Error("No tenant configured in CMS");
  return tenants[0];
}

export async function getCourses(tenantId: string): Promise<Course[]> {
  return directus.request(
    readItems("courses", {
      filter: { tenant_id: { _eq: tenantId } },
      sort: ["sort_order"],
    })
  );
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const courses = await directus.request(
    readItems("courses", {
      filter: { slug: { _eq: slug } },
      limit: 1,
    })
  );
  if (!courses.length) return null;

  const course = courses[0];
  const modules = await directus.request(
    readItems("modules", {
      filter: { course_id: { _eq: course.id } },
      sort: ["sort_order"],
    })
  );

  return { ...course, modules };
}

export async function getModuleWithSlides(
  courseSlug: string,
  moduleSlug: string
): Promise<{
  course: Course;
  module: Module;
  slides: Slide[];
  allModules: Module[];
} | null> {
  const course = await getCourseBySlug(courseSlug);
  if (!course) return null;

  const modules = await directus.request(
    readItems("modules", {
      filter: { course_id: { _eq: course.id } },
      sort: ["sort_order"],
    })
  );

  const module = modules.find((m) => m.slug === moduleSlug);
  if (!module) return null;

  const slides = await directus.request(
    readItems("slides", {
      filter: { module_id: { _eq: module.id } },
      sort: ["sort_order"],
    })
  );

  // Fetch related data for each slide type
  const enrichedSlides = await Promise.all(
    slides.map(async (slide) => {
      const enriched: Slide = { ...slide };

      if (slide.type === "quiz") {
        enriched.quiz_options = await directus.request(
          readItems("quiz_options", {
            filter: { slide_id: { _eq: slide.id } },
            sort: ["sort_order"],
          })
        );
      }

      if (slide.type === "scenario") {
        enriched.scenario_choices = await directus.request(
          readItems("scenario_choices", {
            filter: { slide_id: { _eq: slide.id } },
            sort: ["sort_order"],
          })
        );
      }

      if (slide.type === "checklist") {
        enriched.checklist_items = await directus.request(
          readItems("checklist_items", {
            filter: { slide_id: { _eq: slide.id } },
            sort: ["sort_order"],
          })
        );
      }

      return enriched;
    })
  );

  return {
    course,
    module,
    slides: enrichedSlides,
    allModules: modules,
  };
}

export { directus };
