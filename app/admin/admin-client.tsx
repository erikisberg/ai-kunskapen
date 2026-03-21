"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Building2 } from "lucide-react"
import { CreateOrgForm } from "./create-org-form"

export function AdminHeader() {
  const [showCreate, setShowCreate] = useState(false)

  return (
    <>
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-[family-name:var(--font-display)] text-xl uppercase">
              AI-kunskapen
            </Link>
            <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-secondary transition-colors"
            >
              <Building2 className="w-4 h-4" />
              Ny org
            </button>
            <Link
              href="/admin/invite"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4" />
              Bjud in
            </Link>
          </div>
        </div>
      </header>

      {showCreate && (
        <div className="max-w-5xl mx-auto px-6 pt-6">
          <CreateOrgForm onClose={() => setShowCreate(false)} />
        </div>
      )}
    </>
  )
}
