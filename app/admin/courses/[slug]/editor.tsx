"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, ChevronDown, ChevronRight, Trash2, GripVertical, MessageCircle, HelpCircle, ListChecks, FileText, Bot, Workflow, ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { SlideEditor } from "./slide-editor"

interface Slide {
  id: string
  type: string
  heading: string
  body_text: string
  sort_order: number
  video_url?: string | null
  llm_system_prompt?: string | null
  llm_instruction_text?: string | null
  llm_max_messages?: number | null
  quiz_options?: any[]
  scenario_choices?: any[]
  checklist_items?: any[]
}

interface Module {
  id: string
  title: string
  slug: string
  sort_order: number
  slides: Slide[]
}

const SLIDE_TYPES = [
  { value: "info", label: "Innehåll", icon: FileText, description: "Text + valfri video" },
  { value: "llm_chat", label: "AI-chatt", icon: Bot, description: "Interaktiv chatt med AI" },
  { value: "quiz", label: "Quiz", icon: HelpCircle, description: "Flervalsfråga" },
  { value: "scenario", label: "Scenario", icon: MessageCircle, description: "Situationsval med feedback" },
  { value: "checklist", label: "Checklista", icon: ListChecks, description: "Kryssa av punkter" },
  { value: "flow", label: "Flöde", icon: Workflow, description: "Steg-för-steg visualisering" },
]

function getSlideIcon(type: string) {
  const t = SLIDE_TYPES.find((s) => s.value === type)
  return t ? t.icon : FileText
}

function getSlideLabel(type: string) {
  const t = SLIDE_TYPES.find((s) => s.value === type)
  return t ? t.label : type
}

