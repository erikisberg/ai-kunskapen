import type {
  Tenant,
  Course,
  Module,
  Slide,
  QuizOption,
  ScenarioChoice,
  ChecklistItem,
} from "./directus";

export const mockTenant: Tenant = {
  id: "t1",
  name: "Östersunds kommun",
  slug: "ostersund",
  logo: null,
  primary_color: "#e8a87c",
  secondary_color: "#b7c4a1",
  footer_text: "Ett initiativ av Östersunds kommun",
  domain: null,
};

export const mockCourses: Course[] = [
  {
    id: "c1",
    tenant_id: "t1",
    title: "Lär dig använda AI",
    slug: "anvanda-ai",
    description:
      "Lär dig grunderna i hur AI fungerar och hur du kan använda det i vardagen och på jobbet.",
    accent_color: "#f5cac3",
    illustration: null,
    sort_order: 1,
  },
  {
    id: "c2",
    tenant_id: "t1",
    title: "Förstå risken med AI",
    slug: "risken-med-ai",
    description:
      "Lär dig känna igen deepfakes, AI-bedrägerier och skydda dig och din familj.",
    accent_color: "#f2e8cf",
    illustration: null,
    sort_order: 2,
  },
];

export const mockModules: Record<string, Module[]> = {
  c1: [
    { id: "m1", course_id: "c1", title: "Vad är AI egentligen?", slug: "vad-ar-ai", description: "Förstå grunderna", sort_order: 1, estimated_minutes: 3 },
    { id: "m2", course_id: "c1", title: "Prata med AI — promptning", slug: "promptning", description: "Lär dig skriva bra prompts", sort_order: 2, estimated_minutes: 4 },
    { id: "m3", course_id: "c1", title: "Skapa med AI", slug: "skapa-med-ai", description: "AI som kreativ partner", sort_order: 3, estimated_minutes: 3 },
    { id: "m4", course_id: "c1", title: "AI i vardagen & på jobbet", slug: "vardagen-jobbet", description: "Praktiska användningsfall", sort_order: 4, estimated_minutes: 3 },
    { id: "m5", course_id: "c1", title: "Lita inte blint", slug: "lita-inte-blint", description: "Automation bias och kritiskt tänkande", sort_order: 5, estimated_minutes: 4 },
    { id: "m6", course_id: "c1", title: "Dina rättigheter & integritet", slug: "rattigheter", description: "EU AI Act och GDPR", sort_order: 6, estimated_minutes: 3 },
  ],
  c2: [
    { id: "m7", course_id: "c2", title: "AI kan fejka allt", slug: "fejka-allt", description: "Deepfakes och röstkloning", sort_order: 1, estimated_minutes: 3 },
    { id: "m8", course_id: "c2", title: "Bedrägerier & röstkloning", slug: "bedragerier", description: "Scenarion och skydd", sort_order: 2, estimated_minutes: 4 },
    { id: "m9", course_id: "c2", title: "Desinformation & AI-propaganda", slug: "desinformation", description: "Källkritik 2.0", sort_order: 3, estimated_minutes: 3 },
    { id: "m10", course_id: "c2", title: "Barn, unga & AI", slug: "barn-unga", description: "Skydda dina barn", sort_order: 4, estimated_minutes: 4 },
    { id: "m11", course_id: "c2", title: "Skydda dig praktiskt", slug: "skydda-dig", description: "Konkreta steg", sort_order: 5, estimated_minutes: 3 },
    { id: "m12", course_id: "c2", title: "Dina rättigheter & vart du vänder dig", slug: "rattigheter-hjalp", description: "Juridik och anmälan", sort_order: 6, estimated_minutes: 3 },
  ],
};

