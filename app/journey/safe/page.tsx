"use client"

import { useEffect } from "react"
import { JourneyProvider, useJourney } from "@/lib/journey-context"
import { JourneyLayout } from "@/components/journey/journey-layout"
import { IntroStep } from "@/components/journey/steps/intro-step"
import { ContentStep } from "@/components/journey/steps/content-step"
import { ScenarioStep } from "@/components/journey/steps/scenario-step"
import { QuizStep } from "@/components/journey/steps/quiz-step"
import { ChecklistStep } from "@/components/journey/steps/checklist-step"
import { CompleteStep } from "@/components/journey/steps/complete-step"
import { AlertTriangle, Eye, Shield, Video } from "lucide-react"

function SafeJourneyContent() {
  const { progress, setJourneyType } = useJourney()

  useEffect(() => {
    setJourneyType("safe")
  }, [setJourneyType])

  const currentStep = progress.steps[progress.currentStep]

  if (!currentStep) return null

  const renderStep = () => {
    switch (currentStep.id) {
      case "safe-intro":
        return <IntroStep type="safe" />
      
      case "safe-threats":
        return (
          <ContentStep
            type="safe"
            title="AI-HOT I VARDAGEN"
            illustration={
              <div className="w-20 h-20 bg-foreground flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-accent" />
              </div>
            }
            textContent="Samma teknik som gor AI anvandbar kan ocksa missbrukas av bedragare. Det ar inget att vara radd for, men det ar bra att veta vad man ska se upp med. De vanligaste AI-hoten ar: Deepfakes, falska video- och ljudklipp som ser och later akta ut. Rostbedragerier, AI som imiterar rosten av nagon du kanner. AI-genererade mejl, overtygande bluffmejl utan stavfel. I de kommande stegen far du trana pa att kanna igen dessa hot genom verklighetstrogna scenarion."
            content={
              <div className="space-y-6 text-foreground/80">
                <p>
                  Samma teknik som gor AI anvandbar kan ocksa missbrukas av bedragare. 
                  <strong className="text-foreground"> Det ar inget att vara radd for</strong> — men det ar bra att veta vad man ska se upp med.
                </p>
                
                <div className="bg-foreground text-background p-6 border-l-4 border-accent">
                  <p className="font-bold mb-4 font-heading tracking-tight">DE VANLIGASTE AI-HOTEN</p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4">
                      <span className="w-8 h-8 bg-accent text-foreground flex items-center justify-center font-bold flex-shrink-0">1</span>
                      <div>
                        <strong>Deepfakes</strong>
                        <p className="text-background/70">Falska video- och ljudklipp som ser/later akta ut</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="w-8 h-8 bg-accent text-foreground flex items-center justify-center font-bold flex-shrink-0">2</span>
                      <div>
                        <strong>Rostbedragerier</strong>
                        <p className="text-background/70">AI som imiterar rosten av nagon du kanner</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="w-8 h-8 bg-accent text-foreground flex items-center justify-center font-bold flex-shrink-0">3</span>
                      <div>
                        <strong>AI-genererade mejl</strong>
                        <p className="text-background/70">Overtygande bluffmejl utan stavfel</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <p>
                  I de kommande stegen far du trana pa att kanna igen dessa hot genom verklighetstrogna scenarion.
                </p>
              </div>
            }
          />
        )

      case "safe-deepfakes":
        return (
          <ContentStep
            type="safe"
            title="VAD AR DEEPFAKES?"
            illustration={
              <div className="w-20 h-20 bg-foreground flex items-center justify-center">
                <Video className="w-10 h-10 text-accent" />
              </div>
            }
            textContent="Deepfakes ar falska video- eller ljudklipp skapade med AI. Tekniken kan fa det att se ut som att nagon sager eller gor nagot de aldrig gjort. Sa fungerar det: AI analyserar tusentals bilder eller ljud av en person och lar sig sedan att skapa nya, falska versioner som ser eller later valdigt overtygande. Varningssignaler inkluderar: Onaturliga ogonrorelser eller blinkningar. Lappar som inte riktigt synkar med ljudet. Konstig belysning eller skuggor i ansiktet. Suddig eller pixlig kant runt ansiktet. Det viktigaste: Om nagot kanns for bra, for daligt eller for konstigt for att vara sant, dubbelkolla!"
            content={
              <div className="space-y-6 text-foreground/80">
                <p>
                  <strong className="text-foreground">Deepfakes</strong> ar falska video- eller ljudklipp skapade med AI. 
                  Tekniken kan fa det att se ut som att nagon sager eller gor nagot de aldrig gjort.
                </p>

                <div className="bg-secondary p-6 border-l-4 border-primary">
                  <p className="text-foreground font-bold mb-3 font-heading tracking-tight">SA FUNGERAR DET</p>
                  <p>
                    AI analyserar tusentals bilder eller ljud av en person och lar sig sedan att skapa nya, 
                    falska versioner som ser eller later valdigt overtygande.
                  </p>
                </div>

                <div className="bg-foreground text-background p-6 border-l-4 border-accent">
                  <p className="font-bold mb-4 font-heading tracking-tight">VARNINGSSIGNALER</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Eye className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span>Onaturliga ogonrorelser eller blinkningar</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Eye className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span>Lappar som inte riktigt synkar med ljudet</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Eye className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span>Konstig belysning eller skuggor i ansiktet</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Eye className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span>Suddig eller pixlig kant runt ansiktet</span>
                    </li>
                  </ul>
                </div>

                <p className="text-foreground font-bold text-lg">
                  Det viktigaste: Om nagot kanns for bra, for daligt eller for konstigt for att vara sant — dubbelkolla!
                </p>
              </div>
            }
          />
        )

      case "safe-scenario-call":
        return (
          <ScenarioStep
            type="safe"
            title="SCENARIO: SAMTALET"
            description="Detta ar en ovning — inget av detta ar pa riktigt"
            scenarioType="call"
            scenarioContent={
              <div className="space-y-4">
                <p className="text-foreground italic text-lg">
                  "Mamma! Det ar jag, Lisa. Jag har rakat ut for en olycka och behover pengar till sjukhusrakningen. 
                  Kan du swisha 15 000 kr nu direkt? Det ar jattebråttom!"
                </p>
                <p className="text-foreground/60">
                  Rosten later exakt som din dotter. Hon later stressad och radd.
                </p>
              </div>
            }
            question="Vad gor du?"
            choices={[
              {
                text: "Swisha pengarna direkt — min dotter behover hjalp!",
                isCorrect: false,
                feedback: "Detta ar precis vad bedragare hoppas pa. Panik far oss att agera utan att tanka. AI kan numera imitera roster nastan perfekt."
              },
              {
                text: "Lagg pa och ring tillbaka pa Lisas vanliga nummer",
                isCorrect: true,
                feedback: "Precis ratt! Genom att ringa tillbaka pa numret du vet ar ratt, kan du verifiera om det verkligen var Lisa. Bedragare kan fejka numret som visas, men kan inte ta emot samtal pa offrets riktiga nummer."
              },
              {
                text: "Fraga om nagot bara du och Lisa vet",
                isCorrect: false,
                feedback: "Bra tanke, men bedragare kan ha hittat personlig information pa sociala medier. Det sakraste ar alltid att ringa tillbaka pa ett nummer du vet ar ratt."
              }
            ]}
          />
        )

      case "safe-scams":
        return (
          <ContentStep
            type="safe"
            title="AI-GENERERADE BEDRAGERIER"
            illustration={
              <div className="w-20 h-20 bg-foreground flex items-center justify-center">
                <Shield className="w-10 h-10 text-accent" />
              </div>
            }
            textContent="Forr kunde man ofta kanna igen bluffmejl pa dalig svenska och konstiga formuleringar. Med AI har det blivit mycket svarare, texterna ar nu valskrivna och overtygande. Nya typer av AI-bedragerier inkluderar: Personliga phishing-mejl baserade pa din aktivitet online. Falska kundtjanst-chattar som verkar helt akta. Automatiserade telefonsamtal med AI-rost. Falska nyhetsartiklar och sociala medier-konton. Gyllene regeln: Om nagon du inte kanner, eller som pastar sig vara fran en myndighet eller bank, ber om pengar, losenord eller personuppgifter, stanna upp och verifiera. Ring tillbaka pa officiellt nummer som du sjalv soker fram."
            content={
              <div className="space-y-6 text-foreground/80">
                <p>
                  Forr kunde man ofta kanna igen bluffmejl pa dalig svenska och konstiga formuleringar. 
                  <strong className="text-foreground"> Med AI har det blivit mycket svarare</strong> — texterna ar nu valskrivna och overtygande.
                </p>

                <div className="bg-foreground text-background p-6 border-l-4 border-accent">
                  <p className="font-bold mb-4 font-heading tracking-tight">NYA TYPER AV AI-BEDRAGERIER</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="text-accent font-bold">01</span>
                      <span>Personliga phishing-mejl baserade pa din aktivitet online</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent font-bold">02</span>
                      <span>Falska kundtjanst-chattar som verkar helt akta</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent font-bold">03</span>
                      <span>Automatiserade telefonsamtal med AI-rost</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent font-bold">04</span>
                      <span>Falska nyhetsartiklar och sociala medier-konton</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-primary p-6 text-primary-foreground">
                  <p className="font-bold mb-3 font-heading tracking-tight">GYLLENE REGELN</p>
                  <p>
                    Om nagon du inte kanner, eller som pastar sig vara fran en myndighet eller bank, 
                    ber om pengar, losenord eller personuppgifter — <strong>stanna upp och verifiera</strong>. 
                    Ring tillbaka pa officiellt nummer som du sjalv soker fram.
                  </p>
                </div>
              </div>
            }
          />
        )

      case "safe-scenario-email":
        return (
          <ScenarioStep
            type="safe"
            title="SCENARIO: MEJLET"
            description="Detta ar en ovning — inget av detta ar pa riktigt"
            scenarioType="email"
            scenarioContent={
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm border-b border-border pb-3">
                  <span className="font-medium text-foreground">Fran: kundsupport@sweedbank-online.se</span>
                </div>
                <p className="font-bold text-foreground text-lg">Viktigt: Verifiera ditt konto</p>
                <div className="space-y-3 text-foreground/80">
                  <p>Hej,</p>
                  <p>
                    Vi har upptackt ovanlig aktivitet pa ditt konto. For din sakerhet har vi tillfalligt 
                    begransat atkomsten. Vanligen verifiera din identitet genom att klicka pa lanken nedan 
                    inom 24 timmar, annars stangs kontot permanent.
                  </p>
                  <p className="text-primary underline font-medium">
                    Verifiera mitt konto
                  </p>
                  <p>
                    Med vanlig halsning,<br />
                    Sakerhetsavdelningen, Swedbank
                  </p>
                </div>
              </div>
            }
            question="Vad gor du?"
            choices={[
              {
                text: "Klicka pa lanken for att verifiera — det ar brattom!",
                isCorrect: false,
                feedback: "Stopp! Titta pa avsandaren: 'sweedbank-online.se' ar inte Swedbanks riktiga doman. Bedragare skapar ofta liknande adresser med sma stavfel."
              },
              {
                text: "Logga in pa bankens app eller webbplats direkt (utan att klicka pa lanken)",
                isCorrect: true,
                feedback: "Helt ratt! Om det finns ett verkligt problem med ditt konto kommer du se det nar du loggar in direkt. Klicka aldrig pa lankar i mejl som handlar om pengar eller konton."
              },
              {
                text: "Svara pa mejlet och fraga om det ar akta",
                isCorrect: false,
                feedback: "Bedragare kan bekrafta sina egna bluffmejl. Kontakta alltid banken genom officiella kanaler — app, webbplats eller telefonnummer du hittar sjalv."
              }
            ]}
          />
        )

      case "safe-quiz":
        return (
          <QuizStep
            type="safe"
            title="SNABBKOLL"
            questions={[
              {
                question: "Nagon ringer och later precis som din son. Han ber om pengar akut. Vad ar sakrast?",
                options: [
                  "Swisha pengarna — han lat stressad",
                  "Lagg pa och ring tillbaka pa hans vanliga nummer",
                  "Be honom bevisa att det ar han genom att beratta nagot personligt",
                  "Spela in samtalet som bevis"
                ],
                correctIndex: 1,
                explanation: "AI kan imitera roster mycket overtygande. Det enda sakra sattet att verifiera ar att ringa tillbaka pa ett nummer du vet ar ratt."
              },
              {
                question: "Hur kan du kanna igen en potentiell deepfake-video?",
                options: [
                  "Den ar alltid i svartvitt",
                  "Onaturliga ogonrorelser eller lappar som inte synkar",
                  "Den har alltid daligt ljud",
                  "Det gar inte att se skillnad"
                ],
                correctIndex: 1,
                explanation: "Deepfakes har ofta subtila fel som onaturliga ogonrorelser, lappar som inte riktigt synkar med ljudet, eller konstig belysning i ansiktet."
              },
              {
                question: "Du far ett valskrivet mejl fran 'din bank' som ber dig klicka pa en lank. Vad gor du?",
                options: [
                  "Klicka pa lanken — mejlet ser professionellt ut",
                  "Ignorera mejlet helt",
                  "Ga direkt till bankens app/webbplats utan att klicka pa lanken",
                  "Svara och fraga om det ar akta"
                ],
                correctIndex: 2,
                explanation: "Logga alltid in direkt pa bankens app eller webbplats istallet for att klicka pa lankar i mejl. Om det finns ett verkligt problem ser du det dar."
              }
            ]}
          />
        )

      case "safe-protect":
        return (
          <ChecklistStep
            type="safe"
            title="SKYDDA DIG OCH DIN FAMILJ"
            description="Spara den har checklistan! Markera de tips du vill komma ihag."
            items={[
              {
                id: "protect-1",
                text: "Ring alltid tillbaka pa kanda nummer",
                description: "Om nagon ringer och ber om pengar eller information — lagg pa och ring tillbaka"
              },
              {
                id: "protect-2",
                text: "Klicka aldrig pa lankar i ovantade mejl",
                description: "Ga istallet direkt till organisationens webbplats eller app"
              },
              {
                id: "protect-3",
                text: "Ha ett hemligt kodord med familjen",
                description: "Ett ord ni kan fraga efter for att verifiera att det verkligen ar ratt person"
              },
              {
                id: "protect-4",
                text: "Dela mindre pa sociala medier",
                description: "Bedragare anvander information fran dina profiler for att gora bluffar mer trovardiga"
              },
              {
                id: "protect-5",
                text: "Prata med aldre slaktingar",
                description: "Forklara att AI kan imitera roster — de kan vara extra utsatta for rostbedragerier"
              },
              {
                id: "protect-6",
                text: "Om det kanns fel — stanna upp",
                description: "Bedragare skapar stress. Ta ett djupt andetag och verifiera innan du agerar"
              }
            ]}
          />
        )

      case "safe-complete":
        return <CompleteStep type="safe" />

      default:
        return null
    }
  }

  return (
    <JourneyLayout type="safe">
      {renderStep()}
    </JourneyLayout>
  )
}

export default function SafeJourneyPage() {
  return (
    <JourneyProvider>
      <SafeJourneyContent />
    </JourneyProvider>
  )
}
