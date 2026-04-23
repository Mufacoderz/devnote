"use client"

import { useState, useRef, useEffect, useTransition } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faPlus, faBars, faTimes, faRightFromBracket, faUserPen, faGear, faKey } from '@fortawesome/free-solid-svg-icons'
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

interface TopbarProps {
    onNewSnippet: () => void
    onToggleSidebar: () => void
}

function getInitials(name?: string | null) {
    if (!name) return "U"
    const words = name.trim().split(" ")
    if (words.length === 1) return words[0][0].toUpperCase()
    return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

export default function Topbar({ onNewSnippet, onToggleSidebar }: TopbarProps) {
    const { data: session } = useSession()
    const [searchOpen, setSearchOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [confirmLogout, setConfirmLogout] = useState(false)
    const [codeModalOpen, setCodeModalOpen] = useState(false)
    const [shareCode, setShareCode] = useState("")
    const [codeError, setCodeError] = useState("")
    const [codeLoading, setCodeLoading] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const codeInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") ?? "")
    const [, startTransition] = useTransition()

    const pushSearch = useDebouncedCallback((val: string) => {
        const params = new URLSearchParams(window.location.search)
        if (val.trim()) {
            params.set("search", val.trim())
        } else {
            params.delete("search")
        }
        startTransition(() => {
            router.replace(`/dashboard?${params.toString()}`)
        })
    }, 400)

    const handleSearch = (val: string) => {
        setSearchQuery(val)
        pushSearch(val)
    }

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        if (codeModalOpen) {
            setTimeout(() => codeInputRef.current?.focus(), 50)
        } else {
            setShareCode("")
            setCodeError("")
        }
    }, [codeModalOpen])

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value
            .replace(/[^A-Za-z0-9]/g, "")
            .toUpperCase()
            .slice(0, 9)

        if (val.length > 6) {
            val = `${val.slice(0, 3)}-${val.slice(3, 6)}-${val.slice(6)}`
        } else if (val.length > 3) {
            val = `${val.slice(0, 3)}-${val.slice(3)}`
        }

        setShareCode(val)
        if (codeError) setCodeError("")
    }

    const handleCodeSubmit = async () => {
        const rawCode = shareCode.replace(/-/g, "")
        if (rawCode.length !== 9) {
            setCodeError("Kode harus 9 karakter")
            return
        }
        setCodeLoading(true)
        setCodeError("")
        try {
            const res = await fetch(`/api/snippets/${rawCode}/share/shareId`)
            if (!res.ok) {
                setCodeError("Kode tidak ditemukan atau sudah tidak aktif")
                return
            }
            router.push(`/share/${rawCode}`)
            setCodeModalOpen(false)
        } catch (err) {
            console.error(err)
            setCodeError("Terjadi kesalahan, coba lagi")
        } finally {
            setCodeLoading(false)
        }
    }

    const filled = shareCode.replace(/-/g, "").length
    const isDisabled = codeLoading || filled !== 9

    if (!session?.user) return null

    const user = session.user
    const initials = getInitials(user.name)

    const inputClass = "bg-[var(--surface2)] border border-[var(--border2)] focus:border-[var(--em)] rounded-full px-4 py-[6px] pl-8 text-[12px] font-mono text-[var(--text)] placeholder:text-[var(--text4)] outline-none transition-all"

    return (
        <>
            <header className="h-[52px] bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-5 shrink-0 relative">

                {searchOpen && (
                    <div className="absolute inset-0 z-10 flex items-center gap-2 px-3 bg-[var(--surface)] lg:hidden">
                        <div className="relative flex-1">
                            <input
                                autoFocus
                                type="text"
                                value={searchQuery}
                                onChange={e => handleSearch(e.target.value)}
                                placeholder="Cari snippets..."
                                className={`w-full ${inputClass}`}
                            />
                            <FontAwesomeIcon
                                icon={faMagnifyingGlass}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text4)] w-[12px] h-[12px]"
                            />
                        </div>
                        <button
                            onClick={() => setSearchOpen(false)}
                            className="w-[32px] h-[32px] flex items-center justify-center rounded-lg text-[var(--text3)] hover:bg-[var(--surface2)] hover:text-[var(--text)] transition-all shrink-0"
                        >
                            <FontAwesomeIcon icon={faTimes} className="w-[13px] h-[13px]" />
                        </button>
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <button
                        onClick={onToggleSidebar}
                        className="lg:hidden w-[32px] h-[32px] flex items-center justify-center rounded-lg text-[var(--text3)] hover:bg-[var(--surface2)] hover:text-[var(--text)] transition-all"
                    >
                        <FontAwesomeIcon icon={faBars} className="w-[14px] h-[14px]" />
                    </button>

                    <div className="flex items-center gap-2">
                        <Image src="/emerald-trans.png" alt="devnote" width={30} height={30} />
                        <span className="text-[15px] font-semibold tracking-tight">
                            dev<span className="text-[var(--em)]">note</span>
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">

                    <div className="relative hidden lg:block">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => handleSearch(e.target.value)}
                            placeholder="Cari snippets..."
                            className={`w-[200px] ${inputClass}`}
                        />
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text4)] w-[12px] h-[12px]"
                        />
                    </div>

                    <div className="relative hidden lg:block">
                        <input
                            type="text"
                            value={shareCode}
                            onChange={handleCodeChange}
                            onFocus={() => setCodeModalOpen(false)}
                            onClick={() => setCodeModalOpen(true)}
                            onKeyDown={e => { if (e.key === "Enter") handleCodeSubmit() }}
                            placeholder="Enter code"
                            readOnly
                            className={`w-[120px] cursor-pointer ${inputClass} pl-8`}
                        />
                        <FontAwesomeIcon
                            icon={faKey}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text4)] w-[11px] h-[11px]"
                        />
                    </div>

                    {/* search icon — mobile */}
                    <button
                        onClick={() => setSearchOpen(true)}
                        className="lg:hidden w-[32px] h-[32px] flex items-center justify-center rounded-lg text-[var(--text3)] hover:bg-[var(--surface2)] hover:text-[var(--text)] transition-all"
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="w-[13px] h-[13px]" />
                    </button>

                    {/* enter code icon — mobile */}
                    <button
                        onClick={() => setCodeModalOpen(true)}
                        className="lg:hidden w-[32px] h-[32px] flex items-center justify-center rounded-lg text-[var(--text3)] hover:bg-[var(--surface2)] hover:text-[var(--text)] transition-all"
                    >
                        <FontAwesomeIcon icon={faKey} className="w-[13px] h-[13px]" />
                    </button>

                    <button
                        onClick={onNewSnippet}
                        className="flex items-center gap-2 bg-[var(--em)] text-[#0a0a0a] font-semibold text-[13px] px-4 py-[6px] rounded-full border border-transparent hover:bg-transparent hover:text-[var(--em)] hover:border-[var(--em)] hover:shadow-[0_0_20px_var(--em-glow)] transition-all"
                    >
                        <FontAwesomeIcon icon={faPlus} className="w-[12px] h-[12px]" />
                        <span className="hidden lg:inline">Tambah Snippet</span>
                    </button>

                    <div className="relative" ref={dropdownRef}>
                        <div onClick={() => setDropdownOpen(!dropdownOpen)} className="cursor-pointer">
                            {user.image ? (
                                <Image
                                    src={user.image}
                                    alt={user.name ?? "avatar"}
                                    width={30}
                                    height={30}
                                    referrerPolicy="no-referrer"
                                    className="rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[var(--em-dim)] to-[var(--em)] flex items-center justify-center text-[#0a0a0a] text-[11px] font-bold">
                                    {initials}
                                </div>
                            )}
                        </div>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-[220px] rounded-xl border border-[var(--border)] bg-[rgba(20,20,20,0.7)] backdrop-blur-md shadow-xl p-2 z-50">
                                <div className="px-3 py-2 border-b border-[var(--border)]">
                                    <div className="text-[13px] font-semibold text-[var(--text)]">{user.name || "User"}</div>
                                    <div className="text-[11px] text-[var(--text4)]">{user.email}</div>
                                </div>
                                <div className="flex flex-col mt-1">
                                    <button
                                        onClick={() => { router.push("/profile"); setDropdownOpen(false) }}
                                        className="flex items-center gap-2 px-3 py-2 text-[12px] text-[var(--text2)] hover:bg-[var(--surface2)] rounded-md transition-all">
                                        <FontAwesomeIcon icon={faUserPen} className="w-[11px] h-[11px]" />
                                        Edit Profil
                                    </button>
                                    <button
                                        onClick={() => { router.push("/preferences"); setDropdownOpen(false) }}
                                        className="flex items-center gap-2 px-3 py-2 text-[12px] text-[var(--text2)] hover:bg-[var(--surface2)] rounded-md transition-all"
                                    >
                                        <FontAwesomeIcon icon={faGear} className="w-[11px] h-[11px]" />
                                        Preferences
                                    </button>
                                    <button
                                        onClick={() => { setConfirmLogout(true); setDropdownOpen(false) }}
                                        className="flex items-center gap-2 px-3 py-2 text-[12px] hover:bg-red-500/10 text-red-400 rounded-md transition-all"
                                    >
                                        <FontAwesomeIcon icon={faRightFromBracket} className="w-[11px] h-[11px]" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Code Modal */}
            {codeModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    onClick={() => setCodeModalOpen(false)}
                >
                    <div
                        className="relative w-full max-w-[420px] mx-auto rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(16,185,129,0.25)]"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="bg-[#10b981] p-8">
                            <div className="flex items-center justify-between mb-7">
                                <div className="flex items-center gap-2">
                                    <Image src="/black-trans.png" alt="devnote" width={22} height={22} />
                                    <span className="text-[14px] font-semibold tracking-tight text-black">devnote</span>
                                </div>
                                <button
                                    onClick={() => setCodeModalOpen(false)}
                                    className="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-black transition-all"
                                >
                                    <FontAwesomeIcon icon={faTimes} className="w-[11px] h-[11px]" />
                                </button>
                            </div>

                            <div className="mb-7">
                                <h2 className="text-[26px] font-bold tracking-[-0.5px] leading-tight mb-1 text-black">
                                    Punya kode share?
                                </h2>
                                <p className="text-black/70 text-[13.5px]">
                                    Masukkan kode 9 digit yang dibagikan temanmu
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className={`relative flex items-center bg-white border-2 rounded-2xl transition-all duration-200
                                        ${codeError ? "border-red-500" : filled === 9 ? "border-black" : "border-white/80"}`}
                                    >
                                        <div className="pl-4 pr-3">
                                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" className="text-black/70">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                            </svg>
                                        </div>
                                        <input
                                            ref={codeInputRef}
                                            type="text"
                                            value={shareCode}
                                            onChange={handleCodeChange}
                                            onKeyDown={e => {
                                                if (e.key === "Enter") handleCodeSubmit()
                                                if (e.key === "Escape") setCodeModalOpen(false)
                                            }}
                                            placeholder="XXX-XXX-XXX"
                                            autoComplete="off"
                                            spellCheck={false}
                                            className="flex-1 bg-transparent py-4 pr-4 text-[24px] font-mono font-bold tracking-[4px] text-black placeholder:text-black/30 outline-none"
                                        />
                                    </div>

                                    <div className="h-[3px] bg-black/10 rounded-full mt-3 overflow-hidden">
                                        <div
                                            className="h-full bg-black transition-all duration-300"
                                            style={{ width: `${(filled / 9) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {codeError && (
                                    <p className="text-red-700 bg-red-100/80 border border-red-200 rounded-2xl px-4 py-3 text-[13px]">
                                        {codeError}
                                    </p>
                                )}

                                <button
                                    disabled={isDisabled}
                                    onClick={handleCodeSubmit}
                                    className="w-full bg-black hover:bg-zinc-900 disabled:bg-black/60 disabled:cursor-not-allowed text-white font-semibold text-[14px] py-[15px] rounded-2xl transition-all duration-200 shadow-md"
                                >
                                    {codeLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Memeriksa kode...
                                        </span>
                                    ) : (
                                        "Buka Snippet"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Modal */}
            {confirmLogout && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="flex flex-col gap-4 rounded-xl p-6 w-full max-w-sm bg-[var(--surface)] border border-[var(--border)] shadow-2xl">
                        <div>
                            <h3 className="text-[15px] font-semibold mb-1">Logout?</h3>
                            <p className="text-[13px] text-[var(--text3)]">Kamu akan keluar dari sesi ini.</p>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setConfirmLogout(false)}
                                className="px-4 py-2 rounded-lg text-[13px] border border-[var(--border)] text-[var(--text3)] hover:bg-[var(--surface2)] transition-all"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="px-4 py-2 rounded-lg text-[13px] font-medium bg-red-500 hover:bg-red-600 text-white transition-all"
                            >
                                Ya, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}