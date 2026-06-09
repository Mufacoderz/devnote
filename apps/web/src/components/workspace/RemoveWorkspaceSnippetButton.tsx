"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface RemoveWorkspaceSnippetButtonProps {
  workspaceId: number
  snippetId: number
  variant?: "desktop" | "mobile"
}

export default function RemoveWorkspaceSnippetButton({
  workspaceId,
  snippetId,
  variant = "desktop",
}: RemoveWorkspaceSnippetButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const removeSnippet = async () => {
    const ok = window.confirm(
      "Remove snippet dari workspace ini? Snippet asli tetap ada di library owner."
    )

    if (!ok) return

    setLoading(true)

    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/snippets/${snippetId}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        alert("Gagal remove snippet dari workspace")
        return
      }

      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={removeSnippet}
      disabled={loading}
      className={
        variant === "mobile"
          ? "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[12px] text-red-400 hover:bg-[var(--surface2)] disabled:opacity-60"
          : "rounded-lg border border-red-500/30 px-4 py-2 text-[13px] font-medium text-red-400 transition-all hover:border-red-500/60 hover:bg-red-500/10 disabled:opacity-60"
      }
    >
      {loading ? "Removing..." : "Remove from workspace"}
    </button>
  )
}
