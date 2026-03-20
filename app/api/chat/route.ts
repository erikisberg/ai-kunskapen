import { streamText, convertToModelMessages } from "ai";
import { exerciseModel, MAX_MESSAGES_DEFAULT, RATE_LIMIT } from "@/lib/ai";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return true;
  }

  if (entry.count >= RATE_LIMIT.maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

async function getOrgContext(): Promise<string> {
  try {
    const session = await auth();
    if (!session?.user?.id) return "";

    const { db } = await import("@/lib/db");
    const schema = await import("@/lib/schema");

    const [user] = await db
      .select({ orgId: schema.users.orgId })
      .from(schema.users)
      .where(eq(schema.users.id, session.user.id))
      .limit(1);

    if (!user?.orgId) return "";

    const [org] = await db
      .select({
        name: schema.organizations.name,
        industry: schema.organizations.industry,
        description: schema.organizations.description,
        employeeCount: schema.organizations.employeeCount,
        aiContext: schema.organizations.aiContext,
      })
      .from(schema.organizations)
      .where(eq(schema.organizations.id, user.orgId))
      .limit(1);

    if (!org) return "";

    const parts: string[] = [];
    parts.push(`Användaren jobbar på ${org.name}.`);
    if (org.industry) parts.push(`Bransch: ${org.industry}.`);
    if (org.description) parts.push(`Om företaget: ${org.description}`);
    if (org.employeeCount) parts.push(`Antal anställda: ca ${org.employeeCount}.`);
    if (org.aiContext) parts.push(org.aiContext);

    return parts.join(" ");
  } catch {
    return "";
  }
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (!checkRateLimit(ip)) {
    return new Response("För många förfrågningar. Försök igen om en stund.", {
      status: 429,
    });
  }

  const body = await req.json();
  const messages = body.messages;
  const systemPrompt = body.systemPrompt;
  const maxMessages = body.maxMessages || MAX_MESSAGES_DEFAULT;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response("Inga meddelanden skickade.", { status: 400 });
  }

  const userMessages = messages.filter((m: { role: string }) => m.role === "user");
  if (userMessages.length > maxMessages) {
    return new Response("Meddelandegränsen har nåtts.", { status: 400 });
  }

  try {
    const orgContext = await getOrgContext();
    const modelMessages = await convertToModelMessages(messages);

    const basePrompt =
      systemPrompt ||
      "Du är en hjälpsam AI-assistent som hjälper användaren lära sig om AI. Svara på svenska. Håll svaren korta och pedagogiska.";

    const fullPrompt = orgContext
      ? `${basePrompt}\n\nKontext om användarens arbetsplats: ${orgContext}\n\nAnpassa dina exempel och svar till denna bransch och organisation när det är relevant, men var inte påträngande med det.`
      : basePrompt;

    const result = streamText({
      model: exerciseModel,
      system: fullPrompt,
      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    const message = error instanceof Error ? error.message : "Okänt fel";
    return new Response(`Fel: ${message}`, { status: 500 });
  }
}
