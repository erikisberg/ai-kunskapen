"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, Shield, Clock, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Header — glass, modern */}
      <header className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-5xl mx-auto bg-card/60 backdrop-blur-xl border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] rounded-2xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-[11px]">Ai</span>
            </div>
            <span className="font-semibold text-sm tracking-tight">AI-kunskapen</span>
          </div>
          <Link
            href="#kurser"
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Välj kurs
          </Link>
        </div>
      </header>

      {/* Hero — calm, centered, unhurried */}
      <section className="min-h-[85vh] flex items-center justify-center px-6 pt-20">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-medium text-primary mb-6 tracking-wide uppercase">
            Gratis för alla
          </p>

          <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.5rem,8vw,4.5rem)] leading-[1.15] tracking-[-0.02em] uppercase mb-6">
            Förstå AI.<br />
            Använd AI.<br />
            <span className="text-primary">Skydda dig.</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed">
            Två korta kurser som ger dig praktisk AI-kunskap — från att skriva
            din första prompt till att genomskåda bedrägerier.
          </p>

          <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground mb-12">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>ca 20 min per kurs</span>
            </div>
            <span className="text-border">·</span>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>Ingen förkunskap krävs</span>
            </div>
          </div>

          <Link
            href="#kurser"
            className="inline-flex items-center gap-2 text-primary font-medium hover:opacity-80 transition-opacity"
          >
            Välj din kurs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Course selection — two calm doorways */}
      <section id="kurser" className="py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-medium text-muted-foreground mb-3 text-center uppercase tracking-wide">
            Två kurser
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-14 tracking-tight">
            Börja med vilken du vill
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Learn */}
            <Link href="/journey/learn" className="block group">
              <div
                className={cn(
                  "journey-card h-full rounded-xl border border-border bg-card p-8 md:p-9",
                  hoveredCard === "learn" && "border-primary/30"
                )}
                onMouseEnter={() => setHoveredCard("learn")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="w-11 h-11 rounded-lg bg-primary/8 flex items-center justify-center mb-6">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>

                <h3 className="text-xl font-semibold mb-2 tracking-tight">
                  Lär dig använda AI
                </h3>

                <p className="text-muted-foreground leading-relaxed mb-8">
                  Prata med AI-chatbotar, skriv bra frågor och få hjälp med allt
                  från matlagning till jobbsökande.
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      20 min
                    </span>
                    <span>9 steg</span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Starta
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Safe */}
            <Link href="/journey/safe" className="block group">
              <div
                className={cn(
                  "journey-card h-full rounded-xl border border-border bg-card p-8 md:p-9",
                  hoveredCard === "safe" && "border-accent/40"
                )}
                onMouseEnter={() => setHoveredCard("safe")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="w-11 h-11 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                  <Shield className="w-5 h-5 text-accent" />
                </div>

                <h3 className="text-xl font-semibold mb-2 tracking-tight">
                  Skydda dig mot AI-hot
                </h3>

                <p className="text-muted-foreground leading-relaxed mb-8">
                  Känn igen deepfakes, AI-bedrägerier och röstkloning. Lär dig
                  skydda dig själv och din familj.
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      20 min
                    </span>
                    <span>9 steg</span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    Starta
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Who is this for — quiet, editorial */}
      <section className="py-20 md:py-28 px-6 bg-secondary">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold mb-14 tracking-tight">
            För alla
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <p className="font-semibold mb-2">Pensionärer</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Lär dig använda AI-verktyg och skydda dig mot bedragare som
                ringer eller skickar meddelanden.
              </p>
            </div>

            <div>
              <p className="font-semibold mb-2">Föräldrar</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Förstå vad dina barn använder och hur du kan hjälpa dem navigera
                AI säkert.
              </p>
            </div>

            <div>
              <p className="font-semibold mb-2">Alla andra</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Oavsett ålder eller erfarenhet. Ingen förkunskap krävs. Helt
                gratis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer — minimal */}
      <footer className="py-10 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold text-[10px]">Ai</span>
            </div>
            <span className="text-sm font-medium">AI-kunskapen</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Gratis och öppet för alla · 2026
          </p>
        </div>
      </footer>
    </div>
  )
}
