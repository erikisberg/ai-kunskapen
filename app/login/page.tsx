"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Mail, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Suspense } from "react"

function LoginForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSending(true)

    await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    })

    setSent(true)
    setSending(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-md mx-auto px-6 py-4">
          <Link href="/" className="font-[family-name:var(--font-display)] text-xl uppercase">
            AI-kunskapen
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {sent ? (
            /* Success state */
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-7 h-7 text-green-500" />
              </div>
              <h1 className="font-[family-name:var(--font-display)] text-2xl uppercase mb-3">
                Kolla din mejl
              </h1>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Vi har skickat en inloggningslank till <strong className="text-foreground">{email}</strong>.
                Klicka pa lanken i mejlet for att logga in.
              </p>
              <p className="text-xs text-muted-foreground">
                Ingen mejl? Kolla skrappost eller{" "}
                <button
                  onClick={() => { setSent(false); setSending(false) }}
                  className="text-primary underline"
                >
                  forsok igen
                </button>
              </p>
            </div>
          ) : (
            /* Login form */
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
                <h1 className="font-[family-name:var(--font-display)] text-2xl uppercase mb-2">
                  Logga in
                </h1>
                <p className="text-muted-foreground text-sm">
                  Ange din mejladress sa skickar vi en inloggningslank.
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-600 text-sm mb-6">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error === "expired" ? "Lanken har gatt ut. Forsok igen." :
                   error === "not-found" ? "Inget konto hittades." :
                   "Ogiltig lank. Forsok igen."}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="din@mejl.se"
                  required
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-center"
                />

                <button
                  type="submit"
                  disabled={!email.includes("@") || sending}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all",
                    email.includes("@") && !sending
                      ? "bg-primary text-primary-foreground hover:scale-[1.03] active:scale-[0.98]"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  {sending ? "Skickar..." : "Skicka inloggningslank"}
                  {!sending && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              <p className="text-center text-xs text-muted-foreground mt-8">
                Inget konto? Din arbetsgivare bjuder in dig via mejl.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
