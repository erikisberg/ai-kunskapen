"use client"

import { ArrowRight } from "lucide-react"
import { useJourney, type JourneyType } from "@/lib/journey-context"
import { AudioPlayer } from "@/components/journey/audio-player"
import { cn } from "@/lib/utils"

interface ContentStepProps {
  type: JourneyType
  title: string
  content: React.ReactNode
  textContent?: string // Plain text version for audio
  illustration?: React.ReactNode
}

export function ContentStep({ type, title, content, textContent, illustration }: ContentStepProps) {
  const { nextStep, markCurrentStepComplete } = useJourney()

  const handleContinue = () => {
    markCurrentStepComplete()
    nextStep()
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-auto">
        <div className="px-4 md:px-8 py-8 md:py-12">
          <div className="max-w-2xl mx-auto">
            {illustration && (
              <div className="mb-10 flex justify-center">
                {illustration}
              </div>
            )}

            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl tracking-[-0.045em] uppercase mb-6">
              {title}
            </h2>

            {/* Audio Player */}
            {textContent && (
              <AudioPlayer 
                text={textContent} 
                className="mb-8"
              />
            )}

            <div className="prose prose-lg max-w-none text-foreground prose-headings:font-[family-name:var(--font-display)] prose-headings:tracking-[-0.045em] prose-headings:uppercase prose-p:leading-relaxed">
              {content}
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
              [ FORTSATT ]
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
