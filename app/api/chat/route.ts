import { streamText, convertToModelMessages } from "ai";
import { EXERCISE_MODEL, MAX_MESSAGES_DEFAULT, RATE_LIMIT } from "@/lib/ai";

// Simple in-memory rate limiter (per-instance, good enough for serverless)
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

  const { messages, systemPrompt, maxMessages } = await req.json();

  // Enforce message limit
  const limit = maxMessages || MAX_MESSAGES_DEFAULT;
  if (messages.length > limit * 2) {
    return new Response("Meddelandegränsen har nåtts.", { status: 400 });
  }

  const result = streamText({
    model: EXERCISE_MODEL as any,
    system: systemPrompt || "Du är en hjälpsam AI-assistent som hjälper användaren lära sig om AI. Svara på svenska. Håll svaren korta och pedagogiska.",
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
