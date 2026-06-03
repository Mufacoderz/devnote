"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface RemoveWorkspaceSnippetButtonProps {
  workspaceId: number
  snippetId: number
}

export default function RemoveWorkspaceSnippetButton({
  workspaceId,
  snippetId,
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
      className="text-xs text-red-400 hover:text-red-300 disabled:opacity-60"
    >
      {loading ? "Removing..." : "Remove from workspace"}
    </button>
  )
}