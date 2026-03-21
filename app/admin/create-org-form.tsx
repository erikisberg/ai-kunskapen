"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function CreateOrgForm({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [industry, setIndustry] = useState("")
  const [description, setDescription] = useState("")
  const [employeeCount, setEmployeeCount] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    const res = await fetch("/api/admin/org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        industry: industry || undefined,
        description: description || undefined,
        employeeCount: employeeCount ? parseInt(employeeCount) : undefined,
      }),
    })

    if (res.ok) {
      router.refresh()
      onClose()
    } else {
      const data = await res.json()
      setError(data.error || "Något gick fel")
    }
    setSaving(false)
  }

  return (
    <div className="border border-border rounded-xl p-6 bg-card mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-lg">Ny organisation</h2>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Företagsnamn *"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground"
        />
        <input
          type="text"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          placeholder="Bransch (t.ex. Bygg, Vård, IT, Finans)"
          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Kort beskrivning — används för att anpassa AI-svar till branschen"
          rows={2}
          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm resize-y"
        />
        <input
          type="number"
          value={employeeCount}
          onChange={(e) => setEmployeeCount(e.target.value)}
          placeholder="Antal anställda (ungefär)"
          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Avbryt
          </button>
          <button
            type="submit"
            disabled={!name.trim() || saving}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-medium transition-all",
              name.trim() && !saving
                ? "bg-primary text-primary-foreground hover:scale-[1.03] active:scale-[0.98]"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {saving ? "Sparar..." : "Skapa"}
          </button>
        </div>
      </form>
    </div>
  )
}
