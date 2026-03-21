import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import * as schema from "@/lib/schema";
import { encode } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const email = req.nextUrl.searchParams.get("email");

  if (!token || !email) {
    return NextResponse.redirect(new URL("/login?error=invalid", req.url));
  }

  // Find token
  const [verification] = await db
    .select()
    .from(schema.verificationTokens)
    .where(
      and(
        eq(schema.verificationTokens.token, token),
        eq(schema.verificationTokens.identifier, email)
      )
    )
    .limit(1);

  if (!verification) {
    return NextResponse.redirect(new URL("/login?error=invalid", req.url));
  }

  // Check expiry
  if (verification.expires < new Date()) {
    // Clean up
    await db
      .delete(schema.verificationTokens)
      .where(eq(schema.verificationTokens.token, token));
    return NextResponse.redirect(new URL("/login?error=expired", req.url));
  }

  // Delete token (single use)
  await db
    .delete(schema.verificationTokens)
    .where(eq(schema.verificationTokens.token, token));

  // Find user
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);

  if (!user) {
    return NextResponse.redirect(new URL("/login?error=not-found", req.url));
  }

  // Create JWT session
  const jwtToken = await encode({
    token: {
      id: user.id,
      email: user.email,
      name: user.name,
      sub: user.id,
    },
    secret: process.env.AUTH_SECRET!,
    salt: "authjs.session-token",
  });

  const cookieStore = await cookies();
  cookieStore.set("authjs.session-token", jwtToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });

  return NextResponse.redirect(new URL("/dashboard", req.url));
}
