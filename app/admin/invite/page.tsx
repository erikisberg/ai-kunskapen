import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import * as schema from "@/lib/schema";
import { InviteClient } from "./client";

export default async function InvitePage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/");

  const orgs = await db.select().from(schema.organizations);

  return (
    <InviteClient
      orgs={orgs.map((o) => ({ id: o.id, name: o.name, slug: o.slug }))}
    />
  );
}
