"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { HelpCircle, X, BookOpen, FileText, Bot, HelpCircle as Quiz, MessageCircle, ListChecks, Workflow, ArrowDown, Layers } from "lucide-react"
import { cn } from "@/lib/utils"

const SLIDE_TYPES = [
  {
    value: "info",
    label: "Innehåll",
    icon: FileText,
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
    description: "Text med valfri video (9:16). Grundtypen för all information.",
    fields: ["Rubrik", "Brödtext", "Video-URL (valfritt)"],
  },
  {
    value: "llm_chat",
    label: "AI-chatt",
    icon: Bot,
    color: "bg-purple-500/10 text-purple-600 border-purple-200",
    description: "Interaktiv chatt där användaren pratar med AI:n. Konfigurera system-prompt för att styra beteendet.",
    fields: ["Rubrik", "Brödtext", "System-prompt", "Instruktionstext", "Max meddelanden"],
  },
  {
    value: "quiz",
    label: "Quiz",
    icon: Quiz,
    color: "bg-green-500/10 text-green-600 border-green-200",
    description: "Flervalsfråga med rätt/fel-markering, förklaring och feedback per alternativ.",
    fields: ["Rubrik (frågan)", "Brödtext", "Alternativ (i Directus): text, rätt/fel, feedback"],
  },
  {
    value: "scenario",
    label: "Scenario",
    icon: MessageCircle,
    color: "bg-orange-500/10 text-orange-600 border-orange-200",
    description: "Situationsbeskrivning med val. T.ex. 'Din telefon ringer — vad gör du?' Varje val har feedback.",
    fields: ["Rubrik", "Brödtext (situationen)", "Val (i Directus): text, utfall, rekommenderat ja/nej"],
  },
  {
    value: "checklist",
    label: "Checklista",
    icon: ListChecks,
    color: "bg-teal-500/10 text-teal-600 border-teal-200",
    description: "Punkter att kryssa av. Bra som sammanfattning eller åtgärdslista i slutet av en modul.",
    fields: ["Rubrik", "Brödtext", "Punkter (i Directus): item_text"],
  },
  {
    value: "flow",
    label: "Flöde",
    icon: Workflow,
    color: "bg-pink-500/10 text-pink-600 border-pink-200",
    description: "Animerad steg-för-steg-visualisering med SVG-scener. Animationerna konfigureras i kod.",
    fields: ["Rubrik", "Brödtext", "Animationer (i kod)"],
  },
]

export function HelpDialog() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
        title="Hjälp"
      >
        <HelpCircle className="w-4 h-4 text-muted-foreground" />
      </button>

      {open && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative z-10 bg-background border border-border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-auto">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-5 border-b border-border bg-background/95 backdrop-blur-sm rounded-t-2xl z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <h2 className="font-semibold text-lg">Så bygger du en kurs</h2>
              </div>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-8">
              {/* Structure diagram */}
              <div>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  Struktur
                </h3>
                <div className="rounded-xl border border-border bg-secondary/20 p-5">
                  {/* Course level */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">K</div>
                    <div>
                      <p className="font-semibold text-sm">Kurs</p>
                      <p className="text-[11px] text-muted-foreground">T.ex. "Lär dig använda AI" — har titel, slug, status</p>
                    </div>
                  </div>

                  <div className="flex justify-center py-1.5">
                    <ArrowDown className="w-4 h-4 text-muted-foreground/30" />
                  </div>

                  {/* Module level */}
                  <div className="ml-6 space-y-2">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                      <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center text-xs font-mono text-muted-foreground">01</div>
                      <div>
                        <p className="font-semibold text-sm">Modul (kapitel)</p>
                        <p className="text-[11px] text-muted-foreground">T.ex. "Vad är AI?" — en grupp slides under ett tema</p>
                      </div>
                    </div>

                    <div className="flex justify-center py-0.5">
                      <ArrowDown className="w-3.5 h-3.5 text-muted-foreground/20" />
                    </div>

                    {/* Slide level */}
                    <div className="ml-6 grid grid-cols-3 gap-1.5">
                      {["Innehåll", "Quiz", "AI-chatt"].map((s, i) => (
                        <div key={s} className="p-2 rounded-md bg-background border border-border text-center">
                          <p className="text-[10px] font-medium">{s}</p>
                          <p className="text-[9px] text-muted-foreground">Slide {i + 1}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Example */}
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">
                      <strong>Exempel:</strong> Kurs "Lär dig använda AI" har 9 moduler med totalt ~14 slides.
                      Varje modul är ett kapitel. Användaren klickar sig igenom alla slides i ordning.
                    </p>
                  </div>
                </div>
              </div>

              {/* Slide types */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">6 slide-typer</h3>
                <div className="grid grid-cols-1 gap-3">
                  {SLIDE_TYPES.map((st) => {
                    const Icon = st.icon
                    return (
                      <div key={st.value} className={cn("rounded-xl border p-4", st.color.split(" ")[2] || "border-border")}>
                        <div className="flex items-start gap-3">
                          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", st.color.split(" ").slice(0, 2).join(" "))}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-sm text-foreground">{st.label}</p>
                              <code className="text-[10px] bg-foreground/5 px-1.5 py-0.5 rounded font-mono text-muted-foreground">{st.value}</code>
                            </div>
                            <p className="text-xs text-foreground/60 mb-2">{st.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {st.fields.map((f) => (
                                <span key={f} className="text-[10px] bg-foreground/5 text-muted-foreground px-1.5 py-0.5 rounded">
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Best practices */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Tips för bra kurser</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { title: "Börja med kontext", text: "Varje modul ska öppna med en Innehåll-slide som introducerar ämnet." },
                    { title: "Varva interaktivt", text: "Blanda text med quiz, chatt och scenarion. Inte 5 textsidor i rad." },
                    { title: "Kort text", text: "Max 3-4 stycken per slide. Separera stycken med tomrad." },
                    { title: "Video i 9:16", text: "Video visas i stående format bredvid texten. Peka på en mp4-URL." },
                  ].map((tip) => (
                    <div key={tip.title} className="p-3 rounded-lg bg-secondary/30 border border-border">
                      <p className="text-xs font-semibold text-foreground mb-1">{tip.title}</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{tip.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Status</h3>
                <div className="flex gap-3">
                  <div className="flex-1 p-3 rounded-lg border border-amber-200 bg-amber-500/5">
                    <span className="text-xs font-medium text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">Draft</span>
                    <p className="text-[11px] text-muted-foreground mt-2">Kursen syns inte publikt. Tillgänglig via direktlänk för förhandsvisning.</p>
                  </div>
                  <div className="flex-1 p-3 rounded-lg border border-green-200 bg-green-500/5">
                    <span className="text-xs font-medium text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">Publicerad</span>
                    <p className="text-[11px] text-muted-foreground mt-2">Synlig för användare. I framtiden: tillgänglig för de som slutfört grundkurserna.</p>
                  </div>
                </div>
              </div>

              {/* Directus link */}
              <div className="p-4 rounded-xl bg-foreground/[0.02] border border-border text-center">
                <p className="text-xs text-muted-foreground mb-2">Quiz-alternativ, scenario-val och checklistepunkter redigeras i Directus</p>
                <a
                  href="https://directus-production-2883.up.railway.app"
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  Öppna Directus
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
