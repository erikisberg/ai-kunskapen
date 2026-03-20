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
      if (swedishVoice) utterance.voice = swedishVoice
      utterance.onend = () => setIsPlaying(false)
      utterance.onerror = () => setIsPlaying(false)
      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
      setIsPlaying(true)
    }
  }

  if (!isSupported) return null

  return (
    <div className={cn("flex items-center", className)}>
      <button
        onClick={handlePlayPause}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
          isPlaying
            ? "bg-primary text-primary-foreground"
            : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
        )}
        aria-label={isPlaying ? "Stoppa uppläsning" : "Lyssna på texten"}
      >
        {isPlaying ? (
          <Pause className="w-3.5 h-3.5" />
        ) : (
          <Volume2 className="w-3.5 h-3.5" />
        )}
        {isPlaying ? "Stoppa" : "Lyssna"}
      </button>
    </div>
  )
}
