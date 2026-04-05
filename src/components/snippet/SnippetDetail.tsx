"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import CopyButton from "./CopyButton"
import CodeBlock from "./CodeBlock"
import { getLang } from "@/lib/languages"

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

export default function SnippetDetail({ snippet, onEdit }: SnippetDetailProps) {
    const router = useRouter()

    const [deleting, setDeleting] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [copyCount, setCopyCount] = useState(snippet.copyCount)
    const [isFavorite, setIsFavorite] = useState(snippet.isFavorite)

    useEffect(() => {
        setCopyCount(snippet.copyCount)
    }, [snippet.id, snippet.copyCount])

    useEffect(() => {
        setIsFavorite(snippet.isFavorite)
    }, [snippet.id, snippet.isFavorite])

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
        setIsFavorite(prev => !prev)
        try {
            const res = await fetch(`/api/snippets/${snippet.id}/favorite`, { method: "POST" })
            if (!res.ok) throw new Error()
        } catch {
            setIsFavorite(prev => !prev)
        }
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden">

            <div className="px-6 py-5 border-b border-[var(--border)] shrink-0">

                {/* TOP ROW */}
                <div className="flex items-start justify-between gap-4 mb-3">

                    {/* LEFT */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`font-mono text-[10px] font-semibold px-2 py-[3px] rounded border ${lang.pip}`}>
                                {lang.label}
                            </span>
                            <span className="text-[12px] text-[var(--text3)]">
                                {snippet.language}
                            </span>
                        </div>

                        <h2 className="text-[22px] font-bold tracking-[-0.5px] leading-tight">
                            {snippet.title}
                        </h2>
                    </div>

                    {/* RIGHT (ACTION BAR) */}
                    <div className="flex items-center gap-2">

                        {/* FAVORITE */}
                        <button
                            onClick={handleFavorite}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-all
                            ${isFavorite
                                    ? 'bg-yellow-400/10 border-yellow-400/50 text-yellow-300'
                                    : 'border-[var(--border2)] text-[var(--text3)] hover:border-yellow-400/50 hover:text-yellow-300'
                                }`}
                        >
                            <span className={`text-[14px] transition-transform ${isFavorite ? "scale-110" : ""}`}>
                                ★
                            </span>
                            {isFavorite ? "Favorited" : "Favorite"}
                        </button>

                    </div>
                </div>

                {/* DESCRIPTION */}
                {snippet.description && (
                    <p className="text-[13px] text-[var(--text3)] mb-4 leading-relaxed max-w-2xl">
                        {snippet.description}
                    </p>
                )}

                {/* TAGS */}
                <div className="flex gap-2 mb-4 flex-wrap">
                    {snippet.tags.map(tag => (
                        <span key={tag} className="font-mono text-[10px] text-[var(--text3)] bg-[var(--surface2)] border border-[var(--border2)] px-2.5 py-[3px] rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-2">
                    <CopyButton
                        code={snippet.code}
                        snippetId={snippet.id}
                        onCopy={() => setCopyCount(c => c + 1)}
                    />

                    <button
                        onClick={onEdit}
                        className="text-[13px] font-medium px-4 py-2 rounded-lg border border-[var(--border2)] text-[var(--text3)] hover:border-yellow-500/60 hover:text-yellow-300 transition-all"
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => setConfirmOpen(true)}
                        disabled={deleting}
                        className="text-[13px] font-medium px-4 py-2 rounded-lg border border-[var(--border2)] text-[var(--text3)] hover:border-red-500/60 hover:text-red-400 transition-all disabled:opacity-40"
                    >
                        {deleting ? "Menghapus..." : "Hapus"}
                    </button>
                </div>

                {/* META */}
                <div className="flex items-center gap-4 mt-4 font-mono text-[11px] text-[var(--text4)]">
                    <span>Disimpan {snippet.createdAt}</span>
                    <span>{copyCount} kali disalin</span>
                    <span>Privat</span>
                </div>
            </div>

            {/* CODE */}
            <div className="flex-1 overflow-hidden">
                <CodeBlock code={snippet.code} language={snippet.language} />
            </div>

            {/* FOOTER */}
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

            {/* MODAL DELETE */}
            {confirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="flex flex-col gap-4 rounded-xl p-6 w-full max-w-sm bg-[var(--surface)] border border-[var(--border)]">
                        <h3 className="text-[15px] font-semibold">
                            Hapus snippet ini?
                        </h3>
                        <p className="text-[13px] text-[var(--text3)]">
                            <span className="font-medium text-[var(--text)]">
                                {snippet.title}
                            </span>{" "}
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