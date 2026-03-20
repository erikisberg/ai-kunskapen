/**
 * Directus Re-seed Script — Research-based content update
 *
 * Deletes all existing content and repopulates with improved,
 * research-backed course material.
 *
 * Run: DIRECTUS_URL=... DIRECTUS_TOKEN=... npx tsx directus/reseed.ts
 */

const DIRECTUS_URL = process.env.DIRECTUS_URL || "https://directus-production-2883.up.railway.app";
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || "ai-kunskapen-static-token-2026";

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
  if (method === "DELETE") return null;
  return res.json();
}

async function createItem(collection: string, data: Record<string, unknown>) {
  const result = await api(`/items/${collection}`, "POST", data);
  return result.data;
}

async function deleteAll(collection: string) {
  const items = await api(`/items/${collection}?fields=id&limit=-1`);
  for (const item of items.data) {
    await api(`/items/${collection}/${item.id}`, "DELETE");
  }
}

async function seed() {
  console.log("🗑️  Clearing existing data...");
  // Delete in order (children first due to FK constraints)
  for (const col of ["checklist_items", "scenario_choices", "quiz_options", "slides", "modules", "courses", "tenants"]) {
    await deleteAll(col);
    console.log(`  Cleared ${col}`);
  }

  console.log("\n🌱 Seeding research-based content...\n");

  // --- Tenant ---
  const tenant = await createItem("tenants", {
    name: "AI-kunskapen",
    slug: "ai-kunskapen",
    primary_color: "#7546FF",
    secondary_color: "#F8FE22",
    footer_text: "Gratis och öppet för alla.",
    domain: null,
  });

  // ============================================================
  // COURSE 1: LÄR DIG ANVÄNDA AI
  // ============================================================
  console.log("📚 Kurs 1: Lär dig använda AI");
  const c1 = await createItem("courses", {
    tenant_id: tenant.id,
    title: "Lär dig använda AI",
    slug: "anvanda-ai",
    description: "Från din första prompt till vardagsanvändning — lär dig prata med AI på 20 minuter.",
    accent_color: "#7546FF",
    sort_order: 1,
  });

  // 1.1 Intro
  const m1_1 = await createItem("modules", { course_id: c1.id, title: "Välkommen", slug: "valkommen", description: "Din AI-resa börjar här", sort_order: 1, estimated_minutes: 1 });
  await createItem("slides", { module_id: m1_1.id, sort_order: 1, type: "intro", heading: "VÄLKOMMEN TILL DIN AI-RESA", body_text: "Under de kommande 20 minuterna lär du dig prata med AI-chatbotar, skriva bra frågor och använda AI som ett verktyg i vardagen. Ingen förkunskap krävs." });

  // 1.2 Vad är AI?
  const m1_2 = await createItem("modules", { course_id: c1.id, title: "Vad är AI?", slug: "vad-ar-ai", description: "Förstå grunderna", sort_order: 2, estimated_minutes: 3 });
  await createItem("slides", { module_id: m1_2.id, sort_order: 1, type: "info", heading: "VAD ÄR AI EGENTLIGEN?", body_text: "AI, eller artificiell intelligens, är inte magi — och det tänker inte som du och jag.\n\nDet är ett datorprogram som tränats på miljarder texter. Tänk dig att din telefon föreslår nästa ord när du skriver ett meddelande — det är samma princip, fast enormt mycket mer avancerat.\n\nÖver 900 miljoner människor använder AI-chatbotar varje vecka (2025). Men trots det förstår de flesta inte vad AI faktiskt gör.\n\nTre saker att komma ihåg:\n\n1. AI är ett verktyg — precis som en miniräknare eller sökmotor\n2. AI kan göra fel — det hittar på saker som låter övertygande (kallas \"hallucinationer\")\n3. AI ersätter inte ditt omdöme — det förstärker det" });
  await createItem("slides", { module_id: m1_2.id, sort_order: 2, type: "flow", heading: "HUR AI FUNGERAR", body_text: "Steg-för-steg: vad som händer när du ställer en fråga till en AI-chatbot." });
  const s1_2_quiz = await createItem("slides", { module_id: m1_2.id, sort_order: 3, type: "quiz", heading: "SANT ELLER FALSKT?", body_text: "Vilka av dessa påståenden stämmer om AI?" });
  await createItem("quiz_options", { slide_id: s1_2_quiz.id, option_text: "AI kan sammanfatta en lång text på sekunder", is_correct: true, feedback_text: "Rätt! Det är en av AI:s starkaste sidor — att destillera stora mängder text till det väsentliga.", sort_order: 1 });
  await createItem("quiz_options", { slide_id: s1_2_quiz.id, option_text: "AI ger alltid korrekta fakta", is_correct: false, feedback_text: "Fel! Även de bästa AI-modellerna hittar på fakta i 1-5% av svaren. Inom medicin kan felraten vara 23-53%. Verifiera alltid!", sort_order: 2 });
  await createItem("quiz_options", { slide_id: s1_2_quiz.id, option_text: "AI kan hjälpa dig brainstorma idéer", is_correct: true, feedback_text: "Rätt! AI är en utmärkt brainstorming-partner som kan ge dig dussintals idéer på sekunder.", sort_order: 3 });
  await createItem("quiz_options", { slide_id: s1_2_quiz.id, option_text: "AI förstår vad du känner", is_correct: false, feedback_text: "Fel! AI simulerar empati baserat på mönster i text, men den förstår inte känslor. Den kan låta omtänksam utan att vara det.", sort_order: 4 });

  // 1.3 Din första AI-chatt
  const m1_3 = await createItem("modules", { course_id: c1.id, title: "Din första AI-chatt", slug: "forsta-chatt", description: "Prova att prata med AI", sort_order: 3, estimated_minutes: 4 });
  await createItem("slides", { module_id: m1_3.id, sort_order: 1, type: "llm_chat", heading: "PROVA SJÄLV!", body_text: "Nu är det din tur. Ställ en fråga till AI:n — vad som helst!", llm_system_prompt: "Du är en vänlig AI-assistent som hjälper en nybörjare lära sig använda AI-chatbotar för första gången. Svara på svenska. Var uppmuntrande och pedagogisk. Håll svaren under 100 ord. Om användaren verkar osäker, föreslå konkreta saker de kan fråga om (recept, mejlhjälp, förklara ett begrepp). Avsluta gärna med en uppmaning att prova något nytt.", llm_instruction_text: "Skriv en fråga till AI:n — det kan vara vad som helst! Tips: be om ett recept, hjälp med ett mejl, eller ställ en nyfiken fråga.", llm_max_messages: 8 });

  // 1.4 Konsten att fråga (promptning)
  const m1_4 = await createItem("modules", { course_id: c1.id, title: "Konsten att fråga", slug: "promptning", description: "Skriv bättre prompts", sort_order: 4, estimated_minutes: 4 });
  await createItem("slides", { module_id: m1_4.id, sort_order: 1, type: "info", heading: "SÅ FÅR DU BÄTTRE SVAR", body_text: "Kvaliteten på AI:s svar beror helt på hur du frågar. Det kallas \"promptning\" och det är den viktigaste praktiska AI-kunskapen.\n\n❌ Dåligt: \"Skriv något om mat\"\n✅ Bra: \"Du är en erfaren kock. Ge mig ett vegetariskt recept på pasta med max 5 ingredienser, för en nybörjare. Skriv det som en steg-för-steg-guide.\"\n\nFem tekniker som fungerar:\n\n1. Ge AI en roll — \"Du är en erfaren...\"\n2. Var specifik — berätta exakt vad du vill ha\n3. Ge kontext — \"jag är nybörjare\", \"det är till jobbet\"\n4. Ange format — \"som en punktlista\", \"i 3 meningar\"\n5. Be AI tänka steg för steg — förbättrar svaren med 20-40%\n\nDet viktigaste: se det som en konversation. Om svaret inte stämmer, finjustera din fråga." });
  await createItem("slides", { module_id: m1_4.id, sort_order: 2, type: "llm_chat", heading: "ÖVNING: ROLLPROMPTING", body_text: "Prova att ge AI:n en roll och se hur svaret förändras.", llm_system_prompt: "Du anpassar dig helt efter den roll användaren ger dig. Om de säger 'du är en kock' — svara som en kock. Om de inte ger dig en roll, påminn dem vänligt om att testa. Svara på svenska. Håll svaren under 120 ord. Kommentera kort hur bra deras prompt var och ge ett tips.", llm_instruction_text: "Ge AI:n en roll och ställ en fråga. Prova: \"Du är en reseplanerare. Ge mig 3 tips för en weekend i Göteborg.\"", llm_max_messages: 8 });

  // 1.5 Snabbkoll
  const m1_5 = await createItem("modules", { course_id: c1.id, title: "Snabbkoll", slug: "snabbkoll", description: "Testa dina kunskaper", sort_order: 5, estimated_minutes: 2 });
  const s1_5q = await createItem("slides", { module_id: m1_5.id, sort_order: 1, type: "quiz", heading: "VILKEN PROMPT ÄR BÄST?", body_text: "Du vill ha hjälp att skriva ett mejl till din hyresvärd om ett trasigt element. Vilken prompt ger bäst resultat?" });
  await createItem("quiz_options", { slide_id: s1_5q.id, option_text: "\"Skriv ett mejl om mitt element\"", is_correct: false, feedback_text: "För vagt — AI vet inte vem mejlet är till, vad problemet är, eller vilken ton du vill ha.", sort_order: 1 });
  await createItem("quiz_options", { slide_id: s1_5q.id, option_text: "\"Skriv ett formellt mejl till min hyresvärd om att elementet i sovrummet inte fungerar. Nämn att det varit kallt i en vecka. Håll det kort och artigt.\"", is_correct: true, feedback_text: "Perfekt! Specifikt, med kontext (hyresvärd, sovrum, en vecka), format (formellt, kort) och ton (artigt). Ju mer detaljer, desto bättre svar.", sort_order: 2 });
  await createItem("quiz_options", { slide_id: s1_5q.id, option_text: "\"Hjälp mig\"", is_correct: false, feedback_text: "Alldeles för vagt. AI kan inte läsa dina tankar — den behöver veta vad du vill ha hjälp med.", sort_order: 3 });

  // 1.6 AI i vardagen
  const m1_6 = await createItem("modules", { course_id: c1.id, title: "AI i vardagen", slug: "vardagen", description: "Praktiska användningsfall", sort_order: 6, estimated_minutes: 3 });
  await createItem("slides", { module_id: m1_6.id, sort_order: 1, type: "info", heading: "SÅ ANVÄNDER DU AI IDAG", body_text: "30% av ChatGPT-användningen är jobbrelatedrad, 70% är privat. Här är de vanligaste användningsområdena:\n\n✍️ Skriva — Mejl, brev, ansökningar. \"Hjälp mig formulera ett artigt nej till en inbjudan.\"\n\n📖 Förklara — Komplexa ämnen på ditt språk. \"Förklara ränta-på-ränta som om jag vore 12 år.\"\n\n📅 Planera — Resor, middagar, projekt. \"Planera en veckomeny med budgetmåltider för en familj på 4.\"\n\n💡 Brainstorma — Idéer, lösningar, presenter. \"Ge mig 10 presentidéer till en 70-årig man som gillar trädgård.\"\n\n🌍 Översätta — Text och sammanhang. \"Översätt detta mejl till engelska och gör det mer formellt.\"\n\n📚 Lära — Nya ämnen i din takt. \"Lär mig grunderna i Excel med praktiska exempel.\"\n\nKom ihåg: AI är bäst som assistent, inte som auktoritet. Du styr — AI förstärker." });

  // 1.7 Lita inte blint
  const m1_7 = await createItem("modules", { course_id: c1.id, title: "Lita inte blint", slug: "lita-inte-blint", description: "Kritiskt tänkande med AI", sort_order: 7, estimated_minutes: 3 });
  await createItem("slides", { module_id: m1_7.id, sort_order: 1, type: "info", heading: "VARFÖR DU INTE KAN LITA BLINT PÅ AI", body_text: "Det här är kursens viktigaste modul.\n\nAI hallucinerar — det vill säga hittar på fakta som låter helt övertygande. De bästa modellerna har en felrate på 1-5% generellt, men inom specialområden är det mycket värre:\n\n⚠️ Medicinsk information: 23-53% felrate\n⚠️ Juridisk information: 6.4% felrate\n⚠️ AI hittar på referenser som inte existerar\n\nForskare har visat att ju mer vi använder AI, desto mer tenderar vi att okritiskt lita på svaren — det kallas \"automation bias\" eller \"kognitiv avlastning\".\n\nTre vanor att bygga:\n\n1. \"Lita men verifiera\" — kolla alltid fakta som AI ger dig\n2. \"Andra åsikten\" — fråga en annan AI eller sök själv\n3. \"Vem saknas?\" — AI speglar fördomar i träningsdatan\n\nDen viktigaste AI-kunskapen 2026: att veta NÄR du INTE ska använda AI." });
  await createItem("slides", { module_id: m1_7.id, sort_order: 2, type: "llm_chat", heading: "HITTA FELET!", body_text: "Be AI:n om fakta om ett ämne du kan — och försök hitta fel.", llm_system_prompt: "Du är en AI som MEDVETET blandar in ett subtilt fel i varje svar — en felaktig siffra, ett påhittat namn, eller ett faktafel. Svara på svenska. Skriv ungefär 80 ord. Avslöja INTE att du gjort ett fel — låt användaren hitta det. Om de hittar felet, berömm dem och förklara varför det är viktigt att alltid dubbelkolla. Om de inte hittar det, ge en ledtråd.", llm_instruction_text: "Be AI:n berätta fakta om något du kan — din hemstad, ett hobby-ämne, eller historia. Försök sedan hitta felet!", llm_max_messages: 6 });

  // 1.8 Integritet & rättigheter
  const m1_8 = await createItem("modules", { course_id: c1.id, title: "Integritet & rättigheter", slug: "integritet", description: "Skydda din data och känn till dina rättigheter", sort_order: 8, estimated_minutes: 3 });
  await createItem("slides", { module_id: m1_8.id, sort_order: 1, type: "info", heading: "VAD DU ALDRIG SKA DELA MED AI", body_text: "Allt du skriver till en AI-chatbot kan lagras och i vissa fall användas för att träna framtida modeller. Samsung fick förbjuda ChatGPT efter att anställda läckte företagshemligheter via chatten.\n\nDela ALDRIG:\n🚫 Personnummer eller ID-uppgifter\n🚫 Bankuppgifter eller lösenord\n🚫 Medicinsk information\n🚫 Konfidentiell jobbinformation\n🚫 Andras personuppgifter\n\nEU AI Act (gäller fullt från aug 2026) ger dig rätt att:\n✅ Veta när du interagerar med AI\n✅ Se märkning på AI-genererat innehåll\n✅ Vara skyddad mot manipulativ AI\n✅ Klaga till myndigheter vid överträdelser\n\nTips: Stäng av chatthistorik i inställningarna om du vill att dina konversationer inte sparas." });
  const s1_8cl = await createItem("slides", { module_id: m1_8.id, sort_order: 2, type: "checklist", heading: "GÖR DETTA IDAG", body_text: "Fem saker att göra för att komma igång säkert med AI." });
  await createItem("checklist_items", { slide_id: s1_8cl.id, item_text: "Ladda ner en AI-app (ChatGPT, Claude eller Gemini)", sort_order: 1 });
  await createItem("checklist_items", { slide_id: s1_8cl.id, item_text: "Kolla inställningarna — stäng av chatthistorik om du vill", sort_order: 2 });
  await createItem("checklist_items", { slide_id: s1_8cl.id, item_text: "Prova en rollprompt: \"Du är en erfaren [X]. Hjälp mig med [Y].\"", sort_order: 3 });
  await createItem("checklist_items", { slide_id: s1_8cl.id, item_text: "Dubbelkolla ett AI-svar genom att söka själv", sort_order: 4 });
  await createItem("checklist_items", { slide_id: s1_8cl.id, item_text: "Dela aldrig personnummer, lösenord eller känslig info med AI", sort_order: 5 });

  // 1.9 Klar!
  const m1_9 = await createItem("modules", { course_id: c1.id, title: "Grattis!", slug: "klar", description: "Du har klarat kursen", sort_order: 9, estimated_minutes: 1 });
  await createItem("slides", { module_id: m1_9.id, sort_order: 1, type: "complete", heading: "GRATTIS! DU ÄR REDO", body_text: "Du har lärt dig grunderna i hur du pratar med AI-chatbotar och hur du kan använda dem i vardagen. Kom ihåg: AI är ett verktyg som du styr." });

  console.log("  ✓ 9 moduler, ~15 slides\n");

  // ============================================================
  // COURSE 2: FÖRSTÅ RISKEN MED AI
  // ============================================================
  console.log("🛡️ Kurs 2: Förstå risken med AI");
  const c2 = await createItem("courses", {
    tenant_id: tenant.id,
    title: "Förstå risken med AI",
    slug: "risken-med-ai",
    description: "Lär dig känna igen deepfakes, röstbedrägerier och AI-scams — och skydda dig och din familj.",
    accent_color: "#F8FE22",
    sort_order: 2,
  });

  // 2.1 Intro
  const m2_1 = await createItem("modules", { course_id: c2.id, title: "Välkommen", slug: "valkommen", description: "Lär dig skydda dig", sort_order: 1, estimated_minutes: 1 });
  await createItem("slides", { module_id: m2_1.id, sort_order: 1, type: "intro", heading: "LÄR DIG SKYDDA DIG", body_text: "AI-bedrägerier ökade med 1 210% under 2025. Röster kan klonas på 3 sekunder. Phishing-mejl skrivs nu av AI. Under de kommande 20 minuterna lär du dig känna igen hoten — och skydda dig." });

  // 2.2 Hotbilden 2026
  const m2_2 = await createItem("modules", { course_id: c2.id, title: "AI-hot 2026", slug: "ai-hot", description: "Tre hot att känna till", sort_order: 2, estimated_minutes: 3 });
  await createItem("slides", { module_id: m2_2.id, sort_order: 1, type: "info", heading: "TRE HOT DU BEHÖVER KÄNNA TILL", body_text: "📞 Röstkloning — Det räcker med 3 sekunders ljud för att klona din röst. Röstbedrägerier ökade 442% under 2025 och har passerat tröskeln där människor inte kan skilja äkta från fejk.\n\n🎭 Deepfakes — Människor kan bara identifiera 24.5% av deepfake-videor. Antalet deepfakes online gick från 500 000 (2023) till 8 miljoner (2025).\n\n📧 AI-phishing — 82.6% av phishing-mejl skrivs nu av AI. De har 4 gånger högre klickrate än vanliga bluff-mejl. Det gamla rådet \"leta efter stavfel\" fungerar inte längre.\n\nI Sverige lurades konsumenter på 1.5 miljarder kronor i investeringsbedrägerier under 2025. Finansinspektionen varnade för 186 bedrägliga aktörer — jämfört med bara 12 året innan." });
  await createItem("slides", { module_id: m2_2.id, sort_order: 2, type: "flow", heading: "HUR ETT AI-BEDRÄGERI GÅR TILL", body_text: "Steg-för-steg: så fungerar ett typiskt röstbedrägeri." });

  // 2.3 Röstkloning
  const m2_3 = await createItem("modules", { course_id: c2.id, title: "Röstkloning", slug: "rostkloning", description: "Telefonbedrägerier med AI", sort_order: 3, estimated_minutes: 3 });
  await createItem("slides", { module_id: m2_3.id, sort_order: 1, type: "info", heading: "DIN RÖST KAN KLONAS PÅ 3 SEKUNDER", body_text: "AI-röstkloning har exploderat. Bedragare behöver bara ett kort ljudklipp — från ett telefonsamtal, en video på sociala medier, eller ett röstmeddelande.\n\nKlonen kopierar:\n• Intonation och rytm\n• Känslouttryck\n• Pauser och andning\n• Dialekt och tonläge\n\nBedragare ringer sedan och låtsas vara familjemedlemmar i nöd: \"Mamma, jag har blivit rånad, jag behöver pengar NU.\"\n\nResultat: Över 200 miljoner dollar i förluster bara under Q1 2025. Svenska polisen har dokumenterat fall med klonade VD-röster mot svenska företag." });
  const s2_3sc = await createItem("slides", { module_id: m2_3.id, sort_order: 2, type: "scenario", heading: "SCENARIO: SAMTALET", body_text: "Din telefon ringer. Det är din dotter — hon låter stressad och gråtfärdig.\n\n\"Mamma, jag har hamnat i en jättejobbig situation. Jag behöver att du överför 15 000 kr till mitt konto direkt. Det är verkligen bråttom, jag kan inte förklara just nu!\"\n\nRösten låter EXAKT som din dotter. Samma tonfall, samma sätt att prata." });
  await createItem("scenario_choices", { slide_id: s2_3sc.id, choice_text: "Överför pengarna — hon låter ju så stressad", outcome_text: "STOPP! Även om rösten låter äkta kan den vara AI-genererad från ett 3 sekunders klipp. Skicka aldrig pengar baserat på ett enda samtal, oavsett hur bråttom det verkar.", is_recommended: false, sort_order: 1 });
  await createItem("scenario_choices", { slide_id: s2_3sc.id, choice_text: "Lägg på och ring tillbaka på hennes riktiga nummer", outcome_text: "RÄTT! Ring tillbaka på numret du har sparat — inte numret som ringde. En äkta familjemedlem förstår att du vill dubbelkolla. Det är det enda sättet att verifiera.", is_recommended: true, sort_order: 2 });
  await createItem("scenario_choices", { slide_id: s2_3sc.id, choice_text: "Fråga efter familjekodfrasen", outcome_text: "Bra instinkt — men bara om ni faktiskt HAR en kodfras. Om inte, lägg på och ring tillbaka. En AI kan ibland gissa sig till svar baserat på information från sociala medier.", is_recommended: false, sort_order: 3 });

  // 2.4 Deepfakes
  const m2_4 = await createItem("modules", { course_id: c2.id, title: "Deepfakes", slug: "deepfakes", description: "Falskt video och bild", sort_order: 4, estimated_minutes: 3 });
  await createItem("slides", { module_id: m2_4.id, sort_order: 1, type: "info", heading: "NÄR DU INTE KAN LITA PÅ DINA ÖGON", body_text: "\"Seeing is believing\" gäller inte längre. AI kan skapa övertygande video av vem som helst som säger vad som helst.\n\nVarningstecken (men de blir allt svårare att se):\n👁️ Onaturliga ögonrörelser — konstiga blinkningar\n👄 Läppsynk som inte riktigt stämmer\n💡 Ljussättning som inte matchar bakgrunden\n🔍 Suddiga kanter runt hårfäste och hals\n✋ Händer med konstiga fingrar\n\n⚠️ MEN: Människor identifierar bara 24.5% av deepfakes korrekt. Lita inte på din förmåga att \"se\" skillnaden.\n\nIstället: Verifiera PREMISSEN, inte pixlarna.\n• Har trovärdiga nyhetsmedier rapporterat detta?\n• Går det att hitta originalkällan?\n• Är det för sensationellt för att vara sant?\n\nVerktyg: Google omvänd bildsökning, InVID, Google SynthID Detector." });

  // 2.5 AI-phishing
  const m2_5 = await createItem("modules", { course_id: c2.id, title: "AI-phishing", slug: "phishing", description: "Mejl och meddelanden", sort_order: 5, estimated_minutes: 3 });
  await createItem("slides", { module_id: m2_5.id, sort_order: 1, type: "info", heading: "PHISHING 2026: STAVFEL ÄR PASSÉ", body_text: "82.6% av phishing-mejl skrivs nu av AI. De är grammatiskt perfekta, personliga och övertygande — med 4x högre klickrate än gamla bluffmejl.\n\nNya varningssignaler:\n\n🔍 Avsändaradress — Kolla domänen! \"paypa1.com\" vs \"paypal.com\"\n⏰ Brådska — \"Agera INOM 24 TIMMAR\" är alltid misstänkt\n🎯 Övertydlig personalisering — Nämner ditt jobb, projekt eller kollegor\n🤝 Tillit-fraser — \"Som vi diskuterade...\" som känns påklistrade\n📎 Bilagor du inte bett om\n\nRegeln: Klicka ALDRIG på länkar i mejl som ber dig \"verifiera\" något. Gå direkt till tjänstens app eller webbplats istället." });
  const s2_5sc = await createItem("slides", { module_id: m2_5.id, sort_order: 2, type: "scenario", heading: "SCENARIO: MEJLET", body_text: "Du får ett mejl:\n\nFrån: sakerhet@sweedbank-online.se\nÄmne: Viktigt: Obehörig aktivitet på ditt konto\n\n\"Hej! Vi har upptäckt misstänkt aktivitet på ditt konto och har tillfälligt begränsat åtkomsten. Klicka på länken nedan för att verifiera din identitet och återställa åtkomsten.\n\nVerifiera mitt konto →\n\nVänligen agera inom 24 timmar för att undvika permanent spärrning.\"\n\nMejlet har Swedbanks logotyp och ser professionellt ut." });
  await createItem("scenario_choices", { slide_id: s2_5sc.id, choice_text: "Klicka på länken — det ser officiellt ut", outcome_text: "STOPP! Kolla avsändaren: \"sweedbank-online.se\" — dubbla e. Det är INTE Swedbanks riktiga domän. Banker ber dig aldrig klicka på länkar i mejl.", is_recommended: false, sort_order: 1 });
  await createItem("scenario_choices", { slide_id: s2_5sc.id, choice_text: "Öppna Swedbank-appen direkt och kolla mitt konto där", outcome_text: "RÄTT! Gå alltid direkt till bankens egen app eller webbplats. Om det verkligen finns ett problem, ser du det där. Aldrig via en länk i ett mejl.", is_recommended: true, sort_order: 2 });
  await createItem("scenario_choices", { slide_id: s2_5sc.id, choice_text: "Svara och fråga om det stämmer", outcome_text: "NEJ! Genom att svara bekräftar du att din mejladress är aktiv — det leder till fler bluffmejl. Kontakta banken direkt via deras officiella kanaler.", is_recommended: false, sort_order: 3 });

  // 2.6 Desinformation
  const m2_6 = await createItem("modules", { course_id: c2.id, title: "Desinformation", slug: "desinformation", description: "AI-propaganda och falska nyheter", sort_order: 6, estimated_minutes: 3 });
  await createItem("slides", { module_id: m2_6.id, sort_order: 1, type: "info", heading: "AI-PROPAGANDA OCH FALSKA NYHETER", body_text: "World Economic Forum rankar AI-driven desinformation som ett av de största kortsiktiga globala hoten 2026.\n\nAI möjliggör:\n• Massproduktion av falska nyhetsartiklar\n• Deepfake-videor av politiker och kändisar\n• Syntetiska sociala medie-profiler och bot-nätverk\n• Falska investeringsrekommendationer med kändis-deepfakes\n\nBara på Instagram orsakade deepfake-videor med falska kändisrekommendationer $450 miljoner i förluster.\n\nTre vanor för källkritik 2026:\n\n1. Lateral läsning — Sök vad ANDRA källor säger om påståendet\n2. Känslokoll — Innehåll designat att göra dig arg eller rädd är ofta manipulerat\n3. Officiella kanaler — Riktiga nyheter rapporteras av flera etablerade medier" });

  // 2.7 Snabbkoll
  const m2_7 = await createItem("modules", { course_id: c2.id, title: "Snabbkoll", slug: "snabbkoll", description: "Testa dina kunskaper", sort_order: 7, estimated_minutes: 2 });
  const s2_7q = await createItem("slides", { module_id: m2_7.id, sort_order: 1, type: "quiz", heading: "VAD GÖR DU?", body_text: "Någon som låter som din familjemedlem ringer och ber om pengar akut. Vad är det SÄKRASTE du kan göra?" });
  await createItem("quiz_options", { slide_id: s2_7q.id, option_text: "Lägg på och ring tillbaka på ett känt nummer", is_correct: true, feedback_text: "Rätt! Det enda sättet att verifiera identiteten. En äkta familjemedlem förstår att du vill dubbelkolla.", sort_order: 1 });
  await createItem("quiz_options", { slide_id: s2_7q.id, option_text: "Fråga personliga frågor i samtalet", is_correct: false, feedback_text: "En AI-klon kan ibland svara på personliga frågor baserat på information från sociala medier. Säkrast är att lägga på och ringa själv.", sort_order: 2 });
  await createItem("quiz_options", { slide_id: s2_7q.id, option_text: "Skicka hälften av beloppet och vänta", is_correct: false, feedback_text: "Nej — skicka ALDRIG pengar baserat på ett enda samtal. Verifiering först, alltid.", sort_order: 3 });

  // 2.8 Barn & AI
  const m2_8 = await createItem("modules", { course_id: c2.id, title: "Barn & AI", slug: "barn", description: "Skydda dina barn", sort_order: 8, estimated_minutes: 3 });
  await createItem("slides", { module_id: m2_8.id, sort_order: 1, type: "info", heading: "BARN, UNGA OCH AI-RISKER", body_text: "Det här är ett allvarligt kapitel. 70% av tonåringar använder AI-verktyg. Men hoten de möter är annorlunda.\n\n📱 Nudify-appar — 55% av tillfrågade tonåringar har använt AI för att skapa nakenbilder. 1 av 10 känner någon som gjort det MOT en klasskamrat. Det är olagligt.\n\n🔒 Sextortion — Bedragare skapar falska nakenbilder och hotar sprida dem om offret inte betalar. Rapporter ökade 70% på ett år.\n\n🎭 Deepfake-mobbning — AI-genererade bilder/videor av klasskamrater. Flickor 13-15 är mest utsatta (38%).\n\n🎣 Grooming — Bedragare använder AI för att analysera barns onlinebeteende och anpassa sin manipulationsstrategi.\n\nVad du kan göra:\n• Prata öppet med dina barn om AI-risker\n• Förklara att nudify-appar är olagliga\n• Lär dem: betala ALDRIG vid utpressning, berätta för en vuxen\n• Granska vilka appar dina barn använder\n• Ring BRIS 116 111 om du behöver stöd" });

  // 2.9 Skydda dig
  const m2_9 = await createItem("modules", { course_id: c2.id, title: "Skydda dig", slug: "skydda-dig", description: "Praktiska skyddssteg", sort_order: 9, estimated_minutes: 3 });
  const s2_9cl = await createItem("slides", { module_id: m2_9.id, sort_order: 1, type: "checklist", heading: "SKYDDA DIG OCH DIN FAMILJ", body_text: "Dessa åtgärder skyddar mot de vanligaste AI-hoten." });
  await createItem("checklist_items", { slide_id: s2_9cl.id, item_text: "Bestäm en hemlig kodfras med din familj — använd den vid misstänkta samtal", sort_order: 1 });
  await createItem("checklist_items", { slide_id: s2_9cl.id, item_text: "Aktivera tvåfaktorsautentisering med authenticator-app (INTE SMS — det är sårbart för SIM-kapning)", sort_order: 2 });
  await createItem("checklist_items", { slide_id: s2_9cl.id, item_text: "Lär dig regeln: Lägg på → Ring tillbaka → Verifiera", sort_order: 3 });
  await createItem("checklist_items", { slide_id: s2_9cl.id, item_text: "Installera en lösenordshanterare och använd unika lösenord överallt", sort_order: 4 });
  await createItem("checklist_items", { slide_id: s2_9cl.id, item_text: "Prata med dina barn om deepfakes och nudify-appar — öppet, inte skrämmande", sort_order: 5 });
  await createItem("checklist_items", { slide_id: s2_9cl.id, item_text: "Begränsa hur mycket av din röst/bild som finns publikt på sociala medier", sort_order: 6 });
  await createItem("checklist_items", { slide_id: s2_9cl.id, item_text: "10-sekundersregeln: pausa alltid innan du agerar på brådskande förfrågningar", sort_order: 7 });

  // 2.10 Rättigheter & anmälan
  const m2_10 = await createItem("modules", { course_id: c2.id, title: "Dina rättigheter", slug: "rattigheter", description: "Vart du vänder dig", sort_order: 10, estimated_minutes: 2 });
  await createItem("slides", { module_id: m2_10.id, sort_order: 1, type: "info", heading: "DINA RÄTTIGHETER OCH VART DU VÄNDER DIG", body_text: "EU AI Act ger dig rättigheter:\n✅ Rätt att veta när du interagerar med AI\n✅ AI-genererat innehåll ska vara märkt\n✅ Förbjudet med manipulativ AI, social poängsättning, och massövervakning\n\nVart du anmäler i Sverige:\n\n🚔 Polisen (polisen.se / 114 14) — Alla brott och bedrägerier\n💰 Finansinspektionen (fi.se) — Investeringsbedrägerier\n🔒 IMY (imy.se) — Integritetskränkningar och GDPR\n🛒 Konsumentverket — Vilseledande marknadsföring\n📞 BRIS 116 111 — Barn som behöver stöd\n🌐 Säkerhetskollen.se — Generell info om AI-bedrägerier\n\nBanker har egna rapporteringsvägar: Swedbank, Nordea och andra har dedikerade sidor för AI-bedrägerier." });

  // 2.11 Klar!
  const m2_11 = await createItem("modules", { course_id: c2.id, title: "Du är förberedd!", slug: "klar", description: "Du har klarat kursen", sort_order: 11, estimated_minutes: 1 });
  await createItem("slides", { module_id: m2_11.id, sort_order: 1, type: "complete", heading: "BRA JOBBAT! DU ÄR FÖRBEREDD", body_text: "Du har lärt dig känna igen AI-bedrägerier, deepfakes och röstkloning. Du vet hur du skyddar dig och var du vänder dig om något händer." });

  console.log("  ✓ 11 moduler, ~18 slides\n");

  console.log("✅ Re-seeding complete!");
  console.log("  Tenant: 1");
  console.log("  Courses: 2");
  console.log("  Modules: 20 (9 + 11)");
  console.log("  Slides: ~33");
}

seed().catch(console.error);
