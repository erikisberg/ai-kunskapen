"use client"

import { useState, useRef, useEffect } from "react"
import { Volume2, Pause } from "lucide-react"
import { cn } from "@/lib/utils"

interface AudioPlayerProps {
  text: string
  className?: string
}

export function AudioPlayer({ text, className }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
      setIsSupported(false)
      return
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [text])

  const handlePlayPause = () => {
    if (!isSupported) return

    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
    } else {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'sv-SE'
      utterance.rate = 0.9
      utterance.pitch = 1

      const voices = window.speechSynthesis.getVoices()
      const swedishVoice = voices.find(voice => voice.lang.startsWith('sv'))
      if (swedishVoice) {
        utterance.voice = swedishVoice
      }

      utterance.onend = () => {
        setIsPlaying(false)
      }

      utterance.onerror = () => {
        setIsPlaying(false)
      }

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
      setIsPlaying(true)
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      <button
        onClick={handlePlayPause}
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 border-2 transition-colors",
          isPlaying 
            ? "border-primary bg-primary text-primary-foreground" 
            : "border-foreground/20 bg-transparent hover:border-foreground/40"
        )}
        aria-label={isPlaying ? "Stoppa uppläsning" : "Lyssna på texten"}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">
          {isPlaying ? "Stoppa" : "Lyssna"}
        </span>
      </button>
      <p className="text-xs text-foreground/50">
        Klicka för att få texten uppläst
      </p>
    </div>
  )
}
