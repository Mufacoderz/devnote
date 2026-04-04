"use client"

import { useState, useRef, useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faPlus, faRightFromBracket, faUserPen } from '@fortawesome/free-solid-svg-icons'
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"

interface TopbarProps {
    onNewSnippet: () => void
}

function getInitials(name?: string | null) {
    if (!name) return "U"
    const words = name.trim().split(" ")
    if (words.length === 1) return words[0][0].toUpperCase()
    return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

export default function Topbar({ onNewSnippet }: TopbarProps) {
    const { data: session } = useSession()
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    
    // close dropdown kalau klik luar
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    if (!session?.user) return null

    const user = session.user
    const initials = getInitials(user.name)


    return (
        <header className="h-[52px] bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-5 shrink-0">

            {/* kiri */}
            <div className="flex items-center gap-2 px-4 h-[52px] border-b border-[var(--border)] shrink-0">
                <div className="w-[26px] h-[26px] bg-[var(--em)] rounded-[6px] flex items-center justify-center text-[#0a0a0a] font-mono text-[11px] font-bold">
                    &lt;/&gt;
                </div>
                <span className="text-[15px] font-semibold tracking-tight">
                    dev<span className="text-[var(--em)]">note</span>
                </span>
            </div>

            {/* kanan */}
            <div className="flex items-center gap-3">

                {/* search */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Cari snippets..."
                        className="bg-[var(--surface2)] border border-[var(--border2)] rounded-full px-4 py-[6px] pl-8 text-[12px] font-mono text-[var(--text)] placeholder:text-[var(--text4)] outline-none w-[200px] focus:border-[var(--em-border)] focus:shadow-[0_0_0_3px_var(--em-faint)] transition-all"
                    />
                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text4)] w-[12px] h-[12px]"
                    />
                </div>

                {/* tambah */}
                <button
                    onClick={onNewSnippet}
                    className="flex items-center gap-2 bg-[var(--em)] text-[#0a0a0a] font-semibold text-[13px] px-4 py-[6px] rounded-full border border-transparent hover:bg-transparent hover:text-[var(--em)] hover:border-[var(--em)] hover:shadow-[0_0_20px_var(--em-glow)] transition-all"
                >
                    <FontAwesomeIcon icon={faPlus} className="w-[12px] h-[12px]" />
                    Tambah Snippet
                </button>

                {/* profile */}
                <div className="relative" ref={dropdownRef}>
                    <div
                        onClick={() => setOpen(!open)}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        {user.image ? (
                            <Image
                                src={user.image}
                                alt="Profile"
                                className="w-[30px] h-[30px] rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[var(--em-dim)] to-[var(--em)] flex items-center justify-center text-[#0a0a0a] text-[11px] font-bold">
                                {initials}
                            </div>
                        )}
                    </div>

                    {/* dropdown */}
                    {open && (
                        <div className="absolute right-0 mt-2 w-[220px] rounded-xl border border-[var(--border)] bg-[rgba(20,20,20,0.7)] backdrop-blur-md shadow-xl p-2 z-50">

                            {/* user info */}
                            <div className="px-3 py-2 border-b border-[var(--border)]">
                                <div className="text-[13px] font-semibold text-[var(--text)]">
                                    {user.name || "User"}
                                </div>
                                <div className="text-[11px] text-[var(--text4)]">
                                    {user.email}
                                </div>
                            </div>

                            {/* menu */}
                            <div className="flex flex-col mt-1">

                                <button className="flex items-center gap-2 px-3 py-2 text-[12px] hover:bg-[var(--surface2)] rounded-md transition">
                                    <FontAwesomeIcon icon={faUserPen} />
                                    Edit Profil
                                </button>

                                <button
                                    onClick={() => signOut()}
                                    className="flex items-center gap-2 px-3 py-2 text-[12px] hover:bg-red-500/10 text-red-400 rounded-md transition"
                                >
                                    <FontAwesomeIcon icon={faRightFromBracket} />
                                    Logout
                                </button>

                            </div>
                        </div>
                    )}

                </div>

            </div>
        </header>
    )
}