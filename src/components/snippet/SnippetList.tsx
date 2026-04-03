'use client'

import { useState } from "react"
import { type Snippet } from "./SnippetDetail"
import SnippetCard from "./SnippetCard"
import SnippetDetail from "./SnippetDetail"

export default function SnippetList({ snippets }: { snippets: Snippet[] }) {
    const [selected, setSelected] = useState(snippets[0])

    return (
        <div className="flex h-full overflow-hidden">

            {/* Panel list */}
            <div className="w-[280px] border-r border-[var(--border)] flex flex-col shrink-0">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] shrink-0">
                    <span className="text-[11px] font-semibold tracking-[1px] uppercase text-[var(--text3)]">
                        Semua Snippet
                    </span>
                    <span className="font-mono text-[10px] text-[var(--text4)] bg-[var(--surface2)] px-2 py-[2px] rounded-full">
                        {snippets.length}
                    </span>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    {snippets.map(snippet => (
                        <SnippetCard
                            key={snippet.id}
                            snippet={snippet}
                            active={selected.id === snippet.id}
                            onClick={() => setSelected(snippet)}
                        />
                    ))}
                </div>
            </div>

            {/* Panel detail */}
            <SnippetDetail snippet={selected} />

        </div>
    )
}