import { streamText, convertToModelMessages } from "ai";
import { exerciseModel, MAX_MESSAGES_DEFAULT, RATE_LIMIT } from "@/lib/ai";

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
    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: exerciseModel,
      system:
        systemPrompt ||
        "Du är en hjälpsam AI-assistent som hjälper användaren lära sig om AI. Svara på svenska. Håll svaren korta och pedagogiska.",
      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    const message = error instanceof Error ? error.message : "Okänt fel";
    return new Response(`Fel: ${message}`, { status: 500 });
  }
}
