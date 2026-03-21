import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import * as schema from "@/lib/schema";
import { eq, sql, count } from "drizzle-orm";
import Link from "next/link";
import { Users, CheckCircle2, Heart, BookOpen, ShieldCheck } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PublicOrgDashboard({ params }: Props) {
  const { slug } = await params;

  let org;
  try {
    const [found] = await db
      .select()
      .from(schema.organizations)
      .where(eq(schema.organizations.slug, slug))
      .limit(1);
    org = found;
  } catch {
    notFound();
  }

  if (!org) notFound();

  // Stats
  const [acceptedCount] = await db
    .select({ count: count() })
    .from(schema.invitations)
    .where(sql`${schema.invitations.orgId} = ${org.id} AND ${schema.invitations.status} = 'accepted'`);

  const [inviteCount] = await db
    .select({ count: count() })
    .from(schema.invitations)
    .where(eq(schema.invitations.orgId, org.id));

  const [completedUsers] = await db
    .select({ count: sql<number>`count(distinct ${schema.progress.userId})` })
    .from(schema.progress)
    .innerJoin(schema.users, eq(schema.progress.userId, schema.users.id))
    .where(eq(schema.users.orgId, org.id));

  const accepted = acceptedCount?.count || 0;
  const total = inviteCount?.count || 0;
  const completed = Number(completedUsers?.count) || 0;
  const donation = (accepted * (org.pricePerUser || 0)) / 100;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 py-6 text-center">
          <Link href="/" className="font-[family-name:var(--font-display)] text-sm uppercase text-muted-foreground tracking-widest mb-3 block">
            AI-kunskapen
          </Link>
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl uppercase tracking-[-0.03em] leading-[1.1]">
            {org.name}
          </h1>
          {org.industry && (
            <p className="text-muted-foreground mt-1">{org.industry}</p>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Progress overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="border border-border rounded-xl p-5 bg-card text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-3xl font-semibold tabular-nums">{accepted}</p>
            <p className="text-xs text-muted-foreground mt-1">Deltagare</p>
          </div>
          <div className="border border-border rounded-xl p-5 bg-card text-center">
            <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-3xl font-semibold tabular-nums">{completed}</p>
            <p className="text-xs text-muted-foreground mt-1">Slutfört</p>
          </div>
          <div className="border border-border rounded-xl p-5 bg-card text-center">
            <BookOpen className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-3xl font-semibold tabular-nums">{completionRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">Slutförande</p>
          </div>
          <div className="border border-border rounded-xl p-5 bg-card text-center">
            <Heart className="w-6 h-6 mx-auto mb-2 text-red-400" />
            <p className="text-3xl font-semibold tabular-nums">{donation.toLocaleString("sv-SE")}</p>
            <p className="text-xs text-muted-foreground mt-1">Bidrag (kr)</p>
          </div>
        </div>

        {/* Completion bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Framsteg</span>
            <span className="text-sm text-muted-foreground">{completed} av {total} anställda</span>
          </div>
          <div className="h-3 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${Math.min(completionRate, 100)}%` }}
            />
          </div>
        </div>

        {/* Charity info */}
        {org.charityName && donation > 0 && (
          <div className="rounded-xl bg-primary p-6 text-primary-foreground text-center">
            <Heart className="w-8 h-8 mx-auto mb-3 opacity-80" />
            <p className="text-lg font-semibold mb-1">
              {donation.toLocaleString("sv-SE")} kr till {org.charityName}
            </p>
            <p className="text-sm opacity-70">
              Tack vare att {accepted} anställda har gått kursen
            </p>
          </div>
        )}

        {/* Badge if 100% */}
        {completionRate >= 100 && (
          <div className="mt-8 rounded-xl border-2 border-primary p-8 text-center">
            <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-primary" />
            <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase mb-2">
              AI-redo arbetsplats 2026
            </h2>
            <p className="text-muted-foreground text-sm">
              Alla anställda har slutfört AI-kunskapen. {org.name} är en AI-redo arbetsplats.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
