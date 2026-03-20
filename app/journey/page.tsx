"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BookOpen, Shield, ArrowRight, Clock, Sparkles, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function JourneySelectPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <Link href="/">
                <ArrowLeft className="w-5 h-5" />
                <span className="sr-only">Tillbaka</span>
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">AI-skolan</span>
            </div>
            <div className="w-10" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold mb-4">Välj din resa</h1>
          <p className="text-muted-foreground text-lg">
            Varje resa tar ungefär 20 minuter. Du kan pausa och fortsätta när du vill.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Learn Journey */}
          <Link href="/journey/learn" className="block group">
            <Card className="h-full border-2 border-border hover:border-journey-learn transition-all duration-300 hover:shadow-lg hover:shadow-journey-learn/10">
              <CardContent className="p-8">
                <div className="w-20 h-20 rounded-3xl bg-journey-learn/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-10 h-10 text-journey-learn" />
                </div>
                
                <h2 className="text-2xl font-semibold mb-3">Använd AI i vardagen</h2>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Lär dig prata med AI-chatbotar, skriva effektiva frågor och få hjälp med vardagliga uppgifter.
                </p>

                <ul className="space-y-2 mb-8 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-journey-learn" />
                    <span>Grunderna i AI-chattar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-journey-learn" />
                    <span>Skriv bättre frågor (prompts)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-journey-learn" />
                    <span>Praktiska övningar</span>
                  </li>
                </ul>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>ca 20 min</span>
                  </div>
                  <div className="flex items-center gap-2 text-journey-learn font-medium group-hover:gap-3 transition-all">
                    <span>Starta</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Safety Journey */}
          <Link href="/journey/safe" className="block group">
            <Card className="h-full border-2 border-border hover:border-journey-safe transition-all duration-300 hover:shadow-lg hover:shadow-journey-safe/10">
              <CardContent className="p-8">
                <div className="w-20 h-20 rounded-3xl bg-journey-safe/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-10 h-10 text-journey-safe" />
                </div>
                
                <h2 className="text-2xl font-semibold mb-3">Skydda dig mot AI-hot</h2>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Lär dig känna igen deepfakes, AI-bedrägerier och skydda dig och din familj.
                </p>

                <ul className="space-y-2 mb-8 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-journey-safe" />
                    <span>Vad är deepfakes?</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-journey-safe" />
                    <span>Realistiska bedrägeriscenarier</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-journey-safe" />
                    <span>Praktiska skyddstips</span>
                  </li>
                </ul>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>ca 20 min</span>
                  </div>
                  <div className="flex items-center gap-2 text-journey-safe font-medium group-hover:gap-3 transition-all">
                    <span>Starta</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}
