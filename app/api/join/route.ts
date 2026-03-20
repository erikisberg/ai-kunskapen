import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import * as schema from "@/lib/schema";
import { encode } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/?error=missing-token", req.url));
  }

  // 1. Find invitation by token
  const [invitation] = await db
    .select()
    .from(schema.invitations)
    .where(
      and(
        eq(schema.invitations.token, token),
        eq(schema.invitations.status, "pending")
      )
    )
    .limit(1);

  if (!invitation) {
    return NextResponse.redirect(new URL("/join/invalid", req.url));
  }

  // 2. Check expiry
  if (invitation.expiresAt < new Date()) {
    await db
      .update(schema.invitations)
      .set({ status: "expired" })
      .where(eq(schema.invitations.id, invitation.id));
    return NextResponse.redirect(new URL("/join/expired", req.url));
  }

  // 3. Find or create user
  let [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, invitation.email))
    .limit(1);

  if (!user) {
    const [newUser] = await db
      .insert(schema.users)
      .values({
        email: invitation.email,
        orgId: invitation.orgId,
        emailVerified: new Date(),
      })
      .returning();
    user = newUser;
  } else if (!user.orgId) {
    await db
      .update(schema.users)
      .set({ orgId: invitation.orgId })
      .where(eq(schema.users.id, user.id));
  }

  // 4. Mark invitation as accepted
  await db
    .update(schema.invitations)
    .set({ status: "accepted", acceptedAt: new Date() })
    .where(eq(schema.invitations.id, invitation.id));

  // 5. Create JWT session
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

  // 6. Set cookie and redirect
  const cookieStore = await cookies();
  cookieStore.set("authjs.session-token", jwtToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });

  const redirectUrl = user.onboarded ? "/dashboard" : "/onboarding";
  return NextResponse.redirect(new URL(redirectUrl, req.url));
}
