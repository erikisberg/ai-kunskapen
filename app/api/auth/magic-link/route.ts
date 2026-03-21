import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import * as schema from "@/lib/schema";
import { sendMagicLinkEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email?.trim()) {
    return NextResponse.json({ error: "Mejladress krävs" }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check if user exists
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, normalizedEmail))
    .limit(1);

  if (!user) {
    // Don't reveal if user exists or not — same response
    return NextResponse.json({ ok: true, message: "Om kontot finns skickas en inloggningslänk." });
  }

  // Create a magic token (reuse invitations table with a special marker)
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 min expiry

  // Store in verification_tokens table
  await db.insert(schema.verificationTokens).values({
    identifier: normalizedEmail,
    token,
    expires: expiresAt,
  });

  // TODO: Send via Resend. For now, log it.
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3001");
  const loginUrl = `${baseUrl}/api/auth/verify?token=${token}&email=${encodeURIComponent(normalizedEmail)}`;

  // Send email
  try {
    await sendMagicLinkEmail(normalizedEmail, loginUrl);
  } catch (err) {
    console.error("Magic link email failed:", err);
  }

  return NextResponse.json({ ok: true, message: "Om kontot finns skickas en inloggningslänk." });
}
