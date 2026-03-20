import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import * as schema from "@/lib/schema";
import { encode } from "next-auth/jwt";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function JoinPage({ params }: Props) {
  const { token } = await params;

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md mx-auto text-center px-6">
          <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase mb-4">
            Ogiltig eller redan anvand lank
          </h1>
          <p className="text-muted-foreground mb-6">
            Den har inbjudningslangen ar inte langre giltig. Den kan ha
            anvants redan eller gatt ut.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium"
          >
            Till startsidan
          </a>
        </div>
      </div>
    );
  }

  // 2. Check expiry
  if (invitation.expiresAt < new Date()) {
    await db
      .update(schema.invitations)
      .set({ status: "expired" })
      .where(eq(schema.invitations.id, invitation.id));

    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md mx-auto text-center px-6">
          <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase mb-4">
            Inbjudan har gatt ut
          </h1>
          <p className="text-muted-foreground mb-6">
            Den har inbjudan har lopt ut. Kontakta din arbetsgivare for att fa
            en ny.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium"
          >
            Till startsidan
          </a>
        </div>
      </div>
    );
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
    // Link existing user to org
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

  const cookieStore = await cookies();
  cookieStore.set("authjs.session-token", jwtToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  // 6. Redirect based on onboarding status
  if (user.onboarded) {
    redirect("/dashboard");
  } else {
    redirect("/onboarding");
  }
}
