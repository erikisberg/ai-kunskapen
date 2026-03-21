"use client"

import { useState } from "react"
import { HelpCircle, X } from "lucide-react"

export function HelpDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
        title="Hjälp"
      >
        <HelpCircle className="w-4 h-4 text-muted-foreground" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative bg-background border border-border rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-semibold text-lg">Så bygger du en kurs</h2>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5 text-sm leading-relaxed text-foreground/80">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Struktur</h3>
                <p>En kurs består av <strong>moduler</strong> (kapitel), och varje modul har <strong>slides</strong> (sidor). Användaren klickar sig igenom slide för slide.</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-1">Slide-typer</h3>
                <ul className="space-y-2 mt-2">
                  <li><strong>Innehåll</strong> — Text med valfri video (9:16-format). Grundtypen.</li>
                  <li><strong>AI-chatt</strong> — Interaktiv chatt med AI. Konfigurera system-prompt för att styra beteendet.</li>
                  <li><strong>Quiz</strong> — Flervalsfråga med rätt/fel och förklaring. Alternativ hanteras i Directus.</li>
                  <li><strong>Scenario</strong> — Situationsbeskrivning med val och feedback. T.ex. "Din telefon ringer, vad gör du?"</li>
                  <li><strong>Checklista</strong> — Punkter att kryssa av. Bra för sammanfattningar och åtgärdslistor.</li>
                  <li><strong>Flöde</strong> — Animerad steg-för-steg-visualisering. Animationerna konfigureras i kod.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-1">Tips</h3>
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>Börja varje modul med en <strong>Innehåll</strong>-slide som introducerar ämnet</li>
                  <li>Varva text med interaktiva element (quiz, chatt, scenario) för engagemang</li>
                  <li>Håll texter korta — max 3-4 stycken per slide</li>
                  <li>Separera stycken med tomrad i brödtexten</li>
                  <li>Video-URL ska peka på en mp4-fil, visas i stående format bredvid texten</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-1">Ordning</h3>
                <p>Slides visas i den ordning de listas. Nya slides hamnar sist i modulen. Sorteringsordning kan ändras i Directus.</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-1">Quiz & Scenario — detaljer</h3>
                <p>Rubrik och brödtext redigeras här. Quiz-alternativ, scenario-val och checklista-punkter redigeras i <a href="https://directus-production-2883.up.railway.app" target="_blank" rel="noopener" className="text-primary underline">Directus</a> under respektive samling.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
