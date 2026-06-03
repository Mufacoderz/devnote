"use client"

import { useState } from "react"
import SnippetCard from "@/components/snippet/SnippetCard"
import SnippetDetail, { type Snippet } from "@/components/snippet/SnippetDetail"
import RemoveWorkspaceSnippetButton from "@/components/workspace/RemoveWorkspaceSnippetButton"

interface WorkspaceSnippetItem {
  workspaceId: number
  snippetId: number
  snippet: Snippet
  authorName: string
}

interface WorkspaceSnippetPanelProps {
  workspaceId: number
  snippets: WorkspaceSnippetItem[]
  canEdit: boolean
}

export default function WorkspaceSnippetPanel({
  workspaceId,
  snippets,
  canEdit,
}: WorkspaceSnippetPanelProps) {
  const [selectedId, setSelectedId] = useState<number | null>(
    snippets[0]?.snippet.id ?? null
  )

  const selectedItem =
    snippets.find((item) => item.snippet.id === selectedId) ??
    snippets[0] ??
    null

  const selected = selectedItem?.snippet ?? null

  if (snippets.length === 0) {
    return null
  }

  return (
    <div className="flex-1 min-h-0 overflow-hidden flex bg-[var(--surface)]">
      <aside className="w-[320px] shrink-0 border-r border-[var(--border)] flex flex-col min-h-0">
        <div className="px-4 py-3 border-b border-[var(--border)] shrink-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold tracking-[1.4px] uppercase text-[var(--text3)]">
              Shared Snippets
            </p>

            <span className="font-mono text-[10px] text-[var(--text4)] bg-[var(--surface2)] px-2 py-[2px] rounded-full">
              {snippets.length}
            </span>
          </div>

          <p className="text-[11px] text-[var(--text4)] mt-1">
            Snippet dari semua member workspace.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {snippets.map((item) => (
            <SnippetCard
              key={`${item.workspaceId}-${item.snippetId}`}
              snippet={item.snippet}
              active={selected?.id === item.snippet.id}
              authorName={item.authorName}
              onClick={() => setSelectedId(item.snippet.id)}
            />
          ))}
        </div>
      </aside>

      <section className="flex-1 min-w-0 min-h-0 flex flex-col">
        {selected ? (
          <>
            <div className="px-5 py-3 border-b border-[var(--border)] bg-[var(--bg)] flex items-center justify-between gap-3 shrink-0">
              <div>
                <p className="text-[10px] uppercase tracking-[1.4px] text-[var(--text4)] font-semibold">
                  Workspace Snippet
                </p>

                <p className="text-[12px] text-[var(--text3)] mt-0.5">
                  Bisa diedit oleh Owner dan Editor workspace.
                </p>
              </div>

              {canEdit && (
                <RemoveWorkspaceSnippetButton
                  workspaceId={workspaceId}
                  snippetId={selected.id}
                />
              )}
            </div>

            <div className="flex-1 min-h-0">
              <SnippetDetail
                key={selected.id}
                snippet={selected}
                onEdit={() => {
                  // nanti sambungkan ke edit modal permission workspace
                }}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[var(--text4)]">
            Pilih snippet dulu.
          </div>
        )}
      </section>
    </div>
  )
}