"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, BookOpen, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingClientProps {
  userName: string | null;
  orgName: string | null;
  userId: string;
}

export function OnboardingClient({
  userName,
  orgName,
  userId,
}: OnboardingClientProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFinish = async () => {
    setSaving(true);
    await fetch("/api/onboarding/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    router.push(
      selectedCourse === "learn" ? "/journey/learn" : "/journey/safe"
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-lg px-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-[family-name:var(--font-display)]">
                  AI
                </span>
              </div>

              <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl uppercase tracking-[-0.03em] mb-4 leading-[1.1]">
                Valkomm{userName ? `en, ${userName}` : "en"}!
              </h1>

              {orgName && (
                <p className="text-lg text-muted-foreground mb-2">
                  <span className="font-semibold text-foreground">
                    {orgName}
                  </span>{" "}
                  har bjudit in dig att lara dig om AI.
                </p>
              )}

              <p className="text-muted-foreground mb-10 max-w-sm mx-auto">
                Pa 20 minuter far du praktisk kunskap om hur AI fungerar och hur
                du skyddar dig mot nya hot.
              </p>

              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-medium hover:scale-[1.03] active:scale-[0.98] transition-all"
              >
                Kom igang
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl uppercase tracking-[-0.03em] mb-2 text-center leading-[1.1]">
                Valj din forsta kurs
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                Du kan alltid byta eller gora bada senare.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => setSelectedCourse("learn")}
                  className={cn(
                    "w-full text-left p-5 rounded-xl border-2 transition-all",
                    selectedCourse === "learn"
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                        selectedCourse === "learn"
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/10 text-primary"
                      )}
                    >
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Lar dig anvanda AI
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Praktisk guide till hur AI fungerar, hur du anvander den
                        i vardagen och pa jobbet. Ca 20 min.
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedCourse("safe")}
                  className={cn(
                    "w-full text-left p-5 rounded-xl border-2 transition-all",
                    selectedCourse === "safe"
                      ? "border-accent bg-accent/5 shadow-sm"
                      : "border-border hover:border-accent/30"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                        selectedCourse === "safe"
                          ? "bg-accent text-accent-foreground"
                          : "bg-accent/10 text-foreground"
                      )}
                    >
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Forsta risken med AI
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Deepfakes, AI-bedragerier och hur du skyddar dig. Baserat
                        pa verkliga fall. Ca 20 min.
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleFinish}
                  disabled={!selectedCourse || saving}
                  className={cn(
                    "inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-medium transition-all",
                    selectedCourse
                      ? "bg-primary text-primary-foreground hover:scale-[1.03] active:scale-[0.98]"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  {saving ? "Sparar..." : "Borja kursen"}
                  {!saving && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {[0, 1].map((s) => (
            <div
              key={s}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                s === step ? "w-8 bg-primary" : "w-1.5 bg-foreground/10"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
