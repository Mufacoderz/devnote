"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import CopyButton from "./CopyButton"
import CodeBlock from "./CodeBlock"
import { getLang } from "@/lib/languages"

export interface Snippet {
    id: number
    title: string
    language: string
    description: string | null
    code: string
    tags: string[]
    copyCount: number
    createdAt: string
}

export default function SnippetDetail({ snippet }: { snippet: Snippet }) {
    const router = useRouter()

    // state untuk loading tombol hapus
    const [deleting, setDeleting] = useState(false)

    // state untuk buka/tutup dialog konfirmasi hapus
    const [confirmOpen, setConfirmOpen] = useState(false)

    // copyCount disimpan di local state supaya bisa di-update
    // secara optimistic tanpa perlu router.refresh()
    const [copyCount, setCopyCount] = useState(snippet.copyCount)

    // sync copyCount dari server setiap kali snippet yang ditampilkan ganti
    // watch snippet.id bukan snippet.copyCount — supaya tidak loop
    // kalau watch copyCount, setiap setCopyCount akan trigger effect lagi
    useEffect(() => {
        setCopyCount(snippet.copyCount)
    }, [snippet.id, snippet.copyCount])

    // ambil config bahasa (label, warna pip) dari languages.ts
    const lang = getLang(snippet.language)

    const handleDelete = async () => {
        setDeleting(true)
        try {
            const res = await fetch(`/api/snippets/${snippet.id}`, { method: "DELETE" })
            if (!res.ok) throw new Error()
            // refresh server component (DashboardPage) supaya
            // list snippet di panel kiri ikut terupdate
            router.refresh()
        } catch {
            alert("Gagal menghapus snippet.")
            // kalau gagal, kembalikan tombol ke state normal
            setDeleting(false)
        }
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden">

            <div className="px-6 py-5 border-b border-[var(--border)] shrink-0">
                <div className="flex items-center gap-2 mb-3">
                    {/* pip badge — warna dan label dari getLang() */}
                    <span className={`font-mono text-[10px] font-semibold px-2 py-[3px] rounded-[4px] border ${lang.pip}`}>
                        {lang.label}
                    </span>
                    <span className="text-[12px] text-[var(--text3)]">{snippet.language}</span>
                </div>

                <h2 className="text-[22px] font-bold tracking-[-0.5px] mb-3">
                    {snippet.title}
                </h2>

                {/* deskripsi hanya ditampilkan kalau ada isinya (tidak null/kosong) */}
                {snippet.description && (
                    <p className="text-[13px] text-[var(--text3)] mb-4 leading-relaxed">
                        {snippet.description}
                    </p>
                )}

                <div className="flex gap-2 mb-4">
                    {snippet.tags.map(tag => (
                        <span key={tag} className="font-mono text-[10px] text-[var(--text3)] bg-[var(--surface2)] border border-[var(--border2)] px-2.5 py-[3px] rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <CopyButton
                        code={snippet.code}
                        snippetId={snippet.id}
                        // onCopy dipanggil dari CopyButton setelah copy terjadi
                        // increment lokal supaya angka naik instantly tanpa refresh
                        // functional update (c => c + 1) lebih aman dari race condition
                        // dibanding setCopyCount(copyCount + 1)
                        onCopy={() => setCopyCount(c => c + 1)}
                    />
                    <button className="text-[13px] font-medium px-4 py-2 rounded-lg border border-[var(--border2)] text-[var(--text3)] hover:border-yellow-500/60 hover:text-yellow-300 transition-all">
                        Edit
                    </button>
                    {/* tombol hapus tidak langsung hapus — buka dialog konfirmasi dulu */}
                    <button
                        onClick={() => setConfirmOpen(true)}
                        disabled={deleting}
                        className="text-[13px] font-medium px-4 py-2 rounded-lg border border-[var(--border2)] text-[var(--text3)] hover:border-red-500/60 hover:text-red-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {deleting ? "Menghapus..." : "Hapus"}
                    </button>
                </div>

                <div className="flex items-center gap-4 mt-4 font-mono text-[11px] text-[var(--text4)]">
                    <span className="flex items-center gap-1.5">
                        <div className="w-[4px] h-[4px] rounded-full bg-[var(--em)]" />
                        Disimpan {snippet.createdAt}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <div className="w-[4px] h-[4px] rounded-full bg-[var(--em)]" />
                        {/* pakai local state copyCount, bukan snippet.copyCount */}
                        {copyCount} kali disalin
                    </span>
                    <span className="flex items-center gap-1.5">
                        <div className="w-[4px] h-[4px] rounded-full bg-[var(--em)]" />
                        Privat
                    </span>
                </div>
            </div>

            {/* CodeBlock fetch highlight ke /api/highlight via Shiki */}
            <div className="flex-1 overflow-hidden">
                <CodeBlock code={snippet.code} language={snippet.language} />
            </div>

            <div className="flex items-center justify-between px-6 py-2.5 border-t border-[var(--border)] bg-[var(--surface)] shrink-0">
                <div className="flex items-center gap-4 font-mono text-[10px] text-[var(--text4)]">
                    {/* hitung jumlah baris dari newline */}
                    <span>{snippet.code.split('\n').length} baris</span>
                    <span>UTF-8</span>
                    <span>{snippet.language}</span>
                </div>
                <button className="font-mono text-[10px] text-[var(--em-dim)] border border-[var(--em-border)] px-3 py-1.5 rounded-full hover:text-[var(--em)] transition-all">
                    Bagikan Link →
                </button>
            </div>

            {/* dialog konfirmasi hapus — hanya muncul kalau confirmOpen true */}
            {confirmOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
                >
                    <div
                        className="flex flex-col gap-4 rounded-xl p-6 w-full max-w-sm"
                        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                    >
                        <h3 className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>
                            Hapus snippet ini?
                        </h3>
                        <p className="text-[13px]" style={{ color: "var(--text3)" }}>
                            <span className="font-medium" style={{ color: "var(--text)" }}>
                                {snippet.title}
                            </span>{" "}
                            akan dihapus permanen dan tidak bisa dikembalikan.
                        </p>
                        <div className="flex justify-end gap-2">
                            {/* batal — tutup dialog tanpa hapus */}
                            <button
                                onClick={() => setConfirmOpen(false)}
                                className="px-4 py-2 rounded-lg text-[13px]"
                                style={{
                                    background: "var(--bg)",
                                    border: "1px solid var(--border)",
                                    color: "var(--text3)"
                                }}
                            >
                                Batal
                            </button>
                            {/* konfirmasi hapus — panggil handleDelete */}
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="px-4 py-2 rounded-lg text-[13px] font-medium"
                                style={{
                                    background: "#ef4444",
                                    color: "#fff",
                                    opacity: deleting ? 0.6 : 1
                                }}
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