import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import * as schema from "@/lib/schema";
import { eq, sql, count } from "drizzle-orm";
import Link from "next/link";
import { ArrowLeft, Mail, Users, CheckCircle2, Building2, Send } from "lucide-react";
import { OrgInviteForm } from "./invite-form";
import { CopyLinkButton } from "./copy-link";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function OrgDetailPage({ params }: Props) {
  const admin = await requireAdmin();
  if (!admin) redirect("/");

  const { slug } = await params;

  const [org] = await db
    .select()
    .from(schema.organizations)
    .where(eq(schema.organizations.slug, slug))
    .limit(1);

  if (!org) redirect("/admin");

  // Stats
  const [inviteCount] = await db
    .select({ count: count() })
    .from(schema.invitations)
    .where(eq(schema.invitations.orgId, org.id));

  const [acceptedCount] = await db
    .select({ count: count() })
    .from(schema.invitations)
    .where(sql`${schema.invitations.orgId} = ${org.id} AND ${schema.invitations.status} = 'accepted'`);

  const [completedUsers] = await db
    .select({ count: sql<number>`count(distinct ${schema.progress.userId})` })
    .from(schema.progress)
    .innerJoin(schema.users, eq(schema.progress.userId, schema.users.id))
    .where(eq(schema.users.orgId, org.id));

  // All invitations with user + progress data
  const invitations = await db
    .select({
      id: schema.invitations.id,
      email: schema.invitations.email,
      status: schema.invitations.status,
      sentAt: schema.invitations.sentAt,
      acceptedAt: schema.invitations.acceptedAt,
      createdAt: schema.invitations.createdAt,
    })
    .from(schema.invitations)
    .where(eq(schema.invitations.orgId, org.id))
    .orderBy(schema.invitations.createdAt);

  // For each invitation, check if user exists and their progress
  const peopleData = await Promise.all(
    invitations.map(async (inv) => {
      const [user] = await db
        .select({ id: schema.users.id, name: schema.users.name, onboarded: schema.users.onboarded })
        .from(schema.users)
        .where(eq(schema.users.email, inv.email))
        .limit(1);

      let progressCount = 0;
      if (user) {
        const [pc] = await db
          .select({ count: count() })
          .from(schema.progress)
          .where(eq(schema.progress.userId, user.id));
        progressCount = pc?.count || 0;
      }

      // Determine status: inbjuden → påbörjat → slutfört
      let personStatus: "invited" | "started" | "completed" = "invited";
      if (user && progressCount > 0) {
        personStatus = progressCount >= 10 ? "completed" : "started"; // rough threshold
      } else if (inv.status === "accepted") {
        personStatus = "started";
      }

      return {
        ...inv,
        userName: user?.name,
        hasUser: !!user,
        onboarded: user?.onboarded || false,
        modulesCompleted: progressCount,
        personStatus,
      };
    })
  );

  const stats = {
    invitations: inviteCount?.count || 0,
    accepted: acceptedCount?.count || 0,
    completed: Number(completedUsers?.count) || 0,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link
            href="/admin"
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-semibold">{org.name}</h1>
            <p className="text-xs text-muted-foreground">
              {[org.industry, `${stats.accepted} användare`].filter(Boolean).join(" · ")}
            </p>
          </div>
          <CopyLinkButton slug={org.slug} />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Mail, label: "Inbjudna", value: stats.invitations, color: "primary" },
            { icon: Users, label: "Accepterat", value: stats.accepted, color: "primary" },
            { icon: CheckCircle2, label: "Slutfört kurs", value: stats.completed, color: "primary" },
            { icon: Building2, label: "Bidrag (kr)", value: ((stats.accepted * (org.pricePerUser || 0)) / 100).toLocaleString("sv-SE"), color: "accent" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="border border-border rounded-xl p-4 bg-card">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-${stat.color}/10 flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 text-${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold tabular-nums">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Org info */}
        {(org.description || org.industry) && (
          <div className="mb-10 p-4 rounded-xl bg-secondary/30 border border-border">
            <p className="text-sm text-muted-foreground mb-1">Om organisationen</p>
            <p className="text-sm">{org.description || `Bransch: ${org.industry}`}</p>
            {org.employeeCount && (
              <p className="text-xs text-muted-foreground mt-1">Ca {org.employeeCount} anställda</p>
            )}
          </div>
        )}

        {/* Invite section */}
        <div className="mb-10">
          <h2 className="font-[family-name:var(--font-display)] text-xl uppercase mb-4">
            Bjud in anställda
          </h2>
          <OrgInviteForm orgId={org.id} />
        </div>

        {/* People list */}
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl uppercase mb-4">
            Anställda ({peopleData.length})
          </h2>

          {peopleData.length === 0 ? (
            <p className="text-sm text-muted-foreground">Inga inbjudningar ännu.</p>
          ) : (
            <div className="border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Person</th>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Inbjudan</th>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Framsteg</th>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Moduler</th>
                  </tr>
                </thead>
                <tbody>
                  {peopleData.map((person) => (
                    <tr key={person.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                            person.personStatus === "completed"
                              ? "bg-green-500/10 text-green-600"
                              : person.personStatus === "started"
                                ? "bg-primary/10 text-primary"
                                : "bg-secondary text-muted-foreground"
                          }`}>
                            {person.userName?.[0]?.toUpperCase() || person.email[0].toUpperCase()}
                          </div>
                          <div>
                            {person.userName && (
                              <p className="font-medium text-sm">{person.userName}</p>
                            )}
                            <p className="font-mono text-xs text-muted-foreground">{person.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          person.status === "accepted"
                            ? "bg-green-500/10 text-green-600"
                            : person.status === "expired"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-amber-500/10 text-amber-600"
                        }`}>
                          {person.status === "accepted" ? "Accepterad" : person.status === "expired" ? "Utgången" : "Skickad"}
                        </span>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {person.createdAt.toLocaleDateString("sv-SE")}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {person.personStatus === "completed" ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Slutfört
                          </span>
                        ) : person.personStatus === "started" ? (
                          <span className="inline-flex items-center gap-1 text-xs text-primary">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            Påbörjat
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Ej påbörjat
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono tabular-nums">{person.modulesCompleted}</span>
                        <span className="text-xs text-muted-foreground ml-0.5">/ 20</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
