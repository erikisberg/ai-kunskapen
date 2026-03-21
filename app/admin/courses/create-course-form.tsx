"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export function CreateCourseForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [saving, setSaving] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    })

    if (res.ok) {
      const { course } = await res.json()
      router.push(`/admin/courses/${course.slug}`)
    }
    setSaving(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
      >
        <Plus className="w-4 h-4" />
        Skapa ny kurs
      </button>
    )
  }

  return (
    <form onSubmit={handleCreate} className="border border-border rounded-xl p-5 bg-card space-y-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Kurstitel"
        autoFocus
        required
        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Kort beskrivning"
        rows={2}
        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground text-sm resize-y"
      />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-full text-sm text-muted-foreground">
          Avbryt
        </button>
        <button
          type="submit"
          disabled={!title.trim() || saving}
          className={cn(
            "px-5 py-2 rounded-full text-sm font-medium transition-all",
            title.trim() && !saving ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {saving ? "Skapar..." : "Skapa kurs"}
        </button>
      </div>
    </form>
  )
}
