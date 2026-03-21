"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"

export function OrgInviteForm({ orgId }: { orgId: string }) {
  const router = useRouter()
  const [emails, setEmails] = useState("")
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ sent: number; errors: string[] } | null>(null)

  const emailList = emails
    .split(/[\n,;]/)
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.includes("@"))

  const handleSend = async () => {
    setSending(true)
    setResult(null)

    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId, emails: emailList }),
      })

      const data = await res.json()
      if (res.ok) {
        setResult({ sent: data.sent, errors: data.errors || [] })
        setEmails("")
        router.refresh()
      } else {
        setResult({ sent: 0, errors: [data.error || "Något gick fel"] })
      }
    } catch {
      setResult({ sent: 0, errors: ["Kunde inte kontakta servern"] })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="border border-border rounded-xl p-5 bg-card">
      <textarea
        value={emails}
        onChange={(e) => setEmails(e.target.value)}
        placeholder={"anna@foretag.se\nbob@foretag.se\ncarl@foretag.se"}
        rows={4}
        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground font-mono text-sm resize-y mb-3"
      />

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          En mejladress per rad.
          {emailList.length > 0 && (
            <span className="text-primary font-medium">
              {" "}{emailList.length} adress{emailList.length !== 1 ? "er" : ""}.
            </span>
          )}
        </p>

        <button
          onClick={handleSend}
          disabled={emailList.length === 0 || sending}
          className={cn(
            "inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all",
            emailList.length > 0 && !sending
              ? "bg-primary text-primary-foreground hover:scale-[1.03] active:scale-[0.98]"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {sending ? "Skickar..." : "Skicka inbjudningar"}
          {!sending && <Send className="w-3.5 h-3.5" />}
        </button>
      </div>

      {result && (
        <div className={cn(
          "mt-3 p-3 rounded-lg text-sm",
          result.sent > 0 ? "bg-green-500/10 text-green-700" : "bg-red-500/10 text-red-700"
        )}>
          {result.sent > 0 && <p className="font-medium">{result.sent} inbjudan{result.sent !== 1 ? "er" : ""} skickade!</p>}
          {result.errors.map((err, i) => <p key={i}>{err}</p>)}
        </div>
      )}
    </div>
  )
}
