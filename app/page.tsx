"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, useInView, useScroll, useTransform } from "motion/react"
import { ArrowRight, BookOpen, Shield, Clock, Sparkles, Users, Heart, Building2, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

// Scroll-triggered section wrapper
function FadeIn({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.23, 1, 0.32, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Staggered children
function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        visible: { transition: { staggerChildren: 0.12 } },
        hidden: {},
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function StaggerChild({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Animated counter
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let frame: number
    const duration = 1500
    const start = Date.now()
    const animate = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [isInView, target])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  useEffect(() => {
    fetch("/api/me").then(r => r.ok ? r.json() : null).then(d => {
      if (d?.user) setLoggedIn(true)
    }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <motion.header
        className="fixed top-4 left-4 right-4 z-50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
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
              <>
                <Link href="/login" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                  Logga in
                </Link>
                <Link href="/kontakt" className="text-xs font-medium bg-primary text-primary-foreground px-4 py-1.5 rounded-full hover:bg-primary/90 transition-colors">
                  Kom igång
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* Hero — parallax */}
      <section ref={heroRef} className="min-h-screen flex items-center justify-center px-6 pt-20 relative">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-sm font-medium text-primary mb-8 tracking-wide uppercase"
          >
            AI-utbildning för arbetsplatsen
          </motion.p>

          {/* Staggered word reveal */}
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(3rem,12vw,8rem)] leading-[1.1] tracking-[-0.035em] uppercase mb-8">
            {["Gör", "ditt"].map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                className="inline-block mr-[0.25em]"
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
              className="inline-block text-primary mr-[0.25em]"
            >
              team
            </motion.span>
            <br />
            <motion.span
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
              className="inline-block"
            >
              AI-redo
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto mb-12 leading-relaxed"
          >
            Interaktiva kurser som lär dina anställda använda AI och skydda sig
            mot AI-bedrägerier. 20 minuter. Bidraget går till välgörenhet.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.5, type: "spring", stiffness: 200 }}
          >
            <Link
              href="#foretag"
              className="inline-flex items-center gap-2.5 bg-foreground text-background px-8 py-4 rounded-full font-[family-name:var(--font-display)] text-lg tracking-[-0.02em] uppercase hover:bg-foreground/90 transition-colors hover:scale-[1.03] active:scale-[0.98]"
            >
              Utbilda ditt team
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

        </motion.div>

        {/* Scroll hint — outside parallax container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.svg
            width="24" height="24" viewBox="0 0 24 24" fill="none"
            className="text-foreground/20"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </motion.div>
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
                <span key={`${i}-${word}`} className="font-[family-name:var(--font-display)] text-xl md:text-2xl tracking-[-0.03em] text-foreground/10 uppercase">
                  {word}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section id="foretag" className="py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(2rem,6vw,4rem)] leading-[1.1] tracking-[-0.03em] uppercase text-center mb-4">
              Så funkar <span className="text-primary">det</span>
            </h2>
            <p className="text-center text-muted-foreground text-lg mb-16 max-w-lg mx-auto">
              Tre steg till en AI-redo arbetsplats. Ingen installation, inga lösenord.
            </p>
          </FadeIn>

          <Stagger className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: Building2, title: "Kontakta oss", description: "Berätta om ert företag och hur många anställda ni vill utbilda." },
              { step: "02", icon: Users, title: "Anställda får en inbjudan", description: "Varje person får en unik länk via mejl. Ett klick — ingen registrering." },
              { step: "03", icon: BarChart3, title: "Ni följer framstegen", description: "Se i realtid vem som påbörjat, slutfört och hur långt varje person kommit." },
            ].map((item) => {
              const Icon = item.icon
              return (
                <StaggerChild key={item.step} className="text-center">
                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <p className="font-mono text-xs text-primary mb-2">{item.step}</p>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </StaggerChild>
              )
            })}
          </Stagger>

          {/* Charity pitch with counter */}
          <FadeIn delay={0.3}>
            <div className="mt-16 p-8 rounded-2xl bg-primary text-primary-foreground text-center overflow-hidden relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"
                animate={{ opacity: [0, 0.1, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <Heart className="w-8 h-8 mx-auto mb-4 opacity-80 relative z-10" />
              <h3 className="font-[family-name:var(--font-display)] text-2xl uppercase mb-3 relative z-10">
                <Counter target={200} /> kr per anställd. Allt går till välgörenhet.
              </h3>
              <p className="text-primary-foreground/70 max-w-md mx-auto relative z-10">
                Inget vinstintresse. Bidraget går oavkortat till en välgörenhetsorganisation
                som ditt företag väljer. Ni får en AI-redo arbetsplats, samhället får stöd.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Courses */}
      <section id="kurser" className="py-24 md:py-32 px-6 bg-secondary/50">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(2rem,6vw,4rem)] leading-[1.1] tracking-[-0.03em] uppercase text-center mb-4">
              Två <span className="text-primary">kurser</span>
            </h2>
            <p className="text-center text-muted-foreground text-lg mb-16 max-w-md mx-auto">
              Interaktiva kurser med AI-chatt, quiz och realistiska scenarion.
            </p>
          </FadeIn>

          <Stagger className="grid md:grid-cols-2 gap-6">
            {[
              { type: "learn", href: "/journey/learn", icon: BookOpen, title: "Använd AI i vardagen", desc: "Lär dig prata med AI-chatbotar, skriva bra frågor och få hjälp med allt från matlagning till rapporter.", meta: "Praktiska övningar" },
              { type: "safe", href: "/journey/safe", icon: Shield, title: "Skydda dig mot AI-hot", desc: "Lär dig känna igen deepfakes, AI-bedrägerier och skydda dig själv och din familj mot nya hot.", meta: "Realistiska scenarion" },
            ].map((course) => {
              const Icon = course.icon
              const isHovered = hoveredCard === course.type
              return (
                <StaggerChild key={course.type}>
                  <Link href={course.href} className="block">
                    <motion.div
                      className={cn(
                        "journey-card h-full p-8 md:p-10 border border-border transition-colors duration-300 rounded-2xl",
                        isHovered && course.type === "learn" && "bg-primary text-primary-foreground border-primary",
                        isHovered && course.type === "safe" && "bg-accent text-accent-foreground border-accent",
                        !isHovered && "bg-card"
                      )}
                      onMouseEnter={() => setHoveredCard(course.type)}
                      onMouseLeave={() => setHoveredCard(null)}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className={cn(
                        "w-12 h-12 flex items-center justify-center mb-7 rounded-xl border transition-colors",
                        isHovered ? "border-current/20" : "border-border"
                      )}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl tracking-[-0.03em] uppercase mb-3 leading-[1.1]">
                        {course.title}
                      </h3>
                      <p className={cn("text-base mb-8 leading-relaxed", isHovered ? "opacity-75" : "text-muted-foreground")}>
                        {course.desc}
                      </p>
                      <div className={cn("flex items-center gap-5 text-sm mb-8", isHovered ? "opacity-60" : "text-muted-foreground")}>
                        <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /><span>ca 20 min</span></div>
                        <div className="flex items-center gap-1.5"><Sparkles className="w-4 h-4" /><span>{course.meta}</span></div>
                      </div>
                      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-current/20 font-medium text-sm">
                        Starta kurs <ArrowRight className="w-4 h-4" />
                      </div>
                    </motion.div>
                  </Link>
                </StaggerChild>
              )
            })}
          </Stagger>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="mb-14">
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(2rem,6vw,4rem)] leading-[1.1] tracking-[-0.03em] uppercase">
              Vad <span className="text-primary">deltagare</span> säger
            </h2>
          </FadeIn>

          <Stagger className="grid md:grid-cols-3 gap-4">
            {[
              { span: 2, bg: "bg-primary text-primary-foreground", text: "Vi körde kursen på hela kontoret. 45 av 52 slutförde på en vecka. Nu pratar alla om AI vid fikat.", name: "Lena", role: "HR-chef, medelstort företag", size: "text-2xl md:text-3xl", h: "min-h-[340px]" },
              { span: 1, bg: "bg-accent text-accent-foreground", text: "Scenariot med röstkloning var en ögonöppnare. Nu har hela familjen en kodfras.", name: "Anders", role: "Anställd, 45 år", size: "text-xl md:text-2xl", h: "min-h-[340px]" },
              { span: 1, bg: "bg-card text-foreground border border-border", text: "20 minuter och ingen teknikjargong. Äntligen något jag kan skicka till mina kollegor.", name: "Fatima", role: "Teamledare", size: "text-xl md:text-2xl", h: "min-h-[280px]" },
              { span: 2, bg: "bg-foreground text-background", text: "Det bästa? Vi bidrog med 10 000 kr till Kodcentrum samtidigt. Enklaste CSR-insatsen vi gjort.", name: "Marcus", role: "VD, 30 anställda", size: "text-2xl md:text-3xl", h: "min-h-[280px]" },
            ].map((q, i) => (
              <StaggerChild key={i} className={q.span === 2 ? "md:col-span-2" : ""}>
                <motion.div
                  className={cn("p-8 md:p-10 rounded-2xl flex flex-col justify-between", q.bg, q.h)}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className={cn("font-[family-name:var(--font-display)] tracking-[-0.02em] uppercase leading-[1.15]", q.size)}>
                    &ldquo;{q.text}&rdquo;
                  </p>
                  <div className="mt-8">
                    <p className="font-semibold">{q.name}</p>
                    <p className="text-sm opacity-60">{q.role}</p>
                  </div>
                </motion.div>
              </StaggerChild>
            ))}
          </Stagger>
        </div>
      </section>

      {/* What's included */}
      <section className="py-24 md:py-32 px-6 bg-secondary">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,5vw,3rem)] leading-[1.1] tracking-[-0.03em] uppercase mb-14">
              Vad ingår
            </h2>
          </FadeIn>

          <Stagger className="grid md:grid-cols-3 gap-10">
            {[
              { title: "Interaktiva kurser", text: "Inte PowerPoints. AI-chatt, quiz, scenarion och checklistor som engagerar. Anpassade till er bransch." },
              { title: "Företagsdashboard", text: "Se i realtid vilka som påbörjat, slutfört och hur långt varje anställd kommit. Delbar med ledningen." },
              { title: "Välgörenhetsbidrag", text: "200 kr per anställd. Allt går till en välgörenhetsorganisation ni väljer. Ni får kvitto och kan kommunicera det internt." },
            ].map((item) => (
              <StaggerChild key={item.title} className="border-t border-foreground/15 pt-6">
                <p className="font-semibold text-lg mb-2">{item.title}</p>
                <p className="text-muted-foreground leading-relaxed">{item.text}</p>
              </StaggerChild>
            ))}
          </Stagger>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32 px-6 bg-foreground text-background">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-[1fr_2fr] gap-16">
            <FadeIn>
              <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,4vw,3rem)] leading-[1.1] tracking-[-0.03em] uppercase sticky top-24">
                Vanliga <span className="text-primary">frågor</span>
              </h2>
            </FadeIn>

            <Stagger className="divide-y divide-background/10">
              {[
                { q: "Vad kostar det?", a: "200 kr per anställd som genomför kursen. Hela beloppet går till välgörenhet — vi tar inget." },
                { q: "Behöver mina anställda skapa konton?", a: "Nej. De får en unik länk via mejl. Ett klick och de är inne — inga lösenord." },
                { q: "Hur lång tid tar det?", a: "Varje kurs tar ca 20 minuter. Anställda kan pausa och fortsätta senare." },
                { q: "Kan jag se vilka som slutfört?", a: "Ja. Ni får en dashboard med realtidsöversikt per person." },
                { q: "Behöver vi installera något?", a: "Nej. Allt körs i webbläsaren. Fungerar på mobil, surfplatta och dator." },
              ].map((item, i) => (
                <StaggerChild key={i} className="py-6 first:pt-0">
                  <h3 className="font-semibold text-lg mb-2">{item.q}</h3>
                  <p className="text-background/60 leading-relaxed">{item.a}</p>
                </StaggerChild>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 px-6 bg-primary text-primary-foreground">
        <FadeIn className="max-w-3xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(2rem,6vw,4rem)] leading-[1.1] tracking-[-0.03em] uppercase mb-6">
            Redo att utbilda ert team?
          </h2>
          <p className="text-lg text-primary-foreground/70 mb-12 max-w-md mx-auto">
            Kontakta oss så hjälper vi er komma igång. Era anställda kan börja redan idag.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2.5 bg-accent text-accent-foreground px-8 py-4 rounded-full font-[family-name:var(--font-display)] text-lg tracking-[-0.02em] uppercase"
            >
              Kom igång
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </FadeIn>
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
