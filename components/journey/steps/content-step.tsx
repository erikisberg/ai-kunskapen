"use client"

import { ArrowRight } from "lucide-react"
import { useJourney, type JourneyType } from "@/lib/journey-context"
import { AudioPlayer } from "@/components/journey/audio-player"
import { cn } from "@/lib/utils"

interface ContentStepProps {
  type: JourneyType
  title: string
  content: React.ReactNode
  textContent?: string
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
        <div className="px-6 md:px-8 py-10 md:py-14">
          <div className="max-w-2xl mx-auto">
            {illustration && (
              <div className="mb-10 flex justify-center">
                {illustration}
              </div>
            )}

            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl tracking-[-0.03em] uppercase mb-6 leading-[1.1]">
              {title}
            </h2>

            {textContent && (
              <AudioPlayer
                text={textContent}
                className="mb-8"
              />
            )}

            <div className="prose prose-lg max-w-none text-foreground/80 prose-headings:font-semibold prose-headings:text-foreground [&_p]:leading-[1.8] [&_li]:leading-[1.7] [&_p]:mb-4">
              {content}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom action — subtle */}
      <div className="sticky bottom-0 bg-background/80 backdrop-blur-xl border-t border-border py-4">
        <div className="px-6 md:px-8">
          <div className="max-w-2xl mx-auto flex justify-end">
            <button
              onClick={handleContinue}
              className={cn(
                "inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all hover:scale-[1.02]",
                type === "learn"
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-accent-foreground"
              )}
            >
              Fortsätt
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