// Sample slides for first module of each course
export const mockSlides: Record<string, Slide[]> = {
  m1: [
    {
      id: "s1",
      module_id: "m1",
      sort_order: 1,
      type: "info",
      heading: "Vad är AI?",
      body_text:
        "AI, eller artificiell intelligens, är inte magi och det tänker inte som du och jag. Det är i grunden ett datorprogram som tränats på enorma mängder text och data för att kunna förutsäga vad som borde komma härnäst i en mening.\n\nTänk dig att du skriver ett meddelande och telefonen föreslår nästa ord — det är samma princip, fast mycket mer avancerat.",
      illustration: null,
      llm_system_prompt: null,
      llm_instruction_text: null,
      llm_max_messages: null,
    },
    {
      id: "s2",
      module_id: "m1",
      sort_order: 2,
      type: "info",
      heading: "Hur har den lärt sig?",
      body_text:
        "Språkmodeller som ChatGPT och Claude har tränats på miljarder texter — böcker, webbsidor, artiklar. De har läst mer text än någon människa någonsin kan.\n\nMen det betyder inte att de förstår. De är väldigt bra på att *låta* kunniga, men de kan inte tänka, känna eller ha åsikter. De producerar text som statistiskt sett passar i sammanhanget.",
      illustration: null,
      llm_system_prompt: null,
      llm_instruction_text: null,
      llm_max_messages: null,
    },
    {
      id: "s3",
      module_id: "m1",
      sort_order: 3,
      type: "quiz",
      heading: "Kan AI göra detta?",
      body_text: "Testa vad du har lärt dig. Vilka av dessa kan en AI-chatbot göra bra?",
      illustration: null,
      llm_system_prompt: null,
      llm_instruction_text: null,
      llm_max_messages: null,
    },
  ],
  m7: [
    {
      id: "s10",
      module_id: "m7",
      sort_order: 1,
      type: "info",
      heading: "AI kan fejka verkligheten",
      body_text:
        "Det räcker med 3 sekunders inspelat ljud för att skapa en kopia av din röst. Deepfakes — falska bilder, videor och röster skapade med AI — har exploderat.\n\nUnder 2025 ökade AI-bedrägerier med över 1200%. Var fjärde person har redan fått ett samtal med en fejkad röst.",
      illustration: null,
      llm_system_prompt: null,
      llm_instruction_text: null,
      llm_max_messages: null,
    },
    {
      id: "s11",
      module_id: "m7",
      sort_order: 2,
      type: "scenario",
      heading: "Äkta eller fejk?",
      body_text:
        "Du ser ett videoklipp på sociala medier där en känd svensk politiker säger något kontroversiellt. Klippet ser övertygande ut. Vad gör du?",
      illustration: null,
      llm_system_prompt: null,
      llm_instruction_text: null,
      llm_max_messages: null,
    },
  ],
};

export const mockQuizOptions: Record<string, QuizOption[]> = {
  s3: [
    { id: "q1", slide_id: "s3", option_text: "Sammanfatta en lång text", is_correct: true, feedback_text: "Rätt! AI är utmärkt på att sammanfatta text.", sort_order: 1 },
    { id: "q2", slide_id: "s3", option_text: "Ge dig garanterat korrekta fakta", is_correct: false, feedback_text: "Nej — AI kan \"hallucinera\" och hitta på fakta som låter rimliga men är felaktiga. Verifiera alltid!", sort_order: 2 },
    { id: "q3", slide_id: "s3", option_text: "Hjälpa dig brainstorma idéer", is_correct: true, feedback_text: "Rätt! AI är en utmärkt brainstorming-partner.", sort_order: 3 },
    { id: "q4", slide_id: "s3", option_text: "Förstå dina känslor", is_correct: false, feedback_text: "Nej — AI kan inte känna empati eller förstå känslor. Den kan bara simulera förståelse baserat på mönster i text.", sort_order: 4 },
  ],
};

export const mockScenarioChoices: Record<string, ScenarioChoice[]> = {
  s11: [
    { id: "sc1", slide_id: "s11", choice_text: "Delar videon direkt — folk måste få veta!", outcome_text: "Stopp! Genom att dela en potentiell deepfake hjälper du den att spridas. Det är precis vad skaparen vill.", is_recommended: false, sort_order: 1 },
    { id: "sc2", slide_id: "s11", choice_text: "Kollar om etablerade nyhetsmedier rapporterat om det", outcome_text: "Bra val! Om det vore en riktig nyhet hade trovärdiga medier rapporterat om det. Att kolla källan är alltid första steget.", is_recommended: true, sort_order: 2 },
    { id: "sc3", slide_id: "s11", choice_text: "Söker efter originalklippet för att jämföra", outcome_text: "Smart! Att söka efter originalkällan hjälper dig avgöra om klippet är manipulerat. Deepfakes har ofta subtila avvikelser.", is_recommended: true, sort_order: 3 },
  ],
};

export const mockChecklistItems: Record<string, ChecklistItem[]> = {};
