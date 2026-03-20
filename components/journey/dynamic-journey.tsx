"use client"

import { useEffect } from "react"
import { useJourney } from "@/lib/journey-context"
import { JourneyLayout } from "@/components/journey/journey-layout"
import { IntroStep } from "@/components/journey/steps/intro-step"
import { ContentStep } from "@/components/journey/steps/content-step"
import { ChatStep } from "@/components/journey/steps/chat-step"
import { QuizStep } from "@/components/journey/steps/quiz-step"
import { ScenarioStep } from "@/components/journey/steps/scenario-step"
import { ChecklistStep } from "@/components/journey/steps/checklist-step"
import { CompleteStep } from "@/components/journey/steps/complete-step"
import { FlowSlide } from "@/components/journey/steps/flow-slide"
import type { Step } from "@/lib/journey-context"
import type { StepData, JourneyType } from "@/lib/course-data"

interface DynamicJourneyProps {
  journeyType: JourneyType
  steps: StepData[]
}

function JourneyContent({ journeyType, steps }: DynamicJourneyProps) {
  const { progress, setJourneyType } = useJourney()

  useEffect(() => {
    // Convert StepData to journey-context Step format
    const contextSteps: Step[] = steps.map((s) => ({
      id: s.id,
      title: s.title,
      type: s.type === "llm_chat" ? "chat" : s.type,
      completed: false,
    }))
    setJourneyType(journeyType, contextSteps)
  }, [journeyType, steps, setJourneyType])

  const currentStep = progress.steps[progress.currentStep]
  if (!currentStep) return null

  // Find the matching step data
  const stepIndex = progress.currentStep
  const stepData = steps[stepIndex]
  if (!stepData) return null

  const type = journeyType

  switch (stepData.type) {
    case "intro":
      return <IntroStep type={type} />

    case "content":
      return (
        <ContentStep
          type={type}
          title={stepData.heading}
          textContent={stepData.bodyText}
          content={
            <div className="space-y-4 text-foreground/80">
              {stepData.bodyText.split("\n\n").map((paragraph, i) => (
                <p key={i} className="leading-relaxed whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
          }
        />
      )

    case "llm_chat":
      return (
        <ChatStep
          type={type}
          title={stepData.heading}
          description={stepData.instructionText || stepData.bodyText}
          systemPrompt={stepData.systemPrompt}
          suggestedPrompts={stepData.suggestedPrompts}
          minMessages={2}
          maxMessages={stepData.maxMessages || 10}
        />
      )

    case "quiz":
      return (
        <QuizStep
          type={type}
          title={stepData.heading}
          questions={
            stepData.quizOptions
              ? groupQuizOptions(stepData.quizOptions, stepData.bodyText)
              : []
          }
        />
      )

    case "scenario":
      return (
        <ScenarioStep
          type={type}
          title={stepData.heading}
          description="Det här är en övning — inte på riktigt."
          scenarioType={stepData.scenarioType || "message"}
          scenarioContent={
            <div className="space-y-3">
              {stepData.bodyText.split("\n\n").map((p, i) => (
                <p key={i} className="leading-relaxed whitespace-pre-line">{p}</p>
              ))}
            </div>
          }
          question="Vad gör du?"
          choices={
            stepData.scenarioChoices?.map((c) => ({
              text: c.text,
              isCorrect: c.isCorrect,
              feedback: c.feedback,
            })) || []
          }
        />
      )

    case "checklist":
      return (
        <ChecklistStep
          type={type}
          title={stepData.heading}
          description={stepData.bodyText}
          items={
            stepData.checklistItems?.map((item) => ({
              id: item.id,
              text: item.text,
              description: item.description,
            })) || []
          }
        />
      )

    case "flow":
      return (
        <FlowSlide
          type={type}
          title={stepData.heading}
          steps={stepData.flowSteps || []}
        />
      )

    case "complete":
      return <CompleteStep type={type} />

    default:
      return <div>Okänd stegtyp</div>
  }
}

/**
 * Convert flat quiz options into the QuizStep question format.
 * All options for a single slide form one question.
 */
function groupQuizOptions(
  options: Array<{ option_text: string; is_correct: boolean; feedback_text: string }>,
  questionText: string
) {
  const correctIndex = options.findIndex((o) => o.is_correct)
  return [
    {
      question: questionText,
      options: options.map((o) => o.option_text),
      correctIndex: correctIndex >= 0 ? correctIndex : 0,
      explanation: options.find((o) => o.is_correct)?.feedback_text || "",
    },
  ]
}

export function DynamicJourney({ journeyType, steps }: DynamicJourneyProps) {
  return (
    <JourneyLayout type={journeyType}>
      <JourneyContent journeyType={journeyType} steps={steps} />
    </JourneyLayout>
  )
}
