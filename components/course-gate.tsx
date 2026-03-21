"use client"

import Link from "next/link"
import { ArrowRight, Building2, Mail, Users, CheckCircle2, BookOpen, Shield, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface CourseGateProps {
  courseType: "learn" | "safe"
}

export function CourseGate({ courseType }: CourseGateProps) {
  const isLearn = courseType === "learn"
  const courseTitle = isLearn ? "Lär dig använda AI" : "Förstå risken med AI"

  const handleShareWithBoss = () => {
    const subject = encodeURIComponent("AI-utbildning för vårt team — AI-kunskapen")
    const body = encodeURIComponent(
      `Hej!\n\nJag hittade en AI-utbildning som jag tror skulle passa vårt team. Den tar 20 minuter, är interaktiv, och bidraget går till välgörenhet.\n\nLäs mer här: ${window.location.origin}\n\nVad tror du?`
    )
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-[family-name:var(--font-display)] text-xl uppercase">
            AI-kunskapen
          </Link>
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Tillbaka
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-lg w-full text-center">
          {/* Course icon */}
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6",
            isLearn ? "bg-primary/10 text-primary" : "bg-accent/20 text-foreground"
          )}>
            {isLearn ? <BookOpen className="w-7 h-7" /> : <Shield className="w-7 h-7" />}
          </div>

          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl uppercase tracking-[-0.03em] mb-4 leading-[1.1]">
            {courseTitle}
          </h1>

          <p className="text-muted-foreground mb-10 max-w-sm mx-auto leading-relaxed">
            Den här kursen är en del av AI-kunskapen — en utbildningsplattform för företag.
            Ditt företag bjuder in dig via mejl med en personlig länk.
          </p>

          {/* How it works */}
          <div className="border border-border rounded-2xl p-6 mb-8 text-left bg-card">
            <h2 className="font-semibold text-sm mb-4 text-center">Så kommer du igång</h2>
            <div className="space-y-4">
              {[
                { icon: Building2, text: "Din arbetsgivare registrerar företaget på AI-kunskapen" },
                { icon: Mail, text: "Du får en inbjudan med en personlig länk via mejl" },
                { icon: CheckCircle2, text: "Du klickar länken och börjar kursen direkt — inga lösenord" },
              ].map((step, i) => {
                const Icon = step.icon
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed pt-1">{step.text}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleShareWithBoss}
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full font-medium bg-primary text-primary-foreground hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              <Send className="w-4 h-4" />
              Skicka till din chef
            </button>

            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full font-medium border border-border hover:bg-secondary transition-colors"
            >
              <Building2 className="w-4 h-4" />
              Jag är chef — kom igång
            </Link>

            <p className="text-[11px] text-muted-foreground pt-2">
              Redan registrerad?{" "}
              <Link href="/login" className="text-primary underline">Logga in</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
