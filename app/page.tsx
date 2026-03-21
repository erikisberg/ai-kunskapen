"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, Shield, Clock, Sparkles, Users, Heart, Building2, CheckCircle2, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    fetch("/api/me").then(r => r.ok ? r.json() : null).then(d => {
      if (d?.user) setLoggedIn(true)
    }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-5xl mx-auto bg-card/60 backdrop-blur-xl border border-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] rounded-2xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-[11px]">Ai</span>
            </div>
            <span className="font-semibold text-sm tracking-tight">AI-kunskapen</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#kurser" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Kurser
            </Link>
            <Link href="#foretag" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              För företag
            </Link>
            {loggedIn ? (
              <Link href="/dashboard" className="text-xs font-medium bg-primary text-primary-foreground px-4 py-1.5 rounded-full hover:bg-primary/90 transition-colors">
                Min översikt
              </Link>
            ) : (
              <Link href="#foretag" className="text-xs font-medium bg-primary text-primary-foreground px-4 py-1.5 rounded-full hover:bg-primary/90 transition-colors">
                Kom igång
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-medium text-primary mb-8 tracking-wide uppercase">
            AI-utbildning för arbetsplatsen
          </p>

          <h1 className="font-[family-name:var(--font-display)] text-[clamp(3rem,12vw,8rem)] leading-[1.1] tracking-[-0.035em] uppercase mb-8">
            Gör ditt{" "}
            <span className="text-primary">team</span>
            <br />
            AI-redo
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto mb-12 leading-relaxed">
            Interaktiva kurser som lär dina anställda använda AI och skydda sig
            mot AI-bedrägerier. 20 minuter. Bidraget går till välgörenhet.
          </p>

          <Link
            href="#foretag"
            className="inline-flex items-center gap-2.5 bg-foreground text-background px-8 py-4 rounded-full font-[family-name:var(--font-display)] text-lg tracking-[-0.02em] uppercase hover:bg-foreground/90 transition-colors"
          >
            Utbilda ditt team
            <ArrowRight className="w-5 h-5" />
          </Link>

          <div className="mt-20">
            <div className="w-px h-12 bg-foreground/15 mx-auto" />
          </div>
        </div>
      </section>

      {/* Marquee */}
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

      {/* How it works — for companies */}
      <section id="foretag" className="py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(2rem,6vw,4rem)] leading-[1.1] tracking-[-0.03em] uppercase text-center mb-4">
            Så funkar <span className="text-primary">det</span>
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-16 max-w-lg mx-auto">
            Tre steg till en AI-redo arbetsplats. Ingen installation, inga lösenord.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Building2,
                title: "Du registrerar ditt företag",
                description: "Skapa en organisation, ladda upp anställdas mejladresser. Tar 2 minuter.",
              },
              {
                step: "02",
                icon: Users,
                title: "Anställda får en inbjudan",
                description: "Varje person får en unik länk via mejl. Ett klick — ingen registrering, inga lösenord.",
              },
              {
                step: "03",
                icon: BarChart3,
                title: "Du följer framstegen",
                description: "Se i realtid vem som påbörjat, slutfört och hur långt varje person kommit.",
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.step} className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-mono text-xs text-primary mb-2">{item.step}</p>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              )
            })}
          </div>

          {/* Charity pitch */}
          <div className="mt-16 p-8 rounded-2xl bg-primary text-primary-foreground text-center">
            <Heart className="w-8 h-8 mx-auto mb-4 opacity-80" />
            <h3 className="font-[family-name:var(--font-display)] text-2xl uppercase mb-3">
              200 kr per anställd. Allt går till välgörenhet.
            </h3>
            <p className="text-primary-foreground/70 max-w-md mx-auto">
              Inget vinstintresse. Bidraget går oavkortat till en välgörenhetsorganisation
              som ditt företag väljer. Ni får en AI-redo arbetsplats, samhället får stöd.
            </p>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="kurser" className="py-24 md:py-32 px-6 bg-secondary/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(2rem,6vw,4rem)] leading-[1.1] tracking-[-0.03em] uppercase text-center mb-4">
            Två <span className="text-primary">kurser</span>
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-16 max-w-md mx-auto">
            Interaktiva kurser med AI-chatt, quiz och realistiska scenarion.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/journey/learn" className="block">
              <div
                className={cn(
                  "journey-card h-full p-8 md:p-10 border border-border transition-colors duration-300 rounded-2xl",
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
                  hjälp med allt från matlagning till rapporter.
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

                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-current/20 font-medium text-sm">
                  Starta kurs
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            <Link href="/journey/safe" className="block">
              <div
                className={cn(
                  "journey-card h-full p-8 md:p-10 border border-border transition-colors duration-300 rounded-2xl",
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
                  själv och din familj mot nya hot.
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

                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-current/20 font-medium text-sm">
                  Starta kurs
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto mb-14">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(2rem,6vw,4rem)] leading-[1.1] tracking-[-0.03em] uppercase">
            Vad <span className="text-primary">deltagare</span> säger
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-primary text-primary-foreground p-8 md:p-10 rounded-2xl flex flex-col justify-between min-h-[340px]">
            <p className="font-[family-name:var(--font-display)] text-2xl md:text-3xl tracking-[-0.02em] uppercase leading-[1.15]">
              &ldquo;Vi körde kursen på hela kontoret. 45 av 52 slutförde på en vecka. Nu pratar alla om AI vid fikat.&rdquo;
            </p>
            <div className="mt-8">
              <p className="font-semibold">Lena</p>
              <p className="text-sm text-primary-foreground/60">HR-chef, medelstort företag</p>
            </div>
          </div>

          <div className="bg-accent text-accent-foreground p-8 rounded-2xl flex flex-col justify-between min-h-[340px]">
            <p className="font-[family-name:var(--font-display)] text-xl md:text-2xl tracking-[-0.02em] uppercase leading-[1.15]">
              &ldquo;Scenariot med röstkloning var en ögonöppnare. Nu har hela familjen en kodfras.&rdquo;
            </p>
            <div className="mt-8">
              <p className="font-semibold">Anders</p>
              <p className="text-sm text-accent-foreground/60">Anställd, 45 år</p>
            </div>
          </div>

          <div className="bg-card text-foreground border border-border p-8 rounded-2xl flex flex-col justify-between min-h-[280px]">
            <p className="font-[family-name:var(--font-display)] text-xl md:text-2xl tracking-[-0.02em] uppercase leading-[1.15]">
              &ldquo;20 minuter och ingen teknikjargong. Äntligen något jag kan skicka till mina kollegor utan att de stänger av efter 2 min.&rdquo;
            </p>
            <div className="mt-8">
              <p className="font-semibold">Fatima</p>
              <p className="text-sm text-muted-foreground">Teamledare</p>
            </div>
          </div>

          <div className="md:col-span-2 bg-foreground text-background p-8 md:p-10 rounded-2xl flex flex-col justify-between min-h-[280px]">
            <p className="font-[family-name:var(--font-display)] text-2xl md:text-3xl tracking-[-0.02em] uppercase leading-[1.15]">
              &ldquo;Det bästa? Vi bidrog med 10 000 kr till Kodcentrum samtidigt. Enklaste CSR-insatsen vi gjort.&rdquo;
            </p>
            <div className="mt-8">
              <p className="font-semibold">Marcus</p>
              <p className="text-sm text-background/50">VD, 30 anställda</p>
            </div>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-24 md:py-32 px-6 bg-secondary">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,5vw,3rem)] leading-[1.1] tracking-[-0.03em] uppercase mb-14">
            Vad ingår
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Interaktiva kurser",
                text: "Inte PowerPoints. AI-chatt, quiz, scenarion och checklistor som engagerar. Anpassade till er bransch.",
              },
              {
                title: "Företagsdashboard",
                text: "Se i realtid vilka som påbörjat, slutfört och hur långt varje anställd kommit. Delbar med ledningen.",
              },
              {
                title: "Välgörenhetsbidrag",
                text: "200 kr per anställd. Allt går till en välgörenhetsorganisation ni väljer. Ni får kvitto och kan kommunicera det internt.",
              },
            ].map((item) => (
              <div key={item.title} className="border-t border-foreground/15 pt-6">
                <p className="font-semibold text-lg mb-2">{item.title}</p>
                <p className="text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
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
                  q: "Vad kostar det?",
                  a: "200 kr per anställd som genomför kursen. Hela beloppet går till välgörenhet — vi tar inget. Ni betalar bara för de som faktiskt slutför.",
                },
                {
                  q: "Behöver mina anställda skapa konton?",
                  a: "Nej. De får en unik länk via mejl. Ett klick och de är inne — inga lösenord, ingen registrering.",
                },
                {
                  q: "Hur lång tid tar det?",
                  a: "Varje kurs tar ca 20 minuter. Anställda kan pausa och fortsätta senare. Allt sparas automatiskt.",
                },
                {
                  q: "Kan jag se vilka som slutfört?",
                  a: "Ja. Du får en dashboard med realtidsöversikt per person: vem som fått inbjudan, påbörjat och slutfört varje kurs.",
                },
                {
                  q: "Behöver vi installera något?",
                  a: "Nej. Allt körs i webbläsaren. Fungerar på mobil, surfplatta och dator.",
                },
                {
                  q: "Kan vi testa innan vi bokar?",
                  a: "Absolut. Kurserna är öppna att testa. Klicka 'Starta kurs' ovan och prova direkt.",
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

      {/* CTA */}
      <section className="py-24 md:py-32 px-6 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(2rem,6vw,4rem)] leading-[1.1] tracking-[-0.03em] uppercase mb-6">
            Redo att utbilda ert team?
          </h2>
          <p className="text-lg text-primary-foreground/70 mb-12 max-w-md mx-auto">
            Registrera ditt företag, ladda upp mejladresser, och dina anställda
            kan börja redan idag.
          </p>
          <Link
            href="/kontakt"
            className="inline-flex items-center gap-2.5 bg-accent text-accent-foreground px-8 py-4 rounded-full font-[family-name:var(--font-display)] text-lg tracking-[-0.02em] uppercase hover:bg-accent/90 transition-colors"
          >
            Kom igång
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
          <div className="flex items-center gap-6 text-xs text-background/50">
            <span>Bidraget går till välgörenhet</span>
            <span>2026</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
