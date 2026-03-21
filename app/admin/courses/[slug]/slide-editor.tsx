"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface SlideEditorProps {
  slide: {
    id: string
    type: string
    heading: string
    body_text: string
    video_url?: string | null
    llm_system_prompt?: string | null
    llm_instruction_text?: string | null
    llm_max_messages?: number | null
    quiz_options?: any[]
    scenario_choices?: any[]
    checklist_items?: any[]
  }
  onSave: (data: any) => void
  onCancel: () => void
  saving: boolean
}

export function SlideEditor({ slide, onSave, onCancel, saving }: SlideEditorProps) {
  const [heading, setHeading] = useState(slide.heading)
  const [bodyText, setBodyText] = useState(slide.body_text)
  const [videoUrl, setVideoUrl] = useState(slide.video_url || "")
  const [systemPrompt, setSystemPrompt] = useState(slide.llm_system_prompt || "")
  const [instructionText, setInstructionText] = useState(slide.llm_instruction_text || "")
  const [maxMessages, setMaxMessages] = useState(slide.llm_max_messages || 10)

  const handleSave = () => {
    const data: any = {
      heading,
      body_text: bodyText,
      video_url: videoUrl || null,
    }

    if (slide.type === "llm_chat") {
      data.llm_system_prompt = systemPrompt || null
      data.llm_instruction_text = instructionText || null
      data.llm_max_messages = maxMessages
    }

    onSave(data)
  }

  const inputClass = "w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm"
  const labelClass = "text-xs font-medium text-muted-foreground mb-1 block"

  return (
    <div className="space-y-4">
      {/* Common fields */}
      <div>
        <label className={labelClass}>Rubrik</label>
        <input
          type="text"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Brödtext</label>
        <textarea
          value={bodyText}
          onChange={(e) => setBodyText(e.target.value)}
          rows={6}
          className={cn(inputClass, "resize-y font-mono")}
        />
        <p className="text-[10px] text-muted-foreground mt-1">Separera stycken med tomrad. Stöder enkel formatering.</p>
      </div>

      <div>
        <label className={labelClass}>Video-URL (valfritt, 9:16-format)</label>
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://..."
          className={inputClass}
        />
      </div>

      {/* LLM Chat fields */}
      {slide.type === "llm_chat" && (
        <div className="border-t border-border pt-4 space-y-3">
          <p className="text-xs font-semibold text-primary">AI-chatt-inställningar</p>
          <div>
            <label className={labelClass}>System-prompt (hur AI:n ska bete sig)</label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={4}
              placeholder="Du är en hjälpsam AI-assistent..."
              className={cn(inputClass, "resize-y font-mono")}
            />
          </div>
          <div>
            <label className={labelClass}>Instruktionstext (visas för användaren)</label>
            <textarea
              value={instructionText}
              onChange={(e) => setInstructionText(e.target.value)}
              rows={2}
              placeholder="Prova att ställa en fråga till AI:n..."
              className={cn(inputClass, "resize-y")}
            />
          </div>
          <div>
            <label className={labelClass}>Max antal meddelanden</label>
            <input
              type="number"
              value={maxMessages}
              onChange={(e) => setMaxMessages(parseInt(e.target.value) || 10)}
              min={1}
              max={50}
              className={cn(inputClass, "w-24")}
            />
          </div>
        </div>
      )}

      {/* Quiz — show existing options (read-only for now, editing via Directus) */}
      {slide.type === "quiz" && slide.quiz_options && slide.quiz_options.length > 0 && (
        <div className="border-t border-border pt-4">
          <p className="text-xs font-semibold text-primary mb-2">Quiz-alternativ ({slide.quiz_options.length})</p>
          <div className="space-y-1.5">
            {slide.quiz_options.map((opt, i) => (
              <div key={opt.id || i} className={cn(
                "text-sm px-3 py-2 rounded-lg border",
                opt.is_correct ? "border-green-500/30 bg-green-500/5" : "border-border"
              )}>
                {opt.is_correct && <span className="text-[10px] text-green-600 font-medium mr-1">RÄTT</span>}
                {opt.option_text}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">Redigera quiz-alternativ i Directus.</p>
        </div>
      )}

      {/* Scenario — show existing choices */}
      {slide.type === "scenario" && slide.scenario_choices && slide.scenario_choices.length > 0 && (
        <div className="border-t border-border pt-4">
          <p className="text-xs font-semibold text-primary mb-2">Scenario-val ({slide.scenario_choices.length})</p>
          <div className="space-y-1.5">
            {slide.scenario_choices.map((ch, i) => (
              <div key={ch.id || i} className={cn(
                "text-sm px-3 py-2 rounded-lg border",
                ch.is_recommended ? "border-green-500/30 bg-green-500/5" : "border-border"
              )}>
                {ch.is_recommended && <span className="text-[10px] text-green-600 font-medium mr-1">REKOMMENDERAT</span>}
                {ch.choice_text}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">Redigera scenario-val i Directus.</p>
        </div>
      )}

      {/* Checklist — show existing items */}
      {slide.type === "checklist" && slide.checklist_items && slide.checklist_items.length > 0 && (
        <div className="border-t border-border pt-4">
          <p className="text-xs font-semibold text-primary mb-2">Checklistepunkter ({slide.checklist_items.length})</p>
          <div className="space-y-1">
            {slide.checklist_items.map((item, i) => (
              <div key={item.id || i} className="text-sm px-3 py-1.5 rounded-lg border border-border flex items-center gap-2">
                <span className="w-4 h-4 rounded border border-border shrink-0" />
                {item.item_text}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">Redigera checklistepunkter i Directus.</p>
        </div>
      )}

      {/* Flow note */}
      {slide.type === "flow" && (
        <div className="border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">
            Flödesanimationer konfigureras i kod (SVG-scener). Rubrik och brödtext kan redigeras här.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onCancel} className="px-4 py-2 rounded-full text-sm text-muted-foreground">
          Avbryt
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 rounded-full text-sm font-medium bg-primary text-primary-foreground disabled:opacity-50"
        >
          {saving ? "Sparar..." : "Spara"}
        </button>
      </div>
    </div>
  )
}
