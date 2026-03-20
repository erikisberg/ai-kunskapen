import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import * as schema from "@/lib/schema";

function generateToken(): string {
  return randomBytes(32).toString("base64url");
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[åä]/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { orgId, newOrgName, emails } = body as {
    orgId?: string;
    newOrgName?: string;
    newOrgIndustry?: string;
    newOrgDescription?: string;
    newOrgEmployeeCount?: number;
    emails: string[];
  };

  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return NextResponse.json(
      { error: "Inga mejladresser angivna" },
      { status: 400 }
    );
  }

  if (emails.length > 500) {
    return NextResponse.json(
      { error: "Max 500 mejladresser per batch" },
      { status: 400 }
    );
  }

  // Resolve org
  let resolvedOrgId = orgId;

  if (!resolvedOrgId && newOrgName) {
    const slug = slugify(newOrgName);
    const [newOrg] = await db
      .insert(schema.organizations)
      .values({
        name: newOrgName.trim(),
        slug,
        industry: body.newOrgIndustry?.trim() || null,
        description: body.newOrgDescription?.trim() || null,
        employeeCount: body.newOrgEmployeeCount || null,
      })
      .returning();
    resolvedOrgId = newOrg.id;
  }

  if (!resolvedOrgId) {
    return NextResponse.json(
      { error: "Ingen organisation vald" },
      { status: 400 }
    );
  }

  // Create invitations
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

  const errors: string[] = [];
  let sent = 0;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  for (const email of emails) {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.includes("@")) {
      errors.push(`Ogiltig mejladress: ${email}`);
      continue;
    }

    try {
      const token = generateToken();

      await db.insert(schema.invitations).values({
        orgId: resolvedOrgId,
        email: normalizedEmail,
        token,
        expiresAt,
      });

      // TODO: Send email via Resend (Task 5)
      // For now, log the invite link
      const inviteUrl = `${baseUrl}/join/${token}`;
      console.log(`Invite: ${normalizedEmail} → ${inviteUrl}`);

      sent++;
    } catch (err) {
      errors.push(`Kunde inte skapa inbjudan för ${email}`);
    }
  }

  return NextResponse.json({ sent, errors, orgId: resolvedOrgId });
}
