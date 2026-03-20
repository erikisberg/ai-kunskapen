/**
 * Course data layer — fetches from Directus CMS, falls back to mock data.
 *
 * This is the single source of truth for course content in the app.
 * All journey pages consume data through these functions.
 */

import type {
  Tenant,
  Course,
  Module,
  Slide,
  QuizOption,
  ScenarioChoice,
  ChecklistItem,
} from "./directus";

// Re-export types for consumers
export type { Tenant, Course, Module, Slide, QuizOption, ScenarioChoice, ChecklistItem };

export type JourneyType = "learn" | "safe";

export interface StepData {
  id: string;
  title: string;
  type: "intro" | "content" | "quiz" | "scenario" | "llm_chat" | "checklist" | "complete";
  heading: string;
  bodyText: string;
  // For llm_chat
  systemPrompt?: string;
  instructionText?: string;
  maxMessages?: number;
  suggestedPrompts?: string[];
  // For quiz
  quizOptions?: QuizOption[];
  // For scenario
  scenarioChoices?: Array<{
    text: string;
    isCorrect: boolean;
    feedback: string;
  }>;
  scenarioType?: "call" | "email" | "message";
  // For checklist
  checklistItems?: Array<{
    id: string;
    text: string;
    description?: string;
  }>;
}

export interface CourseData {
  course: Course;
  journeyType: JourneyType;
  steps: StepData[];
}

// --- Try Directus first, fall back to mock ---

