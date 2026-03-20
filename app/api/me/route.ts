import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import * as schema from "@/lib/schema";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const [user] = await db
    .select({
      id: schema.users.id,
      email: schema.users.email,
      name: schema.users.name,
      role: schema.users.role,
      onboarded: schema.users.onboarded,
      orgId: schema.users.orgId,
    })
    .from(schema.users)
    .where(eq(schema.users.id, session.user.id))
    .limit(1);

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  let org = null;
  if (user.orgId) {
    const [orgData] = await db
      .select({
        id: schema.organizations.id,
        name: schema.organizations.name,
        slug: schema.organizations.slug,
        logoUrl: schema.organizations.logoUrl,
      })
      .from(schema.organizations)
      .where(eq(schema.organizations.id, user.orgId))
      .limit(1);
    org = orgData || null;
  }

  return NextResponse.json({ user, org });
}
