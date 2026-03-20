"use client"

import { useState } from "react"
import { ArrowRight, Check, X } from "lucide-react"
import { useJourney, type JourneyType } from "@/lib/journey-context"
import { cn } from "@/lib/utils"

interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

interface QuizStepProps {
  type: JourneyType
  title: string
  questions: QuizQuestion[]
}

export function QuizStep({ type, title, questions }: QuizStepProps) {
  const { nextStep, markCurrentStepComplete } = useJourney()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  const question = questions[currentQuestion]
  const isCorrect = selectedAnswer === question.correctIndex
  const isLastQuestion = currentQuestion === questions.length - 1

  const handleSelectAnswer = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
    setShowResult(true)
    if (index === question.correctIndex) {
      setCorrectCount(prev => prev + 1)
    }
  }

  const handleNext = () => {
    if (isLastQuestion) {
      markCurrentStepComplete()
      nextStep()
    } else {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-auto">
        <div className="px-4 md:px-8 py-8 md:py-12">
          <div className="max-w-2xl mx-auto">
            {/* Progress */}
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl tracking-[-0.045em] uppercase">{title}</h2>
              <span className="font-[family-name:var(--font-display)] text-sm tracking-[-0.02em] uppercase text-muted-foreground">
                {currentQuestion + 1} / {questions.length}
              </span>
            </div>

            {/* Question */}
            <div className="border border-border bg-card p-6 md:p-8 mb-6">
              <p className="text-xl md:text-2xl font-medium mb-8 leading-relaxed">
                {question.question}
              </p>

              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={showResult}
                    className={cn(
                      "w-full text-left p-5 border rounded-lg transition-all",
                      "focus:outline-none focus:ring-2 focus:ring-foreground",
                      !showResult && "hover:bg-secondary/50 border-border hover:border-foreground/30",
                      showResult && index === question.correctIndex && "border-primary bg-primary/10",
                      showResult && selectedAnswer === index && index !== question.correctIndex && "border-destructive bg-destructive/10",
                      !showResult && selectedAnswer === index && type === "learn" && "border-primary bg-primary/5",
                      !showResult && selectedAnswer === index && type === "safe" && "border-accent bg-accent/20"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 flex items-center justify-center text-sm font-bold flex-shrink-0 border rounded-lg",
                        showResult && index === question.correctIndex && "bg-primary text-primary-foreground border-primary",
                        showResult && selectedAnswer === index && index !== question.correctIndex && "bg-destructive text-destructive-foreground border-destructive",
                        !showResult && "border-foreground/20"
                      )}>
                        {showResult && index === question.correctIndex ? (
                          <Check className="w-5 h-5" />
                        ) : showResult && selectedAnswer === index ? (
                          <X className="w-5 h-5" />
                        ) : (
                          String.fromCharCode(65 + index)
                        )}
                      </div>
                      <span className="flex-1 text-lg">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Explanation */}
            {showResult && (
              <div className={cn(
                "border rounded-lg animate-slide-up p-6",
                isCorrect ? "border-primary bg-primary/5" : "border-accent bg-accent/20"
              )}>
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-10 h-10 flex items-center justify-center flex-shrink-0",
                    isCorrect ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
                  )}>
                    {isCorrect ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="font-bold">!</span>
                    )}
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-display)] text-lg tracking-[-0.02em] uppercase mb-2">
                      {isCorrect ? "HELT RATT" : "INTE RIKTIGT"}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">{question.explanation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed bottom action */}
      {showResult && (
        <div className="sticky bottom-0 bg-background border-t border-border py-4">
          <div className="px-4 md:px-8">
            <div className="max-w-2xl mx-auto flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {correctCount} ratt av {currentQuestion + 1}
              </span>
              <button 
                onClick={handleNext}
                className={cn(
                  "inline-flex items-center gap-2 font-[family-name:var(--font-display)] text-lg tracking-[-0.02em] uppercase transition-opacity hover:opacity-80",
                  type === "learn" ? "text-primary" : "text-foreground"
                )}
              >
                [ {isLastQuestion ? "FORTSATT" : "NASTA"} ]
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
