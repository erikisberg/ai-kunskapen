"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Plus, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Org {
  id: string;
  name: string;
  slug: string;
}

export function InviteClient({ orgs }: { orgs: Org[] }) {
  const router = useRouter();
  const [selectedOrg, setSelectedOrg] = useState(orgs[0]?.id || "");
  const [emails, setEmails] = useState("");
  const [newOrgName, setNewOrgName] = useState("");
  const [showNewOrg, setShowNewOrg] = useState(orgs.length === 0);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{
    sent: number;
    errors: string[];
  } | null>(null);

  const emailList = emails
    .split(/[\n,;]/)
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.includes("@"));

  const handleSend = async () => {
    setSending(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgId: showNewOrg ? undefined : selectedOrg,
          newOrgName: showNewOrg ? newOrgName : undefined,
          emails: emailList,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult({ sent: data.sent, errors: data.errors || [] });
        setEmails("");
      } else {
        setResult({ sent: 0, errors: [data.error || "Något gick fel"] });
      }
    } catch {
      setResult({ sent: 0, errors: ["Kunde inte kontakta servern"] });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link
            href="/admin"
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="font-[family-name:var(--font-display)] text-xl uppercase">
            Bjud in
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        {/* Org selection */}
        <div className="mb-8">
          <label className="text-sm font-medium mb-2 block">Organisation</label>
          {!showNewOrg && orgs.length > 0 ? (
            <div className="space-y-2">
              <select
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground"
              >
                {orgs.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowNewOrg(true)}
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                Skapa ny organisation
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="Företagsnamn"
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>
              {orgs.length > 0 && (
                <button
                  onClick={() => setShowNewOrg(false)}
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Välj befintlig organisation istället
                </button>
              )}
            </div>
          )}
        </div>

        {/* Email input */}
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">
            Mejladresser
          </label>
          <textarea
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            placeholder={"anna@foretag.se\nbob@foretag.se\ncarl@foretag.se"}
            rows={8}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground font-mono text-sm resize-y"
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            En mejladress per rad, eller separera med komma.
            {emailList.length > 0 && (
              <span className="text-primary font-medium">
                {" "}
                {emailList.length} adress{emailList.length !== 1 ? "er" : ""} hittade.
              </span>
            )}
          </p>
        </div>

        {/* Result */}
        {result && (
          <div
            className={cn(
              "p-4 rounded-lg mb-6 text-sm",
              result.sent > 0
                ? "bg-green-500/10 text-green-700 dark:text-green-400"
                : "bg-red-500/10 text-red-700 dark:text-red-400"
            )}
          >
            {result.sent > 0 && (
              <p className="font-medium">
                {result.sent} inbjudan{result.sent !== 1 ? "ar" : ""} skickade!
              </p>
            )}
            {result.errors.map((err, i) => (
              <p key={i}>{err}</p>
            ))}
          </div>
        )}

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={
            emailList.length === 0 ||
            sending ||
            (showNewOrg && !newOrgName.trim())
          }
          className={cn(
            "inline-flex items-center gap-2 px-8 py-3 rounded-full font-medium transition-all",
            emailList.length > 0 && !sending
              ? "bg-primary text-primary-foreground hover:scale-[1.03] active:scale-[0.98]"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {sending ? "Skickar..." : "Skicka inbjudningar"}
          {!sending && <Send className="w-4 h-4" />}
        </button>
      </main>
    </div>
  );
}