async function fetchFromDirectus(courseSlug: string): Promise<CourseData | null> {
  try {
    const { getCourseBySlug, getModuleWithSlides } = await import("./directus");

    const course = await getCourseBySlug(courseSlug);
    if (!course || !course.modules) return null;

    const journeyType: JourneyType = courseSlug === "anvanda-ai" ? "learn" : "safe";
    const steps: StepData[] = [];

    for (const module of course.modules) {
      const data = await getModuleWithSlides(courseSlug, module.slug);
      if (!data) continue;

      for (const slide of data.slides) {
        const step: StepData = {
          id: `${courseSlug}-${module.slug}-${slide.sort_order}`,
          title: module.title,
          type: slide.type === "info" ? "content" : slide.type as StepData["type"],
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
          // Infer scenario type from content
          const lower = slide.body_text.toLowerCase();
          step.scenarioType = lower.includes("ringer") || lower.includes("samtal") || lower.includes("telefon")
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
  } catch {
    // Directus not available — fall through to mock
    return null;
  }
}

// --- Mock data (always available) ---

function getMockCourseData(courseSlug: string): CourseData {
  if (courseSlug === "anvanda-ai") return getMockLearnCourse();
  return getMockSafeCourse();
}

function getMockLearnCourse(): CourseData {
  return {
    course: {
      id: "c1",
      tenant_id: "t1",
      title: "Lär dig använda AI",
      slug: "anvanda-ai",
      description: "Lär dig grunderna i hur AI fungerar och hur du kan använda det i vardagen.",
      accent_color: "#7546FF",
      illustration: null,
      sort_order: 1,
    },
    journeyType: "learn",
    steps: [
      {
        id: "learn-intro",
        title: "Välkommen",
        type: "intro",
        heading: "VÄLKOMMEN TILL DIN AI-RESA",
        bodyText: "Under de kommande minuterna kommer du att lära dig grunderna i hur du pratar med AI-chatbotar och hur du kan använda dem i din vardag.",
      },
      {
        id: "learn-what-is-ai",
        title: "Vad är AI?",
        type: "content",
        heading: "VAD ÄR AI EGENTLIGEN?",
        bodyText: "AI, eller artificiell intelligens, är datorsystem som kan utföra uppgifter som vanligtvis kräver mänsklig intelligens — som att förstå språk, svara på frågor och skapa texter.\n\nDe AI-chatbotar du kanske hört talas om — som ChatGPT, Claude eller Copilot — är tränade på enorma mängder text från internet. De har lärt sig mönster i hur vi människor skriver och kommunicerar.\n\nViktigt att veta:\n1. AI är ett verktyg — precis som en miniräknare eller sökmotor\n2. AI kan göra fel — dubbelkolla alltid viktig information\n3. AI ersätter inte ditt eget omdöme",
      },
      {
        id: "learn-quiz-1",
        title: "Snabbkoll",
        type: "quiz",
        heading: "KAN AI GÖRA DETTA?",
        bodyText: "Testa vad du har lärt dig!",
        quizOptions: [
          { id: "q1", slide_id: "s", option_text: "Sammanfatta en lång text", is_correct: true, feedback_text: "Rätt! AI är utmärkt på att sammanfatta text.", sort_order: 1 },
          { id: "q2", slide_id: "s", option_text: "Ge dig garanterat korrekta fakta", is_correct: false, feedback_text: "Nej — AI kan \"hallucinera\" och hitta på fakta som låter rimliga. Verifiera alltid!", sort_order: 2 },
          { id: "q3", slide_id: "s", option_text: "Hjälpa dig brainstorma idéer", is_correct: true, feedback_text: "Rätt! AI är en utmärkt brainstorming-partner.", sort_order: 3 },
          { id: "q4", slide_id: "s", option_text: "Förstå dina känslor på riktigt", is_correct: false, feedback_text: "Nej — AI kan inte känna empati. Den simulerar förståelse baserat på mönster.", sort_order: 4 },
        ],
      },
      {
        id: "learn-first-chat",
        title: "Din första AI-chatt",
        type: "llm_chat",
        heading: "PROVA SJÄLV!",
        bodyText: "Nu är det din tur att prata med en AI. Ställ en fråga om vad som helst!",
        systemPrompt: "Du är en vänlig AI-assistent som hjälper en nybörjare lära sig använda AI-chatbotar. Svara på svenska. Var uppmuntrande och pedagogisk. Håll svaren under 100 ord.",
        instructionText: "Skriv en fråga till AI:n — det kan vara vad som helst!",
        maxMessages: 8,
        suggestedPrompts: ["Ge mig ett enkelt middagsrecept", "Hjälp mig skriva ett mejl", "Vad kan du hjälpa mig med?"],
      },
      {
        id: "learn-prompts",
        title: "Konsten att fråga",
        type: "content",
        heading: "SÅ SKRIVER DU BÄTTRE FRÅGOR",
        bodyText: "Skillnaden mellan ett bra och dåligt svar handlar ofta om hur du ställer frågan.\n\n❌ Dåligt: \"Skriv något om mat\"\n✅ Bra: \"Ge mig ett enkelt recept på pasta med bara 5 ingredienser, för en nybörjare\"\n\nFyra tips:\n1. Var specifik — berätta exakt vad du vill ha\n2. Ge kontext — \"jag är nybörjare\", \"det är till jobbet\"\n3. Ange format — \"som en punktlista\", \"i 3 meningar\"\n4. Iterera — om svaret inte är rätt, finjustera din fråga",
      },
      {
        id: "learn-practice",
        title: "Övning: Bättre frågor",
        type: "llm_chat",
        heading: "ÖVNING: SKRIV BÄTTRE FRÅGOR",
        bodyText: "Prova att använda tipsen du just lärde dig.",
        systemPrompt: "Du är en AI-assistent som hjälper användaren öva på att skriva bra prompts. Svara på svenska. Ge kort feedback på hur bra deras prompt var och ett tips på hur den kunde bli ännu bättre. Håll svaren under 120 ord.",
        instructionText: "Skriv en specifik fråga med kontext och format!",
        maxMessages: 8,
        suggestedPrompts: ["Hjälp mig skriva ett formellt mejl till min hyresvärd", "Förklara fotosyntesen för en 8-åring"],
      },
      {
        id: "learn-use-cases",
        title: "AI i vardagen",
        type: "content",
        heading: "AI I DIN VARDAG",
        bodyText: "Här är fem sätt du kan använda AI redan idag:\n\n✍️ Skriva — Mejl, brev, ansökningar, inbjudningar\n📖 Förklara — Komplexa ämnen på enkelt språk\n📅 Planera — Resor, middagar, projekt, event\n💡 Idéer — Brainstorma presenter, aktiviteter, lösningar\n📚 Lära — Nya ämnen i din egen takt\n\nKom ihåg: AI är ett verktyg som du styr. Det ersätter inte ditt omdöme — det förstärker det.",
      },
      {
        id: "learn-tips",
        title: "Tips att ta med",
        type: "checklist",
        heading: "TIPS ATT TA MED DIG",
        bodyText: "Spara dessa tips för att komma igång med AI i vardagen.",
        checklistItems: [
          { id: "t1", text: "Ladda ner en AI-app (ChatGPT, Claude eller Gemini)" },
          { id: "t2", text: "Prova att be AI:n sammanfatta en artikel du läser" },
          { id: "t3", text: "Skriv en specifik prompt med kontext och format" },
          { id: "t4", text: "Dubbelkolla alltid fakta som AI ger dig" },
          { id: "t5", text: "Dela aldrig känslig information (personnummer, lösenord)" },
        ],
      },
      {
        id: "learn-complete",
        title: "Grattis!",
        type: "complete",
        heading: "GRATTIS! DU ÄR REDO",
        bodyText: "Du har lärt dig grunderna i hur du pratar med AI-chatbotar och hur du kan använda dem för att göra vardagen enklare.",
      },
    ],
  };
}

function getMockSafeCourse(): CourseData {
  return {
    course: {
      id: "c2",
      tenant_id: "t1",
      title: "Förstå risken med AI",
      slug: "risken-med-ai",
      description: "Lär dig känna igen deepfakes, AI-bedrägerier och skydda dig och din familj.",
      accent_color: "#F8FE22",
      illustration: null,
      sort_order: 2,
    },
    journeyType: "safe",
    steps: [
      {
        id: "safe-intro",
        title: "Välkommen",
        type: "intro",
        heading: "LÄR DIG SKYDDA DIG",
        bodyText: "Under de kommande minuterna kommer du att lära dig känna igen AI-baserade bedrägerier, deepfakes och hur du skyddar dig själv och din familj.",
      },
      {
        id: "safe-threats",
        title: "AI-hot idag",
        type: "content",
        heading: "TRE AI-HOT DU BEHÖVER KÄNNA TILL",
        bodyText: "🎭 Deepfakes — Falska bilder och videor som ser helt verkliga ut. AI kan skapa en video av vem som helst som säger vad som helst.\n\n📞 Röstbedrägerier — Det räcker med 3 sekunders inspelat ljud för att klona din röst. Bedragare ringer och låtsas vara familjemedlemmar.\n\n📧 AI-genererade bedrägerier — Perfekt formulerade phishing-mejl, falska webbshoppar och romance scams.\n\nUnder 2025 ökade AI-bedrägerier med över 1 200%.",
      },
      {
        id: "safe-deepfakes",
        title: "Vad är deepfakes?",
        type: "content",
        heading: "SÅ KÄNNER DU IGEN EN DEEPFAKE",
        bodyText: "Deepfakes blir allt bättre, men det finns fortfarande tecken:\n\n👁️ Onaturliga ögonrörelser — Blinkningar som ser konstiga ut\n👄 Läppsynk som inte stämmer — Munrörelserna matchar inte orden\n💡 Konstig belysning — Ljuset på ansiktet matchar inte bakgrunden\n🔍 Suddiga kanter — Runt hårfästet eller halsen kan bilden flimmra\n\n⚠️ Var extra skeptisk till sensationellt videoinnehåll på sociala medier.",
      },
      {
        id: "safe-scenario-call",
        title: "Scenario: Samtalet",
        type: "scenario",
        heading: "SCENARIO: SAMTALET",
        bodyText: "Din telefon ringer. Det är din dotter — hon låter stressad.\n\n\"Mamma/pappa, jag har råkat hamna i en situation... Jag behöver att du överför 15 000 kr till mitt konto på Swedbank. Det är jättebråttom!\"\n\nRösten låter precis som din dotter. Men du märker att hon säger \"Sweedbank\" istället för \"Swedbank\".",
        scenarioType: "call",
        scenarioChoices: [
          { text: "Överför pengarna — det låter ju som henne", isCorrect: false, feedback: "Stopp! Även om rösten låter äkta kan den vara AI-genererad. Skicka aldrig pengar baserat på ett enda telefonsamtal." },
          { text: "Lägg på och ring tillbaka på hennes riktiga nummer", isCorrect: true, feedback: "Helt rätt! Att lägga på och ringa tillbaka på ett nummer du vet är korrekt är det bästa sättet att verifiera." },
          { text: "Fråga en hemlig fråga som bara hon kan svara på", isCorrect: false, feedback: "Bättre än att skicka pengar direkt, men en AI med tillräckligt med information kan ibland gissa rätt. Säkrast är att lägga på och ringa tillbaka." },
        ],
      },
      {
        id: "safe-scams",
        title: "AI-bedrägerier",
        type: "content",
        heading: "VANLIGA AI-BEDRÄGERIER",
        bodyText: "AI gör bedrägerier smartare:\n\n📧 Phishing-mejl — AI skriver perfekta mejl utan stavfel\n💕 Romance scams — AI-genererade profiler på dejtingappar\n🛒 Falska webbshoppar — Hela sidor skapade av AI med falska recensioner\n👔 VD-bedrägerier — AI klonar en chefs röst med brådskande betalningskrav\n\nGemensamt: De spelar på brådska och känslor. \"Du måste agera NU!\" är alltid en varningssignal.",
      },
      {
        id: "safe-scenario-email",
        title: "Scenario: Mejlet",
        type: "scenario",
        heading: "SCENARIO: MEJLET",
        bodyText: "Du får ett mejl:\n\nFrån: sakerhet@sweedbank-online.se\nÄmne: Viktigt: Ditt konto har spärrats\n\n\"Hej, vi har upptäckt misstänkt aktivitet på ditt konto. Klicka här för att verifiera din identitet. Agera inom 24 timmar.\"\n\nMejlet ser professionellt ut med Swedbanks logotyp.",
        scenarioType: "email",
        scenarioChoices: [
          { text: "Klicka på länken — det ser ju officiellt ut", isCorrect: false, feedback: "Stopp! Domänen \"sweedbank-online.se\" är inte Swedbanks riktiga domän. Banker ber dig aldrig klicka på länkar i mejl." },
          { text: "Logga in direkt i bankappen eller på bankens webbplats", isCorrect: true, feedback: "Helt rätt! Gå alltid direkt till bankens egen app eller webbplats. Om det finns ett problem ser du det där." },
          { text: "Svara på mejlet och fråga om det stämmer", isCorrect: false, feedback: "Genom att svara bekräftar du att din mejladress är aktiv, vilket kan leda till fler bluffmejl." },
        ],
      },
      {
        id: "safe-quiz",
        title: "Snabbkoll",
        type: "quiz",
        heading: "SNABBKOLL: SKYDDA DIG",
        bodyText: "Vad gör du om du misstänker ett AI-röstbedrägeri?",
        quizOptions: [
          { id: "sq1", slide_id: "s", option_text: "Lägga på och ringa tillbaka på ett känt nummer", is_correct: true, feedback_text: "Precis! Verifiera alltid genom en kanal du vet är äkta.", sort_order: 1 },
          { id: "sq2", slide_id: "s", option_text: "Skicka pengarna och fråga sen", is_correct: false, feedback_text: "Aldrig! Verifiering först, alltid.", sort_order: 2 },
          { id: "sq3", slide_id: "s", option_text: "Fråga i chatten om det verkligen är de", is_correct: false, feedback_text: "En AI-klonad röst kan svara på frågor. Säkrast att lägga på och ringa ett nummer du vet stämmer.", sort_order: 3 },
        ],
      },
      {
        id: "safe-protect",
        title: "Skydda dig",
        type: "checklist",
        heading: "SKYDDA DIG IDAG",
        bodyText: "Gör dessa saker för att skydda dig och din familj.",
        checklistItems: [
          { id: "p1", text: "Bestäm en hemlig kodfras med din familj" },
          { id: "p2", text: "Aktivera tvåfaktorsautentisering på alla viktiga konton" },
          { id: "p3", text: "Lär dig regeln: Lägg på → Ring tillbaka → Verifiera" },
          { id: "p4", text: "Var skeptisk mot \"brådskande\" meddelanden — ta 2 sekunder" },
          { id: "p5", text: "Prata med dina barn om deepfakes och nudify-appar" },
          { id: "p6", text: "Begränsa hur mycket av din röst/bild som finns publikt online" },
        ],
      },
      {
        id: "safe-complete",
        title: "Du är redo!",
        type: "complete",
        heading: "BRA JOBBAT! DU ÄR FÖRBEREDD",
        bodyText: "Du har lärt dig känna igen vanliga AI-bedrägerier och vet hur du skyddar dig och din familj.",
      },
    ],
  };
}

// --- Public API ---

export async function getCourseData(courseSlug: string): Promise<CourseData> {
  // Try Directus first
  const cmsData = await fetchFromDirectus(courseSlug);
  if (cmsData && cmsData.steps.length > 0) return cmsData;

  // Fall back to mock data
  return getMockCourseData(courseSlug);
}

export function getCourseSlugs(): string[] {
  return ["anvanda-ai", "risken-med-ai"];
}