export function CourseEditor({ courseId, courseSlug, courseStatus, modules: initialModules }: {
  courseId: string
  courseSlug: string
  courseStatus: string
  modules: Module[]
}) {
  const router = useRouter()
  const [modules, setModules] = useState(initialModules)
  const [status, setStatus] = useState(courseStatus)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(initialModules.map(m => m.id)))
  const [editingSlide, setEditingSlide] = useState<string | null>(null)
  const [addingModule, setAddingModule] = useState(false)
  const [newModuleTitle, setNewModuleTitle] = useState("")
  const [addingSlideToModule, setAddingSlideToModule] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleToggleStatus = async () => {
    const newStatus = status === "published" ? "draft" : "published"
    setSaving(true)
    await fetch(`/api/admin/courses/${courseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    setStatus(newStatus)
    setSaving(false)
  }

  const toggleModule = (id: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) return
    setSaving(true)
    const res = await fetch(`/api/admin/courses/${courseId}/modules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newModuleTitle, sort_order: modules.length }),
    })
    if (res.ok) {
      setNewModuleTitle("")
      setAddingModule(false)
      router.refresh()
      // Optimistic: re-fetch
      window.location.reload()
    }
    setSaving(false)
  }

  const handleAddSlide = async (moduleId: string, type: string) => {
    setSaving(true)
    const mod = modules.find(m => m.id === moduleId)
    const res = await fetch("/api/admin/slides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        module_id: moduleId,
        type,
        heading: "Ny slide",
        sort_order: mod?.slides.length || 0,
      }),
    })
    if (res.ok) {
      setAddingSlideToModule(null)
      window.location.reload()
    }
    setSaving(false)
  }

  const handleDeleteSlide = async (slideId: string) => {
    if (!confirm("Ta bort denna slide?")) return
    await fetch(`/api/admin/slides/${slideId}`, { method: "DELETE" })
    window.location.reload()
  }

  const handleSaveSlide = async (slideId: string, data: any) => {
    setSaving(true)
    await fetch(`/api/admin/slides/${slideId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    setSaving(false)
    setEditingSlide(null)
    window.location.reload()
  }

  return (
    <div className="space-y-4">
      {/* Status bar */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
        <div className="flex items-center gap-3">
          <span className={cn(
            "text-xs font-medium px-2.5 py-1 rounded-full",
            status === "published"
              ? "bg-green-500/10 text-green-600"
              : "bg-amber-500/10 text-amber-600"
          )}>
            {status === "published" ? "Publicerad" : "Draft"}
          </span>
          <span className="text-xs text-muted-foreground">
            {status === "draft"
              ? "Kursen syns inte publikt. Dela via direktlänk."
              : "Kursen är synlig för användare som slutfört de 2 grundkurserna."}
          </span>
        </div>
        <button
          onClick={handleToggleStatus}
          disabled={saving}
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-medium transition-all",
            status === "published"
              ? "border border-border hover:bg-secondary"
              : "bg-green-500 text-white hover:bg-green-600"
          )}
        >
          {status === "published" ? "Gör till draft" : "Publicera"}
        </button>
      </div>

      {modules.map((mod, mi) => (
        <div key={mod.id} className="border border-border rounded-xl bg-card overflow-hidden">
          {/* Module header */}
          <button
            onClick={() => toggleModule(mod.id)}
            className="w-full flex items-center gap-3 p-4 hover:bg-secondary/30 transition-colors text-left"
          >
            {expandedModules.has(mod.id) ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-muted-foreground">{String(mi + 1).padStart(2, "0")}</span>
                <h3 className="font-semibold truncate">{mod.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground">{mod.slides.length} slides</p>
            </div>
          </button>

          {/* Slides list */}
          {expandedModules.has(mod.id) && (
            <div className="border-t border-border">
              {mod.slides
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((slide, si) => {
                  const Icon = getSlideIcon(slide.type)
                  const isEditing = editingSlide === slide.id

                  return (
                    <div key={slide.id} className="border-b border-border last:border-0">
                      {/* Slide row */}
                      <div
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-secondary/20 transition-colors",
                          isEditing && "bg-primary/5"
                        )}
                        onClick={() => setEditingSlide(isEditing ? null : slide.id)}
                      >
                        <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{slide.heading}</p>
                          <p className="text-[10px] text-muted-foreground">{getSlideLabel(slide.type)}</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteSlide(slide.id) }}
                          className="w-7 h-7 rounded-md hover:bg-destructive/10 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>

                      {/* Slide editor */}
                      {isEditing && (
                        <div className="px-4 pb-4 pt-2 bg-secondary/10">
                          <SlideEditor
                            slide={slide}
                            onSave={(data) => handleSaveSlide(slide.id, data)}
                            onCancel={() => setEditingSlide(null)}
                            saving={saving}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}

              {/* Add slide button */}
              {addingSlideToModule === mod.id ? (
                <div className="p-4 bg-secondary/10">
                  <p className="text-xs font-medium text-muted-foreground mb-3">Välj slide-typ:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {SLIDE_TYPES.map((st) => {
                      const Icon = st.icon
                      return (
                        <button
                          key={st.value}
                          onClick={() => handleAddSlide(mod.id, st.value)}
                          disabled={saving}
                          className="flex items-center gap-2 p-3 rounded-lg border border-border bg-background hover:border-primary/30 hover:bg-primary/5 transition-colors text-left"
                        >
                          <Icon className="w-4 h-4 text-primary shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{st.label}</p>
                            <p className="text-[10px] text-muted-foreground">{st.description}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  <button
                    onClick={() => setAddingSlideToModule(null)}
                    className="mt-2 text-xs text-muted-foreground hover:underline"
                  >
                    Avbryt
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAddingSlideToModule(mod.id)}
                  className="w-full flex items-center justify-center gap-2 p-3 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Lägg till slide
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Add module */}
      {addingModule ? (
        <div className="border border-border rounded-xl p-4 bg-card space-y-3">
          <input
            type="text"
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
            placeholder="Modultitel (t.ex. 'Vad är AI?')"
            autoFocus
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background"
            onKeyDown={(e) => e.key === "Enter" && handleAddModule()}
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setAddingModule(false)} className="px-4 py-2 text-sm text-muted-foreground">Avbryt</button>
            <button
              onClick={handleAddModule}
              disabled={!newModuleTitle.trim() || saving}
              className="px-5 py-2 rounded-full text-sm font-medium bg-primary text-primary-foreground disabled:bg-muted disabled:text-muted-foreground"
            >
              Skapa modul
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAddingModule(true)}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          <Plus className="w-4 h-4" />
          Lägg till modul
        </button>
      )}
    </div>
  )
}
