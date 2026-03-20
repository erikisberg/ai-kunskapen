import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import * as schema from "@/lib/schema";
import { OnboardingClient } from "./client";

export default async function OnboardingPage() {
  let session;
  try {
    session = await auth();
  } catch {
    redirect("/");
  }

  if (!session?.user?.id) {
    redirect("/");
  }

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, session.user.id))
    .limit(1);

  if (!user) redirect("/");
  if (user.onboarded) redirect("/dashboard");

  let orgName = null;
  if (user.orgId) {
    const [org] = await db
      .select({ name: schema.organizations.name })
      .from(schema.organizations)
      .where(eq(schema.organizations.id, user.orgId))
      .limit(1);
    orgName = org?.name || null;
  }

  return (
    <OnboardingClient
      userName={user.name}
      orgName={orgName}
      userId={user.id}
    />
  );
}
