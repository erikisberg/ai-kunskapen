"use client"

import { useRef, useEffect, useState } from "react"
import { ArrowRight, Send, Sparkles, User } from "lucide-react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useJourney, type JourneyType } from "@/lib/journey-context"
import { cn } from "@/lib/utils"

// Simple markdown renderer for chat messages
function renderMarkdown(text: string) {
  const parts: React.ReactNode[] = []
  const lines = text.split('\n')

  lines.forEach((line, lineIndex) => {
    const boldRegex = /\*\*(.+?)\*\*/g
    let lastIndex = 0
    const lineElements: React.ReactNode[] = []
    let match

    while ((match = boldRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        lineElements.push(line.slice(lastIndex, match.index))
      }
      lineElements.push(<strong key={`${lineIndex}-${match.index}`} className="font-semibold">{match[1]}</strong>)
      lastIndex = match.index + match[0].length
    }

    if (lastIndex < line.length) {
      lineElements.push(line.slice(lastIndex))
    }

    if (line.startsWith('- ')) {
      parts.push(
        <li key={lineIndex} className="ml-4 list-disc">
          {lineElements.length > 0 ? lineElements.slice(1) : line.slice(2)}
        </li>
      )
    } else if (/^\d+\.\s/.test(line)) {
      const numberMatch = line.match(/^(\d+)\.\s(.*)/)
      if (numberMatch) {
        parts.push(
          <li key={lineIndex} className="ml-4 list-decimal">
            {lineElements.length > 1 ? lineElements.slice(1) : numberMatch[2]}
          </li>
        )
      }
    } else if (line.trim() === '') {
      parts.push(<br key={lineIndex} />)
    } else {
      parts.push(
        <span key={lineIndex}>
          {lineElements.length > 0 ? lineElements : line}
          {lineIndex < lines.length - 1 && <br />}
        </span>
      )
    }
  })

  return parts
}

function getMessageText(message: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!message.parts) return ""
  return message.parts
    .filter((p) => p.type === "text" && p.text)
    .map((p) => p.text!)
    .join("")
}

interface ChatStepProps {
  type: JourneyType
  title: string
  description: string
  systemPrompt?: string
  initialMessage?: string
  suggestedPrompts?: string[]
  minMessages?: number
  maxMessages?: number
}

export function ChatStep({
  type,
  title,
  description,
  systemPrompt,
  initialMessage = "Hej! Jag är här för att hjälpa dig. Prova att ställa en fråga eller använd ett av förslagen nedan.",
  suggestedPrompts = ["Ge mig ett enkelt middagsrecept", "Hjälp mig skriva ett mejl", "Vad kan du hjälpa mig med?"],
  minMessages = 2,
  maxMessages = 10,
}: ChatStepProps) {
  const { nextStep, markCurrentStepComplete } = useJourney()
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        systemPrompt: systemPrompt || "Du är en hjälpsam AI-assistent som hjälper användaren lära sig om AI. Svara på svenska. Håll svaren korta och pedagogiska. Max 150 ord per svar.",
        maxMessages,
      },
    }),
  })

  const isLoading = status === "streaming" || status === "submitted"
  const userMessageCount = messages.filter(m => m.role === "user").length
  const canContinue = userMessageCount >= minMessages
  const reachedLimit = userMessageCount >= maxMessages

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = (text?: string) => {
    const msg = text || inputValue
    if (!msg.trim() || isLoading || reachedLimit) return
    sendMessage({ text: msg })
    setInputValue("")
  }

  const handleContinue = () => {
    markCurrentStepComplete()
    nextStep()
  }

  // Build display messages: initial greeting + real messages
  const displayMessages: { role: "user" | "assistant"; content: string }[] = []
  if (messages.length === 0) {
    displayMessages.push({ role: "assistant", content: initialMessage })
  }
  for (const m of messages) {
    displayMessages.push({ role: m.role as "user" | "assistant", content: getMessageText(m) })
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-auto">
        <div className="px-4 md:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl tracking-[-0.045em] uppercase mb-3">{title}</h2>
              <p className="text-muted-foreground text-lg">{description}</p>
            </div>

            {/* Chat Card */}
            <div className="border border-border overflow-hidden">
              {/* Chat Messages */}
              <div className="h-80 md:h-96 overflow-auto p-4 space-y-4 bg-secondary/30">
                {displayMessages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex gap-3",
                      message.role === "user" && "flex-row-reverse"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 flex items-center justify-center flex-shrink-0 border border-border",
                      message.role === "assistant" ? "bg-primary text-primary-foreground" : "bg-foreground text-background"
                    )}>
                      {message.role === "assistant" ? (
                        <Sparkles className="w-5 h-5" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <div className={cn(
                      "flex-1 max-w-[80%] p-4",
                      message.role === "assistant"
                        ? "bg-card border border-border"
                        : "bg-primary text-primary-foreground"
                    )}>
                      <div className="text-sm leading-relaxed">{renderMarkdown(message.content)}</div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 border border-border">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="bg-card border border-border p-4">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Prompts */}
              {userMessageCount === 0 && (
                <div className="px-4 py-3 border-t border-border bg-secondary/50">
                  <p className="text-xs font-[family-name:var(--font-display)] tracking-[-0.02em] uppercase text-muted-foreground mb-2">PROVA ATT SÄGA:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handleSend(prompt)}
                        className="text-sm px-4 py-2 border border-border bg-card hover:bg-secondary transition-colors font-medium"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-border bg-card">
                {reachedLimit ? (
                  <p className="text-center text-muted-foreground py-2">
                    Du har nått maxgränsen på {maxMessages} meddelanden. Klicka fortsätt!
                  </p>
                ) : (
                  <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-3"
                  >
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Skriv ett meddelande..."
                      className="flex-1 px-5 py-3 border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isLoading}
                      className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center border border-border disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                      <span className="sr-only">Skicka</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Message counter */}
            <p className="text-center text-sm text-muted-foreground mt-4">
              {userMessageCount} av {maxMessages} meddelanden
            </p>

            {/* Hint */}
            {!canContinue && (
              <p className="text-center text-sm text-muted-foreground mt-2">
                Skicka minst {minMessages} meddelanden för att fortsätta
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Fixed bottom action */}
      {canContinue && (
        <div className="sticky bottom-0 bg-background border-t border-border py-4">
          <div className="px-4 md:px-8">
            <div className="max-w-2xl mx-auto flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Bra jobbat! Du har skickat {userMessageCount} meddelanden.
              </span>
              <button
                onClick={handleContinue}
                className={cn(
                  "inline-flex items-center gap-2 font-[family-name:var(--font-display)] text-lg tracking-[-0.02em] uppercase transition-opacity hover:opacity-80",
                  type === "learn" ? "text-primary" : "text-foreground"
                )}
              >
                [ FORTSÄTT ]
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
