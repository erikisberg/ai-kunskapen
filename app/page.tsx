"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, Shield, Clock, Sparkles, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Header — glass, floating */}
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

      {/* Hero — bold display type, but warm */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-medium text-primary mb-8 tracking-wide uppercase">
            Gratis för alla
          </p>

          <h1 className="font-[family-name:var(--font-display)] text-[clamp(3rem,12vw,8rem)] leading-[1.1] tracking-[-0.035em] uppercase mb-8">
            Lär dig{" "}
            <span className="text-primary">AI</span>
            <br />
            tryggt & enkelt
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto mb-12 leading-relaxed">
            AI förändrar vår vardag. Här får du lära dig hur du använder det
            som ett verktyg — och skyddar dig mot bedragare.
          </p>

          <Link
            href="#kurser"
            className="inline-flex items-center gap-2.5 bg-foreground text-background px-8 py-4 rounded-full font-[family-name:var(--font-display)] text-lg tracking-[-0.02em] uppercase hover:bg-foreground/90 transition-colors"
          >
            Starta din resa
            <ArrowRight className="w-5 h-5" />
          </Link>

          {/* Scroll hint */}
          <div className="mt-20">
            <div className="w-px h-12 bg-foreground/15 mx-auto" />
          </div>
        </div>
      </section>

      {/* Marquee — continuous scroll of concepts */}
      <div className="overflow-hidden border-y border-border py-5 bg-secondary/50">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 mr-8">
              {[
                "PROMPTNING", "DEEPFAKES", "CHATBOTAR", "RÖSTKLONING",
                "KRITISKT TÄNKANDE", "AI-BEDRÄGERIER", "BILDGENERERING",
                "KÄLLKRITIK", "AUTOMATION BIAS", "FAMILJESÄKERHET",
                "EU AI ACT", "PHISHING"
              ].map((word) => (
                <span
                  key={`${i}-${word}`}
                  className="font-[family-name:var(--font-display)] text-xl md:text-2xl tracking-[-0.03em] text-foreground/10 uppercase"
                >
                  {word}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Course selection — bold cards with color-fill hover */}
      <section id="kurser" className="py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(2rem,6vw,4rem)] leading-[1.1] tracking-[-0.03em] uppercase text-center mb-4">
            Välj din{" "}
            <span className="text-primary">väg</span>
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-16 max-w-md mx-auto">
            Två korta resor med interaktiva övningar. Börja med vilken du vill.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Learn */}
            <Link href="/journey/learn" className="block">
              <div
                className={cn(
                  "journey-card h-full p-8 md:p-10 border border-border transition-colors duration-300",
                  hoveredCard === "learn"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card"
                )}
                onMouseEnter={() => setHoveredCard("learn")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={cn(
                  "w-12 h-12 flex items-center justify-center mb-7 rounded-xl border transition-colors",
                  hoveredCard === "learn" ? "border-primary-foreground/30" : "border-border"
                )}>
                  <BookOpen className="w-6 h-6" />
                </div>

                <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl tracking-[-0.03em] uppercase mb-3 leading-[1.1]">
                  Använd AI i vardagen
                </h3>

                <p className={cn(
                  "text-base mb-8 leading-relaxed",
                  hoveredCard === "learn" ? "text-primary-foreground/75" : "text-muted-foreground"
                )}>
                  Lär dig prata med AI-chatbotar, skriva bra frågor och få
                  hjälp med allt från matlagning till jobbsökande.
                </p>

                <div className={cn(
                  "flex items-center gap-5 text-sm mb-8",
                  hoveredCard === "learn" ? "text-primary-foreground/60" : "text-muted-foreground"
                )}>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>ca 20 min</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Praktiska övningar</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-[family-name:var(--font-display)] text-base tracking-[-0.02em] uppercase">
                  <span>[ Börja ]</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* Safe */}
            <Link href="/journey/safe" className="block">
              <div
                className={cn(
                  "journey-card h-full p-8 md:p-10 border border-border transition-colors duration-300",
                  hoveredCard === "safe"
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-card"
                )}
                onMouseEnter={() => setHoveredCard("safe")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={cn(
                  "w-12 h-12 flex items-center justify-center mb-7 rounded-xl border transition-colors",
                  hoveredCard === "safe" ? "border-accent-foreground/30" : "border-border"
                )}>
                  <Shield className="w-6 h-6" />
                </div>

                <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl tracking-[-0.03em] uppercase mb-3 leading-[1.1]">
                  Skydda dig mot AI-hot
                </h3>

                <p className={cn(
                  "text-base mb-8 leading-relaxed",
                  hoveredCard === "safe" ? "text-accent-foreground/75" : "text-muted-foreground"
                )}>
                  Lär dig känna igen deepfakes, AI-bedrägerier och skydda dig
                  själv och din familj.
                </p>

                <div className={cn(
                  "flex items-center gap-5 text-sm mb-8",
                  hoveredCard === "safe" ? "text-accent-foreground/60" : "text-muted-foreground"
                )}>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>ca 20 min</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Realistiska scenarion</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-[family-name:var(--font-display)] text-base tracking-[-0.02em] uppercase">
                  <span>[ Börja ]</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials — bold graphic grid */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto mb-14">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(2rem,6vw,4rem)] leading-[1.1] tracking-[-0.03em] uppercase">
            Vad <span className="text-primary">deltagare</span> säger
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Large feature quote */}
          <div className="md:col-span-2 bg-primary text-primary-foreground p-8 md:p-10 flex flex-col justify-between min-h-[340px]">
            <p className="font-[family-name:var(--font-display)] text-2xl md:text-3xl tracking-[-0.02em] uppercase leading-[1.15]">
              &ldquo;Jag har alltid varit skeptisk till AI, men efter kursen förstår jag äntligen hur det fungerar. Nu använder jag det dagligen.&rdquo;
            </p>
            <div className="mt-8">
              <p className="font-semibold">Margareta</p>
              <p className="text-sm text-primary-foreground/60">Pensionär, 72 år</p>
            </div>
          </div>

          {/* Small accent quote */}
          <div className="bg-accent text-accent-foreground p-8 flex flex-col justify-between min-h-[340px]">
            <p className="font-[family-name:var(--font-display)] text-xl md:text-2xl tracking-[-0.02em] uppercase leading-[1.15]">
              &ldquo;Scenariot med röstkloning var en ögonöppnare. Nu har hela familjen en kodfras.&rdquo;
            </p>
            <div className="mt-8">
              <p className="font-semibold">Anders</p>
              <p className="text-sm text-accent-foreground/60">Förälder, 45 år</p>
            </div>
          </div>

          {/* White card */}
          <div className="bg-card text-foreground border border-border p-8 flex flex-col justify-between min-h-[280px]">
            <p className="font-[family-name:var(--font-display)] text-xl md:text-2xl tracking-[-0.02em] uppercase leading-[1.15]">
              &ldquo;Äntligen en kurs som inte förutsätter att man kan programmera. Praktisk, kort och direkt användbar.&rdquo;
            </p>
            <div className="mt-8">
              <p className="font-semibold">Fatima</p>
              <p className="text-sm text-muted-foreground">Kommunanställd</p>
            </div>
          </div>

          {/* Dark card */}
          <div className="md:col-span-2 bg-foreground text-background p-8 md:p-10 flex flex-col justify-between min-h-[280px]">
            <p className="font-[family-name:var(--font-display)] text-2xl md:text-3xl tracking-[-0.02em] uppercase leading-[1.15]">
              &ldquo;Mina föräldrar gick kursen om bedrägerier och ringde mig samma kväll. De hade redan satt upp tvåfaktorsautentisering.&rdquo;
            </p>
            <div className="mt-8">
              <p className="font-semibold">Erik</p>
              <p className="text-sm text-background/50">Student, 26 år</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who is this for — editorial with top borders */}
      <section className="py-24 md:py-32 px-6 bg-secondary">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,5vw,3rem)] leading-[1.1] tracking-[-0.03em] uppercase mb-14">
            För <span className="text-primary">alla</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="border-t border-foreground/15 pt-6">
              <p className="font-semibold text-lg mb-2">Pensionärer</p>
              <p className="text-muted-foreground leading-relaxed">
                Lär dig använda AI-verktyg och skydda dig mot bedragare som
                ringer eller skickar meddelanden.
              </p>
            </div>

            <div className="border-t border-foreground/15 pt-6">
              <p className="font-semibold text-lg mb-2">Föräldrar</p>
              <p className="text-muted-foreground leading-relaxed">
                Förstå vad dina barn använder och hur du kan hjälpa dem
                navigera AI säkert.
              </p>
            </div>

            <div className="border-t border-foreground/15 pt-6">
              <p className="font-semibold text-lg mb-2">Alla andra</p>
              <p className="text-muted-foreground leading-relaxed">
                Oavsett ålder eller erfarenhet. Ingen förkunskap krävs. Helt
                gratis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — dark, editorial */}
      <section className="py-24 md:py-32 px-6 bg-foreground text-background">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-[1fr_2fr] gap-16">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,4vw,3rem)] leading-[1.1] tracking-[-0.03em] uppercase sticky top-24">
                Vanliga{" "}
                <span className="text-primary">frågor</span>
              </h2>
            </div>

            <div className="divide-y divide-background/10">
              {[
                {
                  q: "Behöver jag kunna något om AI innan?",
                  a: "Nej, kurserna är byggda för nybörjare. Vi börjar från grunden och förklarar allt på ett enkelt sätt. Du behöver bara en telefon eller dator.",
                },
                {
                  q: "Hur lång tid tar kurserna?",
                  a: "Varje kurs tar ungefär 20 minuter. Du kan pausa när du vill och fortsätta senare — det finns ingen tidsgräns.",
                },
                {
                  q: "Kostar det något?",
                  a: "Nej, kurserna är helt gratis. Inga dolda kostnader, ingen prenumeration, inget konto krävs.",
                },
                {
                  q: "Kan jag prova AI på riktigt i kursen?",
                  a: "Ja! I kursen \"Lär dig använda AI\" finns inbyggda chattövningar där du pratar med en riktig AI direkt i webbläsaren.",
                },
                {
                  q: "Vad lär jag mig i säkerhetskursen?",
                  a: "Du lär dig känna igen deepfakes, AI-genererade bluffmejl och röstkloning. Du får praktiska verktyg som familjekodfras och tvåfaktorsautentisering.",
                },
                {
                  q: "Kan jag dela kurserna med andra?",
                  a: "Absolut! Skicka länken till vem du vill. Kurserna är öppna för alla och kräver ingen inloggning.",
                },
              ].map((item, i) => (
                <div key={i} className="py-6 first:pt-0">
                  <h3 className="font-semibold text-lg mb-2">{item.q}</h3>
                  <p className="text-background/60 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA banner — purple */}
      <section className="py-24 md:py-32 px-6 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(2rem,6vw,4rem)] leading-[1.1] tracking-[-0.03em] uppercase mb-6">
            Redo att börja?
          </h2>
          <p className="text-lg text-primary-foreground/70 mb-12 max-w-md mx-auto">
            Välj en av kurserna och ta första steget mot en tryggare digital vardag.
          </p>
          <Link
            href="#kurser"
            className="inline-flex items-center gap-2.5 bg-accent text-accent-foreground px-8 py-4 rounded-full font-[family-name:var(--font-display)] text-lg tracking-[-0.02em] uppercase hover:bg-accent/90 transition-colors"
          >
            Starta nu
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-foreground text-background">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-background/10 flex items-center justify-center">
              <span className="text-background font-bold text-[10px]">Ai</span>
            </div>
            <span className="text-sm font-medium">AI-kunskapen</span>
          </div>
          <p className="text-xs text-background/50">
            Gratis och öppet för alla · 2026
          </p>
        </div>
      </footer>
    </div>
  )
}
