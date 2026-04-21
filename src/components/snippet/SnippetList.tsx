"use client"
import { useState, useEffect } from "react"
import { type Snippet } from "./SnippetDetail"
import SnippetCard from "./SnippetCard"
import SnippetDetail from "./SnippetDetail"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCode, faPlus, faArrowLeft, faSlidersH } from '@fortawesome/free-solid-svg-icons'
import SnippetModal from "./SnippetModal"
import { AnimatePresence, motion } from "framer-motion"
import { useAppStore } from "@/lib/store"
import SnippetListSkeleton from "./SnippetListSkeleton"
import { getLang } from "@/lib/languages"

// ---- ListHeader di luar komponen utama ----
interface ListHeaderProps {
    visibleCount: number
    totalCount: number
    activeLang: string | null
    filterOpen: boolean
    availableLangs: [string, number][]
    onToggleFilter: () => void
    onToggleLang: (lang: string) => void
}

function ListHeader({
    visibleCount,
    totalCount,
    activeLang,
    filterOpen,
    availableLangs,
    onToggleFilter,
    onToggleLang,
}: ListHeaderProps) {
    return (
        <div className="shrink-0 border-b border-[var(--border)]">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold tracking-[1px] uppercase text-[var(--text3)]">
                        Semua Snippet
                    </span>
                    <span className="font-mono text-[10px] text-[var(--text4)] bg-[var(--surface2)] px-2 py-[2px] rounded-full">
                        {visibleCount}{activeLang ? ` / ${totalCount}` : ""}
                    </span>
                </div>

                {availableLangs.length > 1 && (
                    <button
                        onClick={onToggleFilter}
                        className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-[5px] rounded-[6px] border transition-all
                            ${filterOpen || activeLang
                                ? 'border-[var(--em-border)] text-[var(--em)] bg-[var(--em-faint)]'
                                : 'border-[var(--border2)] text-[var(--text3)] hover:border-[var(--em-border)] hover:text-[var(--em)]'
                            }`}
                    >
                        <FontAwesomeIcon icon={faSlidersH} className="w-[10px] h-[10px]" />
                        Language
                        {activeLang && (
                            <span className="w-[5px] h-[5px] rounded-full bg-[var(--em)] ml-0.5 shrink-0" />
                        )}
                    </button>
                )}
            </div>

            <AnimatePresence>
                {filterOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                    >
                        <div className="px-4 pb-3">
                            <p className="text-[9px] font-semibold tracking-[1.2px] uppercase text-[var(--text4)] mb-2">
                                Filter bahasa
                            </p>
                            <div className="flex flex-wrap gap-[5px]">
                                {availableLangs.map(([name, count]) => {
                                    const langConfig = getLang(name)
                                    const isActive = activeLang === name
                                    return (
                                        <button
                                            key={name}
                                            onClick={() => onToggleLang(name)}
                                            className={`flex items-center gap-1.5 font-mono text-[10px] px-2.5 py-[4px] rounded-full border transition-all
                                                ${isActive
                                                    ? 'border-[var(--em-border)] text-[var(--em)] bg-[var(--em-faint)]'
                                                    : 'border-[var(--border2)] text-[var(--text3)] hover:border-[var(--em-border)] hover:text-[var(--em)]'
                                                }`}
                                        >
                                            <span
                                                className="w-[5px] h-[5px] rounded-full shrink-0"
                                                style={{ background: langConfig.color }}
                                            />
                                            {name.charAt(0).toUpperCase() + name.slice(1)}
                                            <span className="opacity-50">{count}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ---- Komponen utama ----
export default function SnippetList({ snippets }: { snippets: Snippet[] }) {
    const [selectedId, setSelectedId] = useState<number | null>(snippets[0]?.id ?? null)
    const [modalOpen, setModalOpen] = useState(false)
    const [editSnippet, setEditSnippet] = useState<Snippet | null>(null)
    const [showDetail, setShowDetail] = useState(false)
    const [filterOpen, setFilterOpen] = useState(false)
    const [activeLang, setActiveLang] = useState<string | null>(null)

    const isNavigating = useAppStore(s => s.isNavigating)
    const setIsNavigating = useAppStore(s => s.setIsNavigating)


    useEffect(() => {
        setIsNavigating(false)
    }, [snippets, setIsNavigating])



    if (isNavigating) return <SnippetListSkeleton />

    const langCounts = snippets.reduce<Record<string, number>>((acc, s) => {
        if (s.language) acc[s.language] = (acc[s.language] ?? 0) + 1
        return acc
    }, {})
    const availableLangs = Object.entries(langCounts).sort((a, b) => b[1] - a[1])

    const visibleSnippets = activeLang
        ? snippets.filter(s => s.language === activeLang)
        : snippets

    const selected = visibleSnippets.find(s => s.id === selectedId) ?? visibleSnippets[0] ?? null

    const handleModalClose = () => {
        setModalOpen(false)
        setEditSnippet(null)
    }

    const handleSelectMobile = (id: number) => {
        setSelectedId(id)
        setShowDetail(true)
    }

    const headerProps: ListHeaderProps = {
        visibleCount: visibleSnippets.length,
        totalCount: snippets.length,
        activeLang,
        filterOpen,
        availableLangs,
        onToggleFilter: () => setFilterOpen(p => !p),
        onToggleLang: (lang) => setActiveLang(prev => prev === lang ? null : lang),
    }

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
                <SnippetModal isOpen={modalOpen} onClose={handleModalClose} snippetToEdit={null} />
            </>
        )
    }

    return (
        <>
            {/* desktop */}
            <div className="hidden lg:flex h-full overflow-hidden">
                <div className="w-[300px] border-r border-[var(--border)] flex flex-col shrink-0">
                    <ListHeader {...headerProps} />
                    <div className="flex-1 overflow-y-auto p-2">
                        {visibleSnippets.map(snippet => (
                            <SnippetCard
                                key={snippet.id}
                                snippet={snippet}
                                active={selected?.id === snippet.id}
                                onClick={() => setSelectedId(snippet.id)}
                            />
                        ))}
                        {visibleSnippets.length === 0 && (
                            <p className="text-[12px] text-[var(--text4)] text-center py-8">
                                Tidak ada snippet dengan bahasa ini
                            </p>
                        )}
                    </div>
                </div>
                {selected && (
                    <SnippetDetail
                        key={selected.id}
                        snippet={selected}
                        onEdit={() => setEditSnippet(selected)}
                    />
                )}
            </div>

            {/* mobile */}
            <div className="flex lg:hidden h-full overflow-hidden relative">
                <AnimatePresence initial={false}>
                    {!showDetail && (
                        <motion.div
                            key="list"
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
                            className="absolute inset-0 flex flex-col bg-[var(--bg2)]"
                        >
                            <ListHeader {...headerProps} />
                            <div className="flex-1 overflow-y-auto p-2">
                                {visibleSnippets.map(snippet => (
                                    <SnippetCard
                                        key={snippet.id}
                                        snippet={snippet}
                                        active={selected?.id === snippet.id}
                                        onClick={() => handleSelectMobile(snippet.id)}
                                    />
                                ))}
                                {visibleSnippets.length === 0 && (
                                    <p className="text-[12px] text-[var(--text4)] text-center py-8">
                                        Tidak ada snippet dengan bahasa ini
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {showDetail && selected && (
                        <motion.div
                            key="detail"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
                            className="absolute inset-0 flex flex-col bg-[var(--bg2)]"
                        >
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] shrink-0">
                                <button
                                    onClick={() => setShowDetail(false)}
                                    className="flex items-center gap-2 text-[13px] text-[var(--text3)] hover:text-[var(--em)] transition-all"
                                >
                                    <FontAwesomeIcon icon={faArrowLeft} className="w-[12px] h-[12px]" />
                                    Kembali
                                </button>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <SnippetDetail
                                    key={selected.id}
                                    snippet={selected}
                                    onEdit={() => setEditSnippet(selected)}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <SnippetModal
                isOpen={modalOpen || !!editSnippet}
                onClose={handleModalClose}
                snippetToEdit={editSnippet}
            />
        </>
    )
}