"use client"

import { useEffect } from "react"
import { JourneyProvider, useJourney } from "@/lib/journey-context"
import { JourneyLayout } from "@/components/journey/journey-layout"
import { IntroStep } from "@/components/journey/steps/intro-step"
import { ContentStep } from "@/components/journey/steps/content-step"
import { ChatStep } from "@/components/journey/steps/chat-step"
import { QuizStep } from "@/components/journey/steps/quiz-step"
import { ChecklistStep } from "@/components/journey/steps/checklist-step"
import { CompleteStep } from "@/components/journey/steps/complete-step"
import { Sparkles, MessageSquare, Lightbulb } from "lucide-react"

function LearnJourneyContent() {
  const { progress, setJourneyType } = useJourney()

  useEffect(() => {
    setJourneyType("learn")
  }, [setJourneyType])

  const currentStep = progress.steps[progress.currentStep]

  if (!currentStep) return null

  const renderStep = () => {
    switch (currentStep.id) {
      case "learn-intro":
        return <IntroStep type="learn" />
      
      case "learn-what-is-ai":
        return (
          <ContentStep
            type="learn"
            title="VAD AR AI EGENTLIGEN?"
            illustration={
              <div className="w-20 h-20 bg-primary flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary-foreground" />
              </div>
            }
            textContent="AI, eller artificiell intelligens, ar datorsystem som kan utfora uppgifter som vanligtvis kraver mansklig intelligens, som att forsta sprak, svara pa fragor och skapa texter. De AI-chatbotar du kanske hort talas om, som ChatGPT, Claude eller Copilot, ar tranade pa enorma mangder text fran internet. De har lart sig monster i hur vi manniskor skriver och kommunicerar. Viktigt att veta: AI ar ett verktyg, precis som en miniraknare eller sokmotor. AI kan gora fel, dubbelkolla alltid viktig information. AI ersatter inte ditt eget omdome."
            content={
              <div className="space-y-6 text-foreground/80">
                <p>
                  <strong className="text-foreground">AI, eller artificiell intelligens,</strong> ar datorsystem 
                  som kan utfora uppgifter som vanligtvis kraver mansklig intelligens — som att forsta sprak, 
                  svara pa fragor och skapa texter.
                </p>
                <p>
                  De AI-chatbotar du kanske hort talas om — som ChatGPT, Claude eller Copilot — ar tranade 
                  pa enorma mangder text fran internet. De har lart sig monster i hur vi manniskor skriver 
                  och kommunicerar.
                </p>
                <div className="bg-secondary p-6 border-l-4 border-primary">
                  <p className="text-foreground font-bold mb-3 font-heading tracking-tight">VIKTIGT ATT VETA</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">01</span>
                      <span>AI ar ett verktyg — precis som en miniraknare eller sokmotor</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">02</span>
                      <span>AI kan gora fel — dubbelkolla alltid viktig information</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">03</span>
                      <span>AI ersatter inte ditt eget omdome</span>
                    </li>
                  </ul>
                </div>
              </div>
            }
          />
        )

      case "learn-first-chat":
        return (
          <ChatStep
            type="learn"
            title="DIN FORSTA AI-CHATT"
            description="Prova att skicka ett meddelande! Du kan fraga vad som helst."
            initialMessage="Hej! Jag ar en AI-assistent. Du kan stalla fragor, be om hjalp eller bara prata. Prova garna ett av forslagen nedan, eller skriv nagot eget!"
            suggestedPrompts={[
              "Ge mig ett enkelt middagsrecept",
              "Vad kan du hjalpa mig med?",
              "Forklara vad AI ar pa ett enkelt satt"
            ]}
            minMessages={2}
          />
        )

      case "learn-prompts":
        return (
          <ContentStep
            type="learn"
            title="KONSTEN ATT STALLA BRA FRAGOR"
            illustration={
              <div className="w-20 h-20 bg-primary flex items-center justify-center">
                <MessageSquare className="w-10 h-10 text-primary-foreground" />
              </div>
            }
            textContent="Det du skriver till en AI kallas for en prompt. Ju tydligare och mer specifik din prompt ar, desto battre svar far du. Mindre bra exempel: Ge mig ett recept. Mycket battre: Ge mig ett enkelt vegetariskt recept som tar max 30 minuter att laga och anvander ingredienser jag troligen har hemma. Tips for battre prompts: Var specifik, beratta vad du vill ha. Ge kontext, forklara situationen. Ange format, till exempel punktlista, kort svar, eller steg-for-steg. Folj upp, be om fortydliganden eller andringar."
            content={
              <div className="space-y-6 text-foreground/80">
                <p>
                  Det du skriver till en AI kallas for en <strong className="text-foreground">prompt</strong>. 
                  Ju tydligare och mer specifik din prompt ar, desto battre svar far du.
                </p>
                
                <div className="space-y-4">
                  <div className="bg-destructive/10 p-5 border-l-4 border-destructive">
                    <p className="font-bold text-foreground mb-1 font-heading tracking-tight">MINDRE BRA</p>
                    <p className="italic">"Ge mig ett recept"</p>
                  </div>
                  
                  <div className="bg-primary/10 p-5 border-l-4 border-primary">
                    <p className="font-bold text-foreground mb-1 font-heading tracking-tight">MYCKET BATTRE</p>
                    <p className="italic">"Ge mig ett enkelt vegetariskt recept som tar max 30 minuter att laga och anvander ingredienser jag troligen har hemma"</p>
                  </div>
                </div>

                <div className="bg-secondary p-6">
                  <p className="text-foreground font-bold mb-4 font-heading tracking-tight">TIPS FOR BATTRE PROMPTS</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">01</span>
                      <span><strong>Var specifik</strong> — beratta vad du vill ha</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">02</span>
                      <span><strong>Ge kontext</strong> — forklara situationen</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">03</span>
                      <span><strong>Ange format</strong> — punktlista, kort svar, steg-for-steg</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">04</span>
                      <span><strong>Folj upp</strong> — be om fortydliganden eller andringar</span>
                    </li>
                  </ul>
                </div>
              </div>
            }
          />
        )

      case "learn-practice":
        return (
          <ChatStep
            type="learn"
            title="OVNING: SKRIV BATTRE FRAGOR"
            description="Nu ar det din tur! Prova att skriva en specifik, tydlig fraga."
            initialMessage="Bra! Nu ska vi ova. Prova att stalla en riktigt specifik fraga. Istallet for 'hjalp mig med ett mejl', skriv till exempel 'Hjalp mig skriva ett artigt mejl till min chef dar jag ber om semester vecka 28'."
            suggestedPrompts={[
              "Hjalp mig skriva ett tackbrev till min granne som vattnat mina blommor",
              "Ge mig 5 kreativa presenter under 300 kr till en 10-aring som gillar djur",
              "Forklara hur elbilar fungerar som om jag var 8 ar"
            ]}
            minMessages={2}
          />
        )

      case "learn-quiz":
        return (
          <QuizStep
            type="learn"
            title="SNABBKOLL"
            questions={[
              {
                question: "Vad ar det viktigaste for att fa bra svar fran en AI-chatt?",
                options: [
                  "Skriva pa engelska",
                  "Vara specifik och tydlig i sin fraga",
                  "Anvanda speciella kodord",
                  "Stalla samma fraga flera ganger"
                ],
                correctIndex: 1,
                explanation: "Ju mer specifik och tydlig din fraga ar, desto battre svar far du. AI forstar kontext och detaljer battre an vaga fragor."
              },
              {
                question: "Bor du alltid lita pa svaren fran en AI?",
                options: [
                  "Ja, AI har alltid ratt",
                  "Nej, dubbelkolla alltid viktig information",
                  "Bara om svaret later bra",
                  "Bara for enkla fragor"
                ],
                correctIndex: 1,
                explanation: "AI kan gora fel eller ge foraldrad information. Det ar alltid klokt att dubbelkolla viktig information fran andra kallor."
              }
            ]}
          />
        )

      case "learn-use-cases":
        return (
          <ContentStep
            type="learn"
            title="AI I VARDAGEN"
            illustration={
              <div className="w-20 h-20 bg-primary flex items-center justify-center">
                <Lightbulb className="w-10 h-10 text-primary-foreground" />
              </div>
            }
            textContent="Har ar nagra praktiska satt du kan anvanda AI i din vardag. Skrivhjalp: mejl, brev, ansokningar, tackmeddelanden. Forklaringar: fa komplicerade amnen forklarade pa enkelt satt. Planering: resor, fester, veckomenyer, traningsprogram. Ideer och kreativitet: presenter, aktiviteter, namn, recept. Larande: nya amnen, sprak, fardigheter. Kom ihag: Dela aldrig kanslig information som personnummer, losenord eller bankuppgifter med AI-chattar."
            content={
              <div className="space-y-6 text-foreground/80">
                <p className="text-foreground text-lg">
                  Har ar nagra praktiska satt du kan anvanda AI i din vardag:
                </p>
                
                <div className="grid gap-4">
                  <div className="bg-secondary p-5 border-l-4 border-primary">
                    <p className="font-bold text-foreground mb-1 font-heading tracking-tight">SKRIVHJALP</p>
                    <p>Mejl, brev, ansokningar, tackmeddelanden</p>
                  </div>
                  
                  <div className="bg-secondary p-5 border-l-4 border-primary">
                    <p className="font-bold text-foreground mb-1 font-heading tracking-tight">FORKLARINGAR</p>
                    <p>Fa komplicerade amnen forklarade pa enkelt satt</p>
                  </div>
                  
                  <div className="bg-secondary p-5 border-l-4 border-primary">
                    <p className="font-bold text-foreground mb-1 font-heading tracking-tight">PLANERING</p>
                    <p>Resor, fester, veckomenyer, traningsprogram</p>
                  </div>
                  
                  <div className="bg-secondary p-5 border-l-4 border-primary">
                    <p className="font-bold text-foreground mb-1 font-heading tracking-tight">IDEER OCH KREATIVITET</p>
                    <p>Presenter, aktiviteter, namn, recept</p>
                  </div>
                  
                  <div className="bg-secondary p-5 border-l-4 border-primary">
                    <p className="font-bold text-foreground mb-1 font-heading tracking-tight">LARANDE</p>
                    <p>Nya amnen, sprak, fardigheter</p>
                  </div>
                </div>

                <div className="bg-foreground text-background p-6 border-l-4 border-accent">
                  <p className="font-bold mb-2 font-heading tracking-tight">KOM IHAG</p>
                  <p>
                    Dela aldrig kanslig information som personnummer, losenord eller bankuppgifter med AI-chattar.
                  </p>
                </div>
              </div>
            }
          />
        )

      case "learn-tips":
        return (
          <ChecklistStep
            type="learn"
            title="TIPS ATT TA MED DIG"
            description="Har ar en checklista du kan spara och anvanda. Markera de tips du vill komma ihag!"
            items={[
              {
                id: "tip-1",
                text: "Var specifik i dina fragor",
                description: "Ju mer kontext du ger, desto battre svar far du"
              },
              {
                id: "tip-2",
                text: "Dubbelkolla viktig information",
                description: "AI kan gora fel — verifiera fakta fran andra kallor"
              },
              {
                id: "tip-3",
                text: "Dela aldrig kanslig information",
                description: "Undvik personnummer, losenord och bankuppgifter"
              },
              {
                id: "tip-4",
                text: "Folj upp med fler fragor",
                description: "Du kan be om fortydliganden eller andringar"
              },
              {
                id: "tip-5",
                text: "Anvand AI som ett komplement",
                description: "Det ersatter inte ditt eget omdome"
              }
            ]}
          />
        )

      case "learn-complete":
        return <CompleteStep type="learn" />

      default:
        return null
    }
  }

  return (
    <JourneyLayout type="learn">
      {renderStep()}
    </JourneyLayout>
  )
}

export default function LearnJourneyPage() {
  return (
    <JourneyProvider>
      <LearnJourneyContent />
    </JourneyProvider>
  )
}
