"use client"

import { useState } from "react"
import { ArrowRight, Check, ClipboardCopy } from "lucide-react"
import { useJourney, type JourneyType } from "@/lib/journey-context"
import { cn } from "@/lib/utils"

interface ChecklistItem {
  id: string
  text: string
  description?: string
}

interface ChecklistStepProps {
  type: JourneyType
  title: string
  description: string
  items: ChecklistItem[]
}

export function ChecklistStep({ type, title, description, items }: ChecklistStepProps) {
  const { nextStep, markCurrentStepComplete } = useJourney()
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState(false)

  const toggleItem = (id: string) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleCopy = async () => {
    const text = items.map(item => `- ${item.text}`).join('\n')
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleContinue = () => {
    markCurrentStepComplete()
    nextStep()
  }

  const allChecked = checkedItems.size === items.length

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-auto">
        <div className="px-4 md:px-8 py-8 md:py-12">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl tracking-[-0.045em] uppercase mb-3">{title}</h2>
              <p className="text-muted-foreground text-lg">{description}</p>
            </div>

            {/* Checklist Card */}
            <div className="border-2 border-foreground mb-8 overflow-hidden">
              <div className="divide-y-2 divide-foreground">
                {items.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className="w-full text-left p-5 md:p-6 hover:bg-secondary/30 transition-colors focus:outline-none focus:bg-secondary/30"
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-7 h-7 border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
                        checkedItems.has(item.id) 
                          ? type === "learn" 
                            ? "bg-primary border-primary text-primary-foreground" 
                            : "bg-accent border-accent text-accent-foreground"
                          : "border-foreground"
                      )}>
                        {checkedItems.has(item.id) && (
                          <Check className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={cn(
                          "font-medium text-lg transition-all",
                          checkedItems.has(item.id) && "line-through text-muted-foreground"
                        )}>
                          {item.text}
                        </p>
                        {item.description && (
                          <p className="text-muted-foreground mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <span className="font-[family-name:var(--font-display)] text-2xl tracking-[-0.045em] text-muted-foreground">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-foreground hover:bg-secondary transition-colors font-[family-name:var(--font-display)] text-sm tracking-[-0.02em] uppercase"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    KOPIERAD
                  </>
                ) : (
                  <>
                    <ClipboardCopy className="w-4 h-4" />
                    KOPIERA LISTAN
                  </>
                )}
              </button>
            </div>

            {/* Progress indicator */}
            <div className="text-center mt-8">
              <span className="text-sm text-muted-foreground">
                {checkedItems.size} av {items.length} markerade
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom action */}
      <div className="sticky bottom-0 bg-background border-t-2 border-foreground py-4">
        <div className="px-4 md:px-8">
          <div className="max-w-2xl mx-auto flex justify-end">
            <button 
              onClick={handleContinue}
              className={cn(
                "inline-flex items-center gap-2 font-[family-name:var(--font-display)] text-lg tracking-[-0.02em] uppercase transition-opacity hover:opacity-80",
                type === "learn" ? "text-primary" : "text-foreground"
              )}
            >
              [ {allChecked ? "SLUTFOR" : "FORTSATT"} ]
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
