/**
 * Directus Seed Script
 *
 * Populates the CMS with:
 * - 1 tenant (Östersund)
 * - 2 courses (Lär dig använda AI + Förstå risken med AI)
 * - 9 steps per course (matching v0 journey structure)
 * - Quiz options, scenario choices, checklist items
 *
 * Run: DIRECTUS_URL=http://localhost:8055 DIRECTUS_TOKEN=your-token npx tsx directus/seed.ts
 */

const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055";
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || "admin-token";

async function api(path: string, method = "GET", body?: unknown) {
  const res = await fetch(`${DIRECTUS_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DIRECTUS_TOKEN}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${path} failed: ${res.status} ${text}`);
  }
  return res.json();
}

async function createItem(collection: string, data: Record<string, unknown>) {
  const result = await api(`/items/${collection}`, "POST", data);
  return result.data;
}

async function seed() {
  console.log("🌱 Seeding Directus...\n");

  // --- Tenant ---
  console.log("Creating tenant...");
  const tenant = await createItem("tenants", {
    name: "Östersunds kommun",
    slug: "ostersund",
    primary_color: "#7546FF",
    secondary_color: "#F8FE22",
    footer_text: "Ett initiativ från Östersunds kommun. Gratis och öppet för alla.",
    domain: null,
  });
  console.log(`  ✓ Tenant: ${tenant.name} (${tenant.id})`);

  // --- Course 1: Lär dig använda AI ---
  console.log("\nCreating Course 1: Lär dig använda AI...");
  const course1 = await createItem("courses", {
    tenant_id: tenant.id,
    title: "Lär dig använda AI",
    slug: "anvanda-ai",
    description: "Lär dig grunderna i hur AI fungerar och hur du kan använda det i vardagen och på jobbet.",
    accent_color: "#7546FF",
    sort_order: 1,
  });

  // Module 1.1: Intro
  const m1_1 = await createItem("modules", {
    course_id: course1.id, title: "Välkommen", slug: "valkommen",
    description: "Introduktion till din AI-resa", sort_order: 1, estimated_minutes: 1,
  });
  await createItem("slides", {
    module_id: m1_1.id, sort_order: 1, type: "intro",
    heading: "VÄLKOMMEN TILL DIN AI-RESA",
    body_text: "Under de kommande minuterna kommer du att lära dig grunderna i hur du pratar med AI-chatbotar och hur du kan använda dem i din vardag.",
  });

  // Module 1.2: Vad är AI?
  const m1_2 = await createItem("modules", {
    course_id: course1.id, title: "Vad är AI?", slug: "vad-ar-ai",
    description: "Förstå grunderna", sort_order: 2, estimated_minutes: 3,
  });
  await createItem("slides", {
    module_id: m1_2.id, sort_order: 1, type: "info",
    heading: "VAD ÄR AI EGENTLIGEN?",
    body_text: "AI, eller artificiell intelligens, är inte magi — och det tänker inte som du och jag.\n\nDet är i grunden ett datorprogram som tränats på enorma mängder text och data. Tänk dig att du skriver ett meddelande och telefonen föreslår nästa ord — det är samma princip, fast mycket mer avancerat.\n\nSpråkmodeller som ChatGPT och Claude har läst miljarder texter. Men det betyder inte att de förstår. De är bra på att låta kunniga, men kan inte tänka, känna eller ha åsikter.",
  });
  const s1_2_quiz = await createItem("slides", {
    module_id: m1_2.id, sort_order: 2, type: "quiz",
    heading: "KAN AI GÖRA DETTA?",
    body_text: "Testa vad du har lärt dig!",
  });
  await createItem("quiz_options", { slide_id: s1_2_quiz.id, option_text: "Sammanfatta en lång text", is_correct: true, feedback_text: "Rätt! AI är utmärkt på att sammanfatta text.", sort_order: 1 });
  await createItem("quiz_options", { slide_id: s1_2_quiz.id, option_text: "Ge dig garanterat korrekta fakta", is_correct: false, feedback_text: "Nej — AI kan \"hallucinera\" och hitta på fakta som låter rimliga men är felaktiga. Verifiera alltid!", sort_order: 2 });
  await createItem("quiz_options", { slide_id: s1_2_quiz.id, option_text: "Hjälpa dig brainstorma idéer", is_correct: true, feedback_text: "Rätt! AI är en utmärkt brainstorming-partner.", sort_order: 3 });
  await createItem("quiz_options", { slide_id: s1_2_quiz.id, option_text: "Förstå dina känslor på riktigt", is_correct: false, feedback_text: "Nej — AI kan inte känna empati eller förstå känslor. Den simulerar förståelse baserat på mönster.", sort_order: 4 });

  // Module 1.3: Din första AI-chatt
  const m1_3 = await createItem("modules", {
    course_id: course1.id, title: "Din första AI-chatt", slug: "forsta-chatt",
    description: "Prova att prata med AI", sort_order: 3, estimated_minutes: 4,
  });
  await createItem("slides", {
    module_id: m1_3.id, sort_order: 1, type: "llm_chat",
    heading: "PROVA SJÄLV!",
    body_text: "Nu är det din tur att prata med en AI. Ställ en fråga om vad som helst!",
    llm_system_prompt: "Du är en vänlig AI-assistent som hjälper en nybörjare lära sig använda AI-chatbotar. Svara på svenska. Var uppmuntrande och pedagogisk. Håll svaren under 100 ord. Om användaren verkar osäker, föreslå saker de kan fråga om.",
    llm_instruction_text: "Skriv en fråga till AI:n — det kan vara vad som helst! Tips: prova att be om ett recept, hjälp med ett mejl, eller ställ en nyfiken fråga.",
    llm_max_messages: 8,
  });

  // Module 1.4: Konsten att fråga (promptning)
  const m1_4 = await createItem("modules", {
    course_id: course1.id, title: "Konsten att fråga", slug: "promptning",
    description: "Lär dig skriva bättre prompts", sort_order: 4, estimated_minutes: 3,
  });
  await createItem("slides", {
    module_id: m1_4.id, sort_order: 1, type: "info",
    heading: "SÅ SKRIVER DU BÄTTRE FRÅGOR",
    body_text: "Skillnaden mellan ett bra och dåligt svar från AI handlar ofta om hur du ställer frågan.\n\n❌ Dåligt: \"Skriv något om mat\"\n✅ Bra: \"Ge mig ett enkelt recept på pasta med bara 5 ingredienser, för en nybörjare\"\n\nFyra tips:\n1. Var specifik — berätta exakt vad du vill ha\n2. Ge kontext — \"jag är nybörjare\", \"det är till jobbet\"\n3. Ange format — \"som en punktlista\", \"i 3 meningar\"\n4. Iterera — om svaret inte är rätt, finjustera din fråga",
  });
  await createItem("slides", {
    module_id: m1_4.id, sort_order: 2, type: "llm_chat",
    heading: "ÖVNING: SKRIV BÄTTRE FRÅGOR",
    body_text: "Prova att använda tipsen ovan. Skriv en specifik, detaljerad fråga.",
    llm_system_prompt: "Du är en AI-assistent som hjälper användaren öva på att skriva bra prompts. Svara på svenska. När du svarar, ge också kort feedback på hur bra deras prompt var och ett tips på hur den kunde bli ännu bättre. Håll svaren under 120 ord.",
    llm_instruction_text: "Skriv en fråga och använd tipsen du just lärde dig. Prova att vara specifik, ge kontext och ange format!",
    llm_max_messages: 8,
  });

  // Module 1.5: Snabbkoll (quiz)
  const m1_5 = await createItem("modules", {
    course_id: course1.id, title: "Snabbkoll", slug: "snabbkoll",
    description: "Testa dina kunskaper", sort_order: 5, estimated_minutes: 2,
  });
  const s1_5_quiz = await createItem("slides", {
    module_id: m1_5.id, sort_order: 1, type: "quiz",
    heading: "SNABBKOLL",
    body_text: "Hur mycket har du lärt dig?",
  });
  await createItem("quiz_options", { slide_id: s1_5_quiz.id, option_text: "\"Skriv något\" — kort och vag", is_correct: false, feedback_text: "En vag prompt ger ofta ett vagt svar. Ju mer specifik du är, desto bättre svar får du.", sort_order: 1 });
  await createItem("quiz_options", { slide_id: s1_5_quiz.id, option_text: "\"Skriv ett mejl till min hyresvärd om att element inte fungerar, formellt och kort\" — specifik med kontext", is_correct: true, feedback_text: "Precis! Specifik, med kontext (hyresvärd, element) och format (formellt, kort). Det ger mycket bättre resultat.", sort_order: 2 });

  // Module 1.6: AI i vardagen
  const m1_6 = await createItem("modules", {
    course_id: course1.id, title: "AI i vardagen", slug: "vardagen",
    description: "Praktiska användningsfall", sort_order: 6, estimated_minutes: 3,
  });
  await createItem("slides", {
    module_id: m1_6.id, sort_order: 1, type: "info",
    heading: "AI I DIN VARDAG",
    body_text: "Här är fem sätt du kan använda AI redan idag:\n\n✍️ Skriva — Mejl, brev, ansökningar, inbjudningar\n📖 Förklara — Komplexa ämnen på enkelt språk\n📅 Planera — Resor, middagar, projekt, event\n💡 Idéer — Brainstorma presenter, aktiviteter, lösningar\n📚 Lära — Nya ämnen i din egen takt\n\nKom ihåg: AI är ett verktyg som du styr. Det ersätter inte ditt omdöme — det förstärker det.",
  });

  // Module 1.7: Tips att ta med (checklist)
  const m1_7 = await createItem("modules", {
    course_id: course1.id, title: "Tips att ta med", slug: "tips",
    description: "Spara denna lista", sort_order: 7, estimated_minutes: 2,
  });
  const s1_7_cl = await createItem("slides", {
    module_id: m1_7.id, sort_order: 1, type: "checklist",
    heading: "TIPS ATT TA MED DIG",
    body_text: "Spara dessa tips för att komma igång med AI i vardagen.",
  });
  await createItem("checklist_items", { slide_id: s1_7_cl.id, item_text: "Ladda ner en AI-app (ChatGPT, Claude eller Gemini)", sort_order: 1 });
  await createItem("checklist_items", { slide_id: s1_7_cl.id, item_text: "Prova att be AI:n sammanfatta en artikel du läser", sort_order: 2 });
  await createItem("checklist_items", { slide_id: s1_7_cl.id, item_text: "Skriv en specifik prompt med kontext och format", sort_order: 3 });
  await createItem("checklist_items", { slide_id: s1_7_cl.id, item_text: "Dubbelkolla alltid fakta som AI ger dig", sort_order: 4 });
  await createItem("checklist_items", { slide_id: s1_7_cl.id, item_text: "Dela aldrig känslig information (personnummer, lösenord)", sort_order: 5 });

  // Module 1.8: Lita inte blint
  const m1_8 = await createItem("modules", {
    course_id: course1.id, title: "Lita inte blint", slug: "lita-inte-blint",
    description: "Automation bias och kritiskt tänkande", sort_order: 8, estimated_minutes: 3,
  });
  await createItem("slides", {
    module_id: m1_8.id, sort_order: 1, type: "info",
    heading: "LITA INTE BLINT PÅ AI",
    body_text: "Forskning visar att ju mer vi använder AI, desto mer tenderar vi att okritiskt lita på svaren — det kallas \"automation bias\".\n\nAI kan:\n⚠️ Hallucinera — Hitta på fakta som låter helt rimliga\n⚠️ Vara partisk — Spegla fördomar från träningsdatan\n⚠️ Vara utdaterad — Inte veta om nyliga händelser\n\nDen viktigaste AI-kunskapen 2026 är att veta NÄR du INTE ska använda AI:\n• Juridiska beslut\n• Medicinsk rådgivning\n• Ekonomiska beslut med stora konsekvenser\n\nAI är ett verktyg — inte en auktoritet.",
  });

  // Module 1.9: Grattis (complete)
  const m1_9 = await createItem("modules", {
    course_id: course1.id, title: "Grattis!", slug: "klar",
    description: "Du har klarat kursen", sort_order: 9, estimated_minutes: 1,
  });
  await createItem("slides", {
    module_id: m1_9.id, sort_order: 1, type: "complete",
    heading: "GRATTIS! DU ÄR REDO",
    body_text: "Du har lärt dig grunderna i hur du pratar med AI-chatbotar och hur du kan använda dem för att göra vardagen enklare.",
  });

  console.log(`  ✓ Course 1: ${course1.title} — 9 modules`);

  // --- Course 2: Förstå risken med AI ---
  console.log("\nCreating Course 2: Förstå risken med AI...");
  const course2 = await createItem("courses", {
    tenant_id: tenant.id,
    title: "Förstå risken med AI",
    slug: "risken-med-ai",
    description: "Lär dig känna igen deepfakes, AI-bedrägerier och skydda dig och din familj.",
    accent_color: "#F8FE22",
    sort_order: 2,
  });

  // Module 2.1: Intro
  const m2_1 = await createItem("modules", {
    course_id: course2.id, title: "Välkommen", slug: "valkommen",
    description: "Lär dig skydda dig", sort_order: 1, estimated_minutes: 1,
  });
  await createItem("slides", {
    module_id: m2_1.id, sort_order: 1, type: "intro",
    heading: "LÄR DIG SKYDDA DIG",
    body_text: "Under de kommande minuterna kommer du att lära dig känna igen AI-baserade bedrägerier, deepfakes och hur du skyddar dig själv och din familj.",
  });

  // Module 2.2: AI-hot idag
  const m2_2 = await createItem("modules", {
    course_id: course2.id, title: "AI-hot idag", slug: "ai-hot",
    description: "Tre stora hot att känna till", sort_order: 2, estimated_minutes: 3,
  });
  await createItem("slides", {
    module_id: m2_2.id, sort_order: 1, type: "info",
    heading: "TRE AI-HOT DU BEHÖVER KÄNNA TILL",
    body_text: "🎭 Deepfakes — Falska bilder och videor som ser helt verkliga ut. AI kan skapa en video av vem som helst som säger vad som helst.\n\n📞 Röstbedrägerier — Det räcker med 3 sekunders inspelat ljud för att klona din röst. Bedragare ringer och låtsas vara familjemedlemmar.\n\n📧 AI-genererade bedrägerier — Perfekt formulerade phishing-mejl, falska webbshoppar och romance scams. AI gör bedrägerier svårare att upptäcka.\n\nUnder 2025 ökade AI-bedrägerier med över 1 200%.",
  });

  // Module 2.3: Deepfakes
  const m2_3 = await createItem("modules", {
    course_id: course2.id, title: "Vad är deepfakes?", slug: "deepfakes",
    description: "Så upptäcker du dem", sort_order: 3, estimated_minutes: 3,
  });
  await createItem("slides", {
    module_id: m2_3.id, sort_order: 1, type: "info",
    heading: "SÅ KÄNNER DU IGEN EN DEEPFAKE",
    body_text: "Deepfakes blir allt bättre, men det finns fortfarande tecken att leta efter:\n\n👁️ Onaturliga ögonrörelser — Blinkningar som ser konstiga ut eller ögon som inte riktigt fokuserar\n\n👄 Läppsynk som inte stämmer — Munrörelserna matchar inte riktigt orden\n\n💡 Konstig belysning — Ljuset på ansiktet matchar inte bakgrunden, skuggor som inte stämmer\n\n🔍 Suddiga kanter — Runt hårfästet, öron eller halsen kan bilden bli suddig eller flimmra\n\n⚠️ Kom ihåg: Var extra skeptisk till sensationellt videoinnehåll på sociala medier.",
  });

  // Module 2.4: Scenario — samtalet
  const m2_4 = await createItem("modules", {
    course_id: course2.id, title: "Scenario: Samtalet", slug: "scenario-samtal",
    description: "Ett realistiskt scenario", sort_order: 4, estimated_minutes: 3,
  });
  const s2_4_sc = await createItem("slides", {
    module_id: m2_4.id, sort_order: 1, type: "scenario",
    heading: "SCENARIO: SAMTALET",
    body_text: "Din telefon ringer. Det är din dotter — hon låter stressad.\n\n\"Mamma/pappa, jag har råkat hamna i en situation... Jag behöver att du överför 15 000 kr till mitt konto på Swedbank. Det är jättebråttom, jag förklarar sen!\"\n\nRösten låter precis som din dotter. Men du märker att hon säger \"Sweedbank\" istället för \"Swedbank\".",
  });
  await createItem("scenario_choices", { slide_id: s2_4_sc.id, choice_text: "Överför pengarna — det låter ju som henne och det verkar bråttom", is_correct: false, feedback_text: "Stopp! Även om rösten låter äkta kan den vara AI-genererad. Skicka aldrig pengar baserat på ett enda telefonsamtal, oavsett hur bråttom det verkar vara.", sort_order: 1 });
  await createItem("scenario_choices", { slide_id: s2_4_sc.id, choice_text: "Lägg på och ring tillbaka på hennes riktiga nummer", is_correct: true, feedback_text: "Helt rätt! Att lägga på och ringa tillbaka på ett nummer du vet är korrekt är det bästa sättet att verifiera. En äkta person förstår att du vill dubbelkolla.", sort_order: 2 });
  await createItem("scenario_choices", { slide_id: s2_4_sc.id, choice_text: "Fråga en hemlig fråga som bara hon kan svara på", is_correct: false, feedback_text: "Det är bättre än att skicka pengar direkt, men en AI med tillräckligt med information kan ibland gissa rätt. Det säkraste är att lägga på och ringa tillbaka.", sort_order: 3 });

  // Module 2.5: AI-bedrägerier
  const m2_5 = await createItem("modules", {
    course_id: course2.id, title: "AI-bedrägerier", slug: "bedragerier",
    description: "Vanliga AI-drivna bedrägerier", sort_order: 5, estimated_minutes: 3,
  });
  await createItem("slides", {
    module_id: m2_5.id, sort_order: 1, type: "info",
    heading: "VANLIGA AI-BEDRÄGERIER",
    body_text: "AI gör bedrägerier smartare. Här är de vanligaste:\n\n📧 Phishing-mejl — AI skriver perfekta mejl utan stavfel som ber dig klicka på en länk\n\n💕 Romance scams — AI-genererade profiler och konversationer på dejtingappar\n\n🛒 Falska webbshoppar — Hela webbsidor skapade av AI med falska recensioner\n\n👔 VD-bedrägerier — AI klonar en chefs röst och ringer med brådskande betalningskrav\n\nGemensamt: De spelar på brådska och känslor. \"Du måste agera NU!\" är alltid en varningssignal.",
  });

  // Module 2.6: Scenario — mejlet
  const m2_6 = await createItem("modules", {
    course_id: course2.id, title: "Scenario: Mejlet", slug: "scenario-mejl",
    description: "Kan du upptäcka bluffen?", sort_order: 6, estimated_minutes: 3,
  });
  const s2_6_sc = await createItem("slides", {
    module_id: m2_6.id, sort_order: 1, type: "scenario",
    heading: "SCENARIO: MEJLET",
    body_text: "Du får ett mejl:\n\nFrån: sakerhet@sweedbank-online.se\nÄmne: Viktigt: Ditt konto har spärrats\n\n\"Hej, vi har upptäckt misstänkt aktivitet på ditt konto. För din säkerhet har vi tillfälligt spärrat det. Klicka här för att verifiera din identitet och återaktivera ditt konto. Vänligen agera inom 24 timmar.\"\n\nMejlet ser professionellt ut med Swedbanks logotyp.",
  });
  await createItem("scenario_choices", { slide_id: s2_6_sc.id, choice_text: "Klicka på länken — det ser ju officiellt ut", is_correct: false, feedback_text: "Stopp! Domänen \"sweedbank-online.se\" är inte Swedbanks riktiga domän. Banker ber dig aldrig klicka på länkar i mejl för att \"verifiera\" dig.", sort_order: 1 });
  await createItem("scenario_choices", { slide_id: s2_6_sc.id, choice_text: "Logga in direkt i bankappen eller på bankens webbplats", is_correct: true, feedback_text: "Helt rätt! Gå alltid direkt till bankens egen app eller webbplats (inte via en länk i mejlet). Om det verkligen finns ett problem ser du det där.", sort_order: 2 });
  await createItem("scenario_choices", { slide_id: s2_6_sc.id, choice_text: "Svara på mejlet och fråga om det stämmer", is_correct: false, feedback_text: "Nej — genom att svara bekräftar du att din mejladress är aktiv, vilket kan leda till fler bluffmejl. Kontakta banken direkt via deras officiella kanaler.", sort_order: 3 });

  // Module 2.7: Snabbkoll
  const m2_7 = await createItem("modules", {
    course_id: course2.id, title: "Snabbkoll", slug: "snabbkoll",
    description: "Testa dina kunskaper", sort_order: 7, estimated_minutes: 2,
  });
  const s2_7_quiz = await createItem("slides", {
    module_id: m2_7.id, sort_order: 1, type: "quiz",
    heading: "SNABBKOLL: SKYDDA DIG",
    body_text: "Hur mycket har du lärt dig?",
  });
  await createItem("quiz_options", { slide_id: s2_7_quiz.id, option_text: "Lägga på och ringa tillbaka på ett känt nummer", is_correct: true, feedback_text: "Precis! Det säkraste är att alltid verifiera genom att kontakta personen via en kanal du vet är äkta.", sort_order: 1 });
  await createItem("quiz_options", { slide_id: s2_7_quiz.id, option_text: "Skicka pengarna och fråga sen", is_correct: false, feedback_text: "Aldrig! Verifiering först, alltid. En äkta familjemedlem förstår att du behöver dubbelkolla.", sort_order: 2 });
  await createItem("quiz_options", { slide_id: s2_7_quiz.id, option_text: "Fråga i chatten om det verkligen är de", is_correct: false, feedback_text: "En AI-klonad röst kan svara på frågor. Det säkraste är att lägga på och själv ringa ett nummer du vet stämmer.", sort_order: 3 });

  // Module 2.8: Skydda dig (checklist)
  const m2_8 = await createItem("modules", {
    course_id: course2.id, title: "Skydda dig", slug: "skydda-dig",
    description: "Konkreta steg att göra idag", sort_order: 8, estimated_minutes: 2,
  });
  const s2_8_cl = await createItem("slides", {
    module_id: m2_8.id, sort_order: 1, type: "checklist",
    heading: "SKYDDA DIG IDAG",
    body_text: "Gör dessa saker för att skydda dig och din familj mot AI-bedrägerier.",
  });
  await createItem("checklist_items", { slide_id: s2_8_cl.id, item_text: "Bestäm en hemlig kodfras med din familj", sort_order: 1 });
  await createItem("checklist_items", { slide_id: s2_8_cl.id, item_text: "Aktivera tvåfaktorsautentisering på alla viktiga konton", sort_order: 2 });
  await createItem("checklist_items", { slide_id: s2_8_cl.id, item_text: "Lär dig regeln: Lägg på → Ring tillbaka → Verifiera", sort_order: 3 });
  await createItem("checklist_items", { slide_id: s2_8_cl.id, item_text: "Var skeptisk mot \"brådskande\" meddelanden — ta 2 sekunder", sort_order: 4 });
  await createItem("checklist_items", { slide_id: s2_8_cl.id, item_text: "Prata med dina barn om deepfakes och nudify-appar", sort_order: 5 });
  await createItem("checklist_items", { slide_id: s2_8_cl.id, item_text: "Begränsa hur mycket av din röst/bild som finns publikt online", sort_order: 6 });

  // Module 2.9: Complete
  const m2_9 = await createItem("modules", {
    course_id: course2.id, title: "Du är redo!", slug: "klar",
    description: "Du har klarat kursen", sort_order: 9, estimated_minutes: 1,
  });
  await createItem("slides", {
    module_id: m2_9.id, sort_order: 1, type: "complete",
    heading: "BRA JOBBAT! DU ÄR FÖRBEREDD",
    body_text: "Du har lärt dig känna igen vanliga AI-bedrägerier och vet hur du skyddar dig och din familj.",
  });

  console.log(`  ✓ Course 2: ${course2.title} — 9 modules`);

  console.log("\n✅ Seeding complete!");
  console.log(`  Tenant: 1`);
  console.log(`  Courses: 2`);
  console.log(`  Modules: 18`);
  console.log(`  Slides: ~20`);
  console.log(`  Quiz options: ~9`);
  console.log(`  Scenario choices: 6`);
  console.log(`  Checklist items: 11`);
}

seed().catch(console.error);
