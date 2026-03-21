import Link from "next/link"
import { ArrowLeft, Building2, Mail, Users, Heart, CheckCircle2 } from "lucide-react"

export default function KontaktPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link href="/" className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="font-[family-name:var(--font-display)] text-lg uppercase">AI-kunskapen</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl uppercase tracking-[-0.03em] mb-4 leading-[1.1]">
            Utbilda ditt <span className="text-primary">team</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Vi sätter upp allt åt er. Ni behöver bara skicka oss en mejllista
            — resten tar vi hand om.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-12">
          {[
            {
              step: "1",
              icon: Mail,
              title: "Kontakta oss",
              description: "Berätta om ert företag och hur många anställda ni vill utbilda. Vi anpassar kurserna efter er bransch.",
            },
            {
              step: "2",
              icon: Building2,
              title: "Vi sätter upp allt",
              description: "Vi skapar er organisation, konfigurerar kurserna och skickar ut inbjudningar till era anställda.",
            },
            {
              step: "3",
              icon: Users,
              title: "Era anställda får en unik länk",
              description: "Varje person får ett mejl med en personlig länk. Ett klick — inga lösenord, ingen registrering.",
            },
            {
              step: "4",
              icon: Heart,
              title: "Bidraget går till välgörenhet",
              description: "200 kr per anställd som slutför minst en kurs. Hela beloppet går till en organisation ni väljer tillsammans med oss.",
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.step} className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-primary">Steg {item.step}</span>
                    <h3 className="font-semibold">{item.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-primary p-8 text-primary-foreground text-center mb-12">
          <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase mb-3">
            Redo att börja?
          </h2>
          <p className="text-primary-foreground/70 mb-6 max-w-sm mx-auto text-sm">
            Skicka ett mejl så återkommer vi inom 24 timmar med en plan för ert team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:erik@adeprimo.se?subject=AI-kunskapen%20f%C3%B6r%20v%C3%A5rt%20f%C3%B6retag"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Kontakta oss
            </a>
          </div>
        </div>

        {/* FAQ mini */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Vanliga frågor</h3>
          {[
            { q: "Vad kostar det?", a: "200 kr per anställd som slutför kursen. Inget mer. Hela beloppet går till välgörenhet." },
            { q: "Måste alla göra båda kurserna?", a: "Nej, varje anställd väljer själv. Bidraget räknas när minst en kurs är slutförd." },
            { q: "Hur lång tid tar det?", a: "Ca 20 minuter per kurs. Går att pausa och fortsätta." },
            { q: "Kan vi testa innan?", a: "Ja — kontakta oss så sätter vi upp ett testkonto med 2-3 inbjudningar." },
          ].map((item, i) => (
            <div key={i} className="border-t border-border pt-4">
              <p className="font-medium text-sm mb-1">{item.q}</p>
              <p className="text-sm text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
