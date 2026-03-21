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
  videoUrl?: string
}

export function ContentStep({ type, title, content, textContent, illustration, videoUrl }: ContentStepProps) {
  const { nextStep, markCurrentStepComplete } = useJourney()

  const handleContinue = () => {
    markCurrentStepComplete()
    nextStep()
  }

  const hasVideo = !!videoUrl

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-auto">
        <div className="px-6 md:px-8 py-10 md:py-14">
          <div className={cn(
            "mx-auto",
            hasVideo ? "max-w-5xl" : "max-w-2xl"
          )}>
            {hasVideo ? (
              /* Split layout: text left, video right */
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
                {/* Text side */}
                <div className="flex-1 min-w-0">
                  <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl tracking-[-0.03em] uppercase mb-6 leading-[1.1]">
                    {title}
                  </h2>

                  {textContent && (
                    <AudioPlayer text={textContent} className="mb-6" />
                  )}

                  <div className="[&_p]:leading-[1.8] [&_li]:leading-[1.7] [&_p]:mb-4 text-foreground/80 text-lg">
                    {content}
                  </div>
                </div>

                {/* Video side — 9:16 stories format */}
                <div className="w-full md:w-[280px] lg:w-[320px] shrink-0">
                  <div className="relative rounded-2xl overflow-hidden bg-black shadow-xl aspect-[9/16] max-h-[50vh] md:max-h-none">
                    <video
                      src={videoUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {/* Subtle gradient overlay at bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                </div>
              </div>
            ) : (
              /* Standard layout: full width text */
              <>
                {illustration && (
                  <div className="mb-10 flex justify-center">
                    {illustration}
                  </div>
                )}

                <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl tracking-[-0.03em] uppercase mb-6 leading-[1.1]">
                  {title}
                </h2>

                {textContent && (
                  <AudioPlayer text={textContent} className="mb-8" />
                )}

                <div className="[&_p]:leading-[1.8] [&_li]:leading-[1.7] [&_p]:mb-4 text-foreground/80 text-lg">
                  {content}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Fixed bottom action */}
      <div className="sticky bottom-0 bg-background/80 backdrop-blur-xl border-t border-border py-4">
        <div className="px-6 md:px-8">
          <div className={cn(
            "mx-auto flex justify-end",
            hasVideo ? "max-w-5xl" : "max-w-2xl"
          )}>
            <button
              onClick={handleContinue}
              className={cn(
                "inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all hover:scale-[1.03] active:scale-[0.98]",
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
