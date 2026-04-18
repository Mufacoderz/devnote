"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import CodeBlock from "@/components/snippet/CodeBlock"
import { getLang } from "@/lib/languages"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faCopy, faCheck, faArrowRight } from "@fortawesome/free-solid-svg-icons"

interface ShareSnippet {
    id: number
    title: string
    description: string | null
    code: string
    language: string
    isPublic: boolean
    copyCount: number
    createdAt: string
    tags: string[]
    user: {
        name: string
        avatar: string | null
    }
}

export default function SharePageSplit({ snippet }: { snippet: ShareSnippet }) {
    const [copied, setCopied] = useState(false)
    const [copyCount, setCopyCount] = useState(snippet.copyCount)
    const lang = getLang(snippet.language)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(snippet.code)
            setCopied(true)
            setCopyCount(c => c + 1)
            fetch(`/api/snippets/${snippet.id}/copy`, { method: "POST" }).catch(() => {})
            setTimeout(() => setCopied(false), 1800)
        } catch {
            const ta = document.createElement("textarea")
            ta.value = snippet.code
            document.body.appendChild(ta)
            ta.select()
            document.execCommand("copy")
            document.body.removeChild(ta)
            setCopied(true)
            setTimeout(() => setCopied(false), 1800)
        }
    }

    const formattedDate = new Date(snippet.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    })

    return (
        <div className="min-h-screen bg-[#0a0f0c] overflow-hidden flex items-center justify-center p-4 md:p-6 relative">

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(52, 211, 153, 0.08) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(52, 211, 153, 0.08) 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px'
                    }}
                />
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px]" />
            </div>

            <div className="relative w-full max-w-6xl bg-[#111a16] border border-emerald-500/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[580px]">

                {/* info*/}
                <div className="w-full lg:w-[32%] bg-[#0c1210] border-b lg:border-b-0 lg:border-r border-emerald-500/10 p-6 lg:p-8 flex flex-col">

                    <Link href="/" className="flex items-center gap-2.5 mb-6 group">
                        <Image
                            src="/emerald-trans.png"
                            alt="devnote"
                            width={30}
                            height={30}
                            className="transition-transform group-hover:scale-110"
                        />
                        <span className="text-xl font-semibold tracking-tighter text-white">
                            dev<span className="text-emerald-400">note</span>
                        </span>
                    </Link>

                    <div className="h-px bg-emerald-500/10 mb-6" />

                    <div className="flex-1">
                        <span
                            className="font-mono text-[10px] font-semibold px-3 py-1 rounded-full border inline-block mb-4"
                            style={{
                                color: lang.color,
                                borderColor: lang.color + "70",
                                background: lang.color + "15",
                            }}
                        >
                            {lang.label}
                        </span>

                        <h1 className="text-2xl lg:text-[26px] font-bold tracking-[-0.4px] text-white leading-tight mb-3">
                            {snippet.title}
                        </h1>

                        {snippet.description && (
                            <p className="text-emerald-100/70 text-[14px] leading-relaxed mb-7">
                                {snippet.description}
                            </p>
                        )}

                        {snippet.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-8">
                                {snippet.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="text-[10px] font-mono px-3 py-1 bg-emerald-950 border border-emerald-500/20 text-emerald-300 rounded-full"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            {snippet.user.avatar ? (
                                <Image
                                    src={snippet.user.avatar}
                                    alt={snippet.user.name}
                                    width={38}
                                    height={38}
                                    className="rounded-full border border-emerald-500/30"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-emerald-950 border border-emerald-500/30 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faUser} className="text-emerald-400 text-lg" />
                                </div>
                            )}
                            <div>
                                <p className="font-medium text-white text-sm">{snippet.user.name}</p>
                                <p className="text-xs text-emerald-100/60">{formattedDate}</p>
                            </div>
                        </div>

                        <p className="font-mono text-xs text-emerald-100/50 mt-5">
                            {copyCount.toLocaleString("id-ID")} kali disalin
                        </p>
                    </div>

                    <div className="mt-auto pt-7">
                        <Link
                            href="/"
                            className="group flex items-center justify-between bg-emerald-500 hover:bg-emerald-400 transition-all text-black font-semibold px-5 py-3 rounded-2xl mb-5 text-sm"
                        >
                            <span>Gabung ke Devnote</span>
                            <FontAwesomeIcon 
                                icon={faArrowRight} 
                                className="group-hover:translate-x-1 transition-transform" 
                            />
                        </Link>

                        {/* {snippet.isPublic && (
                            <Link
                                href="/explore"
                                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm transition-colors mb-4"
                            >
                                Lihat di Explore 
                                <FontAwesomeIcon icon={faUpRightFromSquare} className="w-3.5 h-3.5" />
                            </Link>
                        )} */}

                        <a href="https:github.com/Mufacoderz" target="blank" className="text-emerald-100/40 text-xs tracking-wide">
                            Shared via <span className="text-emerald-400 font-medium">devnote</span> — by Muhammad Fadil
                        </a>
                    </div>
                </div>

                {/* Code Block */}
                <div className="flex-1 flex flex-col min-h-0">

                    <div className="px-6 lg:px-10 py-4 border-b border-emerald-500/10 bg-[#0a0f0c] flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-4 text-sm text-emerald-100/70">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                            </div>
                            <span className="font-mono text-xs">
                                {snippet.code.split("\n").length} baris • {snippet.language}
                            </span>
                        </div>

                        <button
                            onClick={handleCopy}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium text-sm transition-all border
                                ${copied 
                                    ? "bg-emerald-500 text-black border-emerald-400" 
                                    : "border-emerald-500/40 hover:border-emerald-400 hover:text-white text-emerald-100"
                                }`}
                        >
                            <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="w-4 h-4" />
                            {copied ? "Tersalin!" : "Salin"}
                        </button>
                    </div>

                    <div className="flex-1 bg-[#0a0f0c] overflow-hidden">
                        <div className="h-[460px] lg:h-[530px] overflow-auto">
                            <CodeBlock code={snippet.code} language={snippet.language} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}