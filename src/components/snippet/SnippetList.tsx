'use client'

import { useState } from "react"
import { type Snippet } from "./SnippetDetail"
import SnippetCard from "./SnippetCard"
import SnippetDetail from "./SnippetDetail"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCode, faPlus } from '@fortawesome/free-solid-svg-icons'
import SnippetModal from "./SnippetModal"

export default function SnippetList({ snippets }: { snippets: Snippet[] }) {
    const [selected, setSelected] = useState(snippets[0] ?? null)
    const [modalOpen, setModalOpen] = useState(false)

    if (snippets.length === 0) {
        return (
            <>
                <div className="flex h-full items-center justify-center">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="w-[56px] h-[56px] rounded-[12px] border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-[var(--text3)]">
                            <FontAwesomeIcon icon={faCode} className="w-[22px] h-[22px]" />
                        </div>
                        <div>
                            <p className="text-[15px] font-semibold text-[var(--text)] mb-1">
                                Belum ada snippet
                            </p>
                            <p className="text-[13px] text-[var(--text3)]">
                                Mulai simpan kode pertamamu
                            </p>
                        </div>
                        <button
                            onClick={() => setModalOpen(true)}
                            className="flex items-center gap-2 bg-[var(--em)] text-[#0a0a0a] font-semibold text-[13px] px-5 py-2.5 rounded-lg hover:bg-[#2bc48a] transition-all"
                        >
                            <FontAwesomeIcon icon={faPlus} className="w-[12px] h-[12px]" />
                            Tambah Snippet
                        </button>
                    </div>
                </div>
                <SnippetModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
            </>
        )
    }

    return (
        <div className="flex h-full overflow-hidden">
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
                            active={selected?.id === snippet.id}
                            onClick={() => setSelected(snippet)}
                        />
                    ))}
                </div>
            </div>
            {selected && <SnippetDetail snippet={selected} />}
        </div>
    )
}