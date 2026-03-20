import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import * as schema from "@/lib/schema";
import { eq, count, sql } from "drizzle-orm";
import Link from "next/link";
import { Users, Mail, CheckCircle2, Building2, Plus } from "lucide-react";

export default async function AdminPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/");

  // Get all orgs (or just admin's org)
  const orgs = await db.select().from(schema.organizations);

  // Get stats per org
  const orgStats = await Promise.all(
    orgs.map(async (org) => {
      const [userCount] = await db
        .select({ count: count() })
        .from(schema.users)
        .where(eq(schema.users.orgId, org.id));

      const [inviteCount] = await db
        .select({ count: count() })
        .from(schema.invitations)
        .where(eq(schema.invitations.orgId, org.id));

      const [acceptedCount] = await db
        .select({ count: count() })
        .from(schema.invitations)
        .where(
          sql`${schema.invitations.orgId} = ${org.id} AND ${schema.invitations.status} = 'accepted'`
        );

      const [completedUsers] = await db
        .select({ count: sql<number>`count(distinct ${schema.progress.userId})` })
        .from(schema.progress)
        .innerJoin(schema.users, eq(schema.progress.userId, schema.users.id))
        .where(eq(schema.users.orgId, org.id));

      return {
        ...org,
        users: userCount?.count || 0,
        invitations: inviteCount?.count || 0,
        accepted: acceptedCount?.count || 0,
        completed: Number(completedUsers?.count) || 0,
      };
    })
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-[family-name:var(--font-display)] text-xl uppercase">
              AI-kunskapen
            </Link>
            <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Admin
            </span>
          </div>
          <Link
            href="/admin/invite"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:scale-[1.03] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            Bjud in
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase tracking-[-0.03em] mb-8">
          Organisationer
        </h1>

        {orgs.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-xl">
            <Building2 className="w-10 h-10 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">
              Inga organisationer ännu
            </p>
            <Link
              href="/admin/invite"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium"
            >
              Skapa första organisationen
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orgStats.map((org) => (
              <div
                key={org.id}
                className="border border-border rounded-xl p-6 bg-card"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{org.name}</h2>
                    <p className="text-sm text-muted-foreground">{org.slug}</p>
                  </div>
                  {org.charityName && (
                    <span className="text-xs bg-accent/10 text-foreground px-2.5 py-1 rounded-full">
                      {org.charityName}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold tabular-nums">
                        {org.invitations}
                      </p>
                      <p className="text-xs text-muted-foreground">Inbjudna</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold tabular-nums">
                        {org.accepted}
                      </p>
                      <p className="text-xs text-muted-foreground">Accepterat</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold tabular-nums">
                        {org.completed}
                      </p>
                      <p className="text-xs text-muted-foreground">Slutfört</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <span className="text-sm font-mono">kr</span>
                    </div>
                    <div>
                      <p className="text-2xl font-semibold tabular-nums">
                        {((org.accepted * (org.pricePerUser || 0)) / 100).toLocaleString("sv-SE")}
                      </p>
                      <p className="text-xs text-muted-foreground">Bidrag (kr)</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
