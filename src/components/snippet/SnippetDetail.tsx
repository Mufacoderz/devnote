"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import CopyButton from "./CopyButton"
import CodeBlock from "./CodeBlock"
import { getLang } from "@/lib/languages"
import { useAppStore } from "@/lib/store"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons"

interface SnippetDetailProps {
    snippet: Snippet
    onEdit: () => void
}

export interface Snippet {
    id: number
    title: string
    language: string
    description: string | null
    code: string
    tags: string[]
    copyCount: number
    isFavorite?: boolean
    createdAt: string
}

interface Collection {
    id: number
    name: string
}

export default function SnippetDetail({ snippet, onEdit }: SnippetDetailProps) {
    const router = useRouter()
    const { incrementFav, decrementFav, toggleFavoriteId } = useAppStore()


    const [deleting, setDeleting] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [copyCount, setCopyCount] = useState(snippet.copyCount)
    const [isFavorite, setIsFavorite] = useState(snippet.isFavorite)

    const [colOpen, setColOpen] = useState(false)
    const [collections, setCollections] = useState<Collection[]>([])
    const [assignedIds, setAssignedIds] = useState<number[]>([])
    // const [colLoading, setColLoading] = useState(false)

    const colRef = useRef<HTMLDivElement>(null)

    // Update state ketika snippet berubah
    useEffect(() => {
        setCopyCount(snippet.copyCount)
    }, [snippet.id, snippet.copyCount])

    useEffect(() => {
        setIsFavorite(snippet.isFavorite)
    }, [snippet.id, snippet.isFavorite])

    // Click outside handler untuk dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (colRef.current && !colRef.current.contains(event.target as Node)) {
                setColOpen(false)
            }
        }

        // ganti mousedown → click
        document.addEventListener("click", handleClickOutside)
        return () => document.removeEventListener("click", handleClickOutside)
    }, [])

    // Fetch collections ketika dropdown dibuka
    useEffect(() => {
        if (!colOpen) return

        // setColLoading(true)
        Promise.all([
            fetch("/api/collections").then(r => r.json()),
            fetch(`/api/snippets/${snippet.id}/collections`).then(r => r.json())
        ])
            .then(([allCols, assignedCols]) => {
                setCollections(allCols.collections ?? [])
                setAssignedIds(assignedCols.map((c: { id: number }) => c.id))
            })
        // .finally(() => setColLoading(false))
    }, [colOpen, snippet.id])

    const handleToggleCollection = async (colId: number) => {
        const isAssigned = assignedIds.includes(colId)

        // Optimistic update
        setAssignedIds(prev =>
            isAssigned ? prev.filter(id => id !== colId) : [...prev, colId]
        )

        try {
            await fetch(`/api/collections/${colId}/snippets`, {
                method: isAssigned ? "DELETE" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ snippetId: snippet.id })
            })
        } catch (error) {
            // Revert jika gagal
            setAssignedIds(prev =>
                isAssigned ? [...prev, colId] : prev.filter(id => id !== colId)
            )
            console.error("Gagal toggle collection:", error)
        }
    }

    const toggleCollectionDropdown = (e: React.MouseEvent) => {
        e.stopPropagation()
        setColOpen(prev => !prev)
    }

    const lang = getLang(snippet.language)

    const handleDelete = async () => {
        setDeleting(true)
        try {
            const res = await fetch(`/api/snippets/${snippet.id}`, { method: "DELETE" })
            if (!res.ok) throw new Error()
            router.refresh()
        } catch {
            alert("Gagal menghapus snippet.")
            setDeleting(false)
        }
    }

    const handleFavorite = async () => {
        const next = !isFavorite
        setIsFavorite(next)
        if (next) incrementFav()
        else decrementFav()
        toggleFavoriteId(snippet.id)

        try {
            const res = await fetch(`/api/snippets/${snippet.id}/favorite`, { method: "POST" })
            if (!res.ok) throw new Error()
        } catch {
            setIsFavorite(!next)
            if (next) decrementFav()
            else incrementFav()
            toggleFavoriteId(snippet.id)
        }
    }
    return (
        <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden">
            <div className="px-6 py-5 border-b border-[var(--border)] shrink-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span
                                className="font-mono text-[9px] font-semibold px-[7px] py-[2px] rounded-[3px] border"
                                style={{
                                    color: lang.color,
                                    borderColor: lang.color + "55",
                                    background: lang.color + "18",
                                }}
                            >
                                {lang.label}
                            </span>
                            <span className="text-[12px] text-[var(--text3)]">{snippet.language}</span>
                        </div>
                        <h2 className="text-[22px] font-bold tracking-[-0.5px] leading-tight">
                            {snippet.title}
                        </h2>
                    </div>

                    <button
                        onClick={handleFavorite}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-all
                            ${isFavorite
                                ? 'bg-yellow-400/10 border-yellow-400/50 text-yellow-300'
                                : 'border-[var(--border2)] text-[var(--text3)] hover:border-yellow-400/50 hover:text-yellow-300'
                            }`}
                    >
                        <span className={`text-[14px] transition-transform ${isFavorite ? "scale-110" : ""}`}>
                            {isFavorite ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            )}
                        </span>
                        {isFavorite ? "Favorited" : "Favorite"}
                    </button>
                </div>

                {snippet.description && (
                    <p className="text-[13px] text-[var(--text3)] mb-4 leading-relaxed max-w-2xl">
                        {snippet.description}
                    </p>
                )}

                <div className="flex gap-2 mb-4 flex-wrap">
                    {snippet.tags.map(tag => (
                        <span
                            key={tag}
                            className="font-mono text-[10px] text-[var(--text3)] bg-[var(--surface2)] border border-[var(--border2)] px-2.5 py-[3px] rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <CopyButton
                        code={snippet.code}
                        snippetId={snippet.id}
                        onCopy={() => setCopyCount(c => c + 1)}
                    />

                    {/* === COLLECTION DROPDOWN (SUDAH DIPERBAIKI) === */}
                    <div className="relative" ref={colRef}>
                        <button
                            onClick={toggleCollectionDropdown}
                            className={`flex items-center gap-2 text-[13px] font-medium px-4 py-2 rounded-lg border transition-all
                                ${colOpen
                                    ? 'border-[var(--em-border)] text-[var(--em)] bg-[var(--em-faint)]'
                                    : 'border-[var(--border2)] text-[var(--em-dim)] hover:border-green-500/60 hover:text-[var(--em)]'
                                }`}
                        >
                            <FontAwesomeIcon icon={faFolderPlus} className="w-[12px] h-[12px]" />
                            Collection
                        </button>

                        {colOpen && (
                            <div className="absolute left-0 top-10 z-50 w-[200px] rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xl p-2">
                                {collections.length === 0 ? (
                                    <p className="text-[12px] text-[var(--text4)] px-2 py-2 italic">
                                        Belum ada collection
                                    </p>
                                ) : (
                                    collections.map(col => {
                                        const isAssigned = assignedIds.includes(col.id)
                                        return (
                                            <button
                                                key={col.id}
                                                onClick={() => handleToggleCollection(col.id)}
                                                className={`flex items-center justify-between w-full px-3 py-2 text-[12px] rounded-lg transition-all
                                                    ${isAssigned
                                                        ? 'text-[var(--em)] bg-[var(--em-faint)]'
                                                        : 'text-[var(--text2)] hover:bg-[var(--surface2)]'
                                                    }`}
                                            >
                                                <span className="truncate">{col.name}</span>
                                                {isAssigned && <span className="text-[10px] ml-2">✓</span>}
                                            </button>
                                        )
                                    })
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={onEdit}
                        className="text-[13px] font-medium px-4 py-2 rounded-lg border border-[var(--border2)] text-yellow-700 hover:border-yellow-500/60 hover:text-yellow-300 transition-all"
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => setConfirmOpen(true)}
                        disabled={deleting}
                        className="text-[13px] font-medium px-4 py-2 rounded-lg border border-[var(--border2)] text-red-700 hover:border-red-500/60 hover:text-red-400 transition-all disabled:opacity-40"
                    >
                        {deleting ? "Menghapus..." : "Hapus"}
                    </button>
                </div>

                <div className="flex items-center gap-4 mt-4 font-mono text-[11px] text-[var(--text4)]">
                    <span>Disimpan {snippet.createdAt}</span>
                    <span>{copyCount} kali disalin</span>
                    <span>Privat</span>
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden">
                <CodeBlock code={snippet.code} language={snippet.language} />
            </div>

            <div className="flex items-center justify-between px-6 py-2.5 border-t border-[var(--border)] bg-[var(--surface)] shrink-0">
                <div className="flex items-center gap-4 font-mono text-[10px] text-[var(--text4)]">
                    <span>{snippet.code.split('\n').length} baris</span>
                    <span>UTF-8</span>
                    <span>{snippet.language}</span>
                </div>
                <button className="font-mono text-[10px] text-[var(--em-dim)] border border-[var(--em-border)] px-3 py-1.5 rounded-full hover:text-[var(--em)] transition-all">
                    Bagikan Link →
                </button>
            </div>

            {/* Confirm Delete Modal */}
            {confirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="flex flex-col gap-4 rounded-xl p-6 w-full max-w-sm bg-[var(--surface)] border border-[var(--border)]">
                        <h3 className="text-[15px] font-semibold">Hapus snippet ini?</h3>
                        <p className="text-[13px] text-[var(--text3)]">
                            <span className="font-medium text-[var(--text)]">{snippet.title}</span>{" "}
                            akan dihapus permanen.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setConfirmOpen(false)}
                                className="px-4 py-2 rounded-lg text-[13px] border border-[var(--border)] text-[var(--text3)]"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="px-4 py-2 rounded-lg text-[13px] font-medium bg-red-500 text-white"
                            >
                                {deleting ? "Menghapus..." : "Ya, Hapus"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}