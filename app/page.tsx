"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, Shield, Clock, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-4 left-4 right-4 z-50">
        <div className="bg-card/80 backdrop-blur-md border border-border px-6 py-3 flex items-center justify-between rounded-full">
          <span className="font-[family-name:var(--font-display)] text-sm tracking-tight">AI-SKOLAN</span>
          <span className="text-sm text-muted-foreground">Ostersunds kommun</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center">
            {/* Main heading */}
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(3rem,15vw,10rem)] leading-[0.9] tracking-[-0.045em] uppercase mb-8">
              LAR DIG{" "}
              <span className="text-primary">AI</span>
              <br />
              TRYGGT & ENKELT
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed">
              AI forandrar var vardag. Har far du lara dig hur du anvander det 
              som ett verktyg och skyddar dig mot bedragare.
            </p>

            {/* CTA */}
            <Link 
              href="/journey"
              className="inline-block bg-foreground text-accent px-8 py-4 rounded-full font-[family-name:var(--font-display)] text-lg md:text-xl tracking-[-0.02em] uppercase hover:bg-foreground/90 transition-colors"
            >
              [ STARTA DIN RESA ]
            </Link>

            
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-px h-16 bg-foreground/20" />
        </div>
      </section>

      {/* Journey Selection */}
      <section id="journeys" className="py-24 md:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(2.5rem,8vw,5rem)] leading-[0.9] tracking-[-0.045em] uppercase text-center mb-4">
            VALJ DIN{" "}
            <span className="text-primary">VAG</span>
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-16 max-w-lg mx-auto">
            Tva korta resor med interaktiva ovningar. Borja med vilken du vill.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Learn Journey */}
            <Link href="/journey/learn" className="block">
              <div 
                className={cn(
                  "journey-card h-full p-8 md:p-10 border-2 border-foreground rounded-3xl",
                  hoveredCard === 'learn' ? 'bg-primary text-primary-foreground' : 'bg-card'
                )}
                onMouseEnter={() => setHoveredCard('learn')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={cn(
                  "w-14 h-14 flex items-center justify-center mb-8 border-2 rounded-xl",
                  hoveredCard === 'learn' ? 'border-primary-foreground' : 'border-foreground'
                )}>
                  <BookOpen className="w-7 h-7" />
                </div>
                
                <h3 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl tracking-[-0.045em] uppercase mb-4">
                  ANVAND AI I VARDAGEN
                </h3>
                
                <p className={cn(
                  "text-lg mb-8 leading-relaxed",
                  hoveredCard === 'learn' ? 'text-primary-foreground/80' : 'text-muted-foreground'
                )}>
                  Lar dig prata med AI-chatbotar, skriva bra fragor och fa hjalp med allt fran matlagning till jobbsokande.
                </p>

                <div className={cn(
                  "flex items-center gap-6 text-sm mb-8",
                  hoveredCard === 'learn' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                )}>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>ca 20 min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Praktiska ovningar</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg tracking-[-0.02em] uppercase">
                  <span>[ BORJA ]</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>

            {/* Safety Journey */}
            <Link href="/journey/safe" className="block">
              <div 
                className={cn(
                  "journey-card h-full p-8 md:p-10 border-2 border-foreground rounded-3xl",
                  hoveredCard === 'safe' ? 'bg-accent text-accent-foreground' : 'bg-card'
                )}
                onMouseEnter={() => setHoveredCard('safe')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={cn(
                  "w-14 h-14 flex items-center justify-center mb-8 border-2 rounded-xl",
                  hoveredCard === 'safe' ? 'border-accent-foreground' : 'border-foreground'
                )}>
                  <Shield className="w-7 h-7" />
                </div>
                
                <h3 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl tracking-[-0.045em] uppercase mb-4">
                  SKYDDA DIG MOT AI-HOT
                </h3>
                
                <p className={cn(
                  "text-lg mb-8 leading-relaxed",
                  hoveredCard === 'safe' ? 'text-accent-foreground/80' : 'text-muted-foreground'
                )}>
                  Lar dig kanna igen deepfakes, AI-genererade bedragarier och skydda dig sjalv och din familj.
                </p>

                <div className={cn(
                  "flex items-center gap-6 text-sm mb-8",
                  hoveredCard === 'safe' ? 'text-accent-foreground/70' : 'text-muted-foreground'
                )}>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>ca 20 min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Realistiska scenarion</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg tracking-[-0.02em] uppercase">
                  <span>[ BORJA ]</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features / Who is this for */}
      <section className="py-24 md:py-32 px-4 bg-secondary">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(2rem,6vw,4rem)] leading-[0.9] tracking-[-0.045em] uppercase mb-16">
            FOR <span className="text-primary">ALLA</span> I KOMMUNEN
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="border-t-2 border-foreground pt-6">
              <p className="font-[family-name:var(--font-display)] text-2xl tracking-[-0.045em] uppercase mb-3">
                PENSIONARER
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Lar dig anvanda AI-verktyg och skydda dig mot bedragare som ringer eller skickar meddelanden.
              </p>
            </div>

            <div className="border-t-2 border-foreground pt-6">
              <p className="font-[family-name:var(--font-display)] text-2xl tracking-[-0.045em] uppercase mb-3">
                FORALDRAR
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Forsta vad dina barn anvander och hur du kan hjalpa dem navigera AI sakert.
              </p>
            </div>

            <div className="border-t-2 border-foreground pt-6">
              <p className="font-[family-name:var(--font-display)] text-2xl tracking-[-0.045em] uppercase mb-3">
                ALLA ANDRA
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Oavsett alder eller erfarenhet. Ingen forkunskap kravs. Helt gratis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(2.5rem,8vw,5rem)] leading-[0.9] tracking-[-0.045em] uppercase mb-8">
            REDO ATT BORJA?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-12 max-w-lg mx-auto">
            Valj en av vara tva laresor och ta forsta steget mot en tryggare digital vardag.
          </p>
          <Link 
            href="/journey"
            className="inline-block bg-accent text-accent-foreground px-8 py-4 rounded-full font-[family-name:var(--font-display)] text-xl md:text-2xl tracking-[-0.02em] uppercase hover:bg-accent/90 transition-colors"
          >
            [ STARTA NU ]
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-foreground text-background">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-[family-name:var(--font-display)] text-sm tracking-tight">AI-SKOLAN</span>
          <p className="text-sm text-background/60 text-center">
            Ett initiativ fran Ostersunds kommun. Gratis och oppet for alla.
          </p>
          <span className="text-sm text-background/60">2026</span>
        </div>
      </footer>
    </div>
  )
}
