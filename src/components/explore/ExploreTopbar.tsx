"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faUser, faTimes } from "@fortawesome/free-solid-svg-icons"
import { useDebouncedCallback } from "use-debounce"

interface ExploreTopbarProps {
    search: string
    onSearch: (val: string) => void
}

export default function ExploreTopbar({ search, onSearch }: ExploreTopbarProps) {
    const { data: session } = useSession()
    const router = useRouter()
    
    const [inputVal, setInputVal] = useState(search)
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const pushDebounced = useDebouncedCallback((val: string) => {
        onSearch(val)
    }, 400)

    const handleChange = (val: string) => {
        setInputVal(val)
        pushDebounced(val)
    }

    useEffect(() => {
        if (mobileSearchOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [mobileSearchOpen])

    const closeMobileSearch = () => setMobileSearchOpen(false)

    const handleProfileClick = () => router.push("/dashboard")

    return (
        <header className="fixed top-0 left-0 right-0 h-16 z-50 
            bg-black/95 backdrop-blur-xl border-b border-white/10 
            flex items-center px-4 md:px-6">

            <div className="flex items-center justify-between w-full max-w-7xl mx-auto">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative w-9 h-9">
                        <Image
                            src="/emerald-trans.png"
                            alt="devnote"
                            width={36}
                            height={36}
                            className="transition-transform duration-300 group-hover:scale-110"
                            priority
                        />
                    </div>
                    <span className="text-xl font-semibold tracking-tighter text-white">
                        dev<span className="text-emerald-400">note</span>
                    </span>
                </Link>

                {/* Desktop Search - di tengah */}
                <div className="hidden md:block">
                    <div className="relative group">
                        <input
                            type="text"
                            value={inputVal}
                            onChange={(e) => handleChange(e.target.value)}
                            placeholder="Cari snippet publik..."
                            className="
                                bg-zinc-900 border border-zinc-700 focus:border-emerald-500
                                rounded-2xl px-5 py-2.5 pl-11 
                                w-[320px] lg:w-[380px] 
                                text-sm text-white 
                                placeholder:text-zinc-500 
                                outline-none transition-all
                                focus:w-[360px] lg:focus:w-[420px]
                            "
                        />
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 w-4 h-4"
                        />
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3">
                    
                    {/* Mobile Search Button */}
                    <button
                        onClick={() => setMobileSearchOpen(true)}
                        className="md:hidden w-10 h-10 flex items-center justify-center 
                            text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-2xl transition-all"
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="w-5 h-5" />
                    </button>

                    {/* Profile Button */}
                    {session?.user ? (
                        <button
                            onClick={handleProfileClick}
                            className="w-10 h-10 rounded-full overflow-hidden border border-emerald-500/30 
                                hover:border-emerald-400 transition-all active:scale-95"
                            title="Dashboard"
                        >
                            <Image
                                src={session.user.image || "/default-avatar.png"}
                                alt={session.user.name || "Profile"}
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                            />
                        </button>
                    ) : (
                        <button
                            onClick={handleProfileClick}
                            className="w-10 h-10 flex items-center justify-center 
                                bg-emerald-500 hover:bg-emerald-400 
                                text-black rounded-full 
                                transition-all active:scale-95"
                            title="Masuk ke Dashboard"
                        >
                            <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
                        </button>
                    )}

                    {/* Login & Register (hanya jika belum login) */}
                    {!session?.user && (
                        <div className="hidden sm:flex items-center gap-2">
                            <Link
                                href="/login"
                                className="text-sm text-zinc-400 hover:text-white px-4 py-2 transition-all"
                            >
                                Masuk
                            </Link>
                            <Link
                                href="/register"
                                className="bg-emerald-500 hover:bg-emerald-400 
                                    text-black font-semibold text-sm 
                                    px-5 py-2.5 rounded-2xl transition-all active:scale-95"
                            >
                                Daftar
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Search Modal */}
            {mobileSearchOpen && (
                <div className="fixed inset-0 bg-black/95 z-[60] md:hidden flex flex-col">
                    <div className="h-16 border-b border-white/10 flex items-center px-4">
                        <div className="flex-1 relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputVal}
                                onChange={(e) => handleChange(e.target.value)}
                                placeholder="Cari snippet publik..."
                                className="w-full bg-zinc-900 border border-zinc-700 focus:border-emerald-500 rounded-2xl px-5 py-3 pl-12 text-white placeholder:text-zinc-500 outline-none"
                            />
                            <FontAwesomeIcon
                                icon={faMagnifyingGlass}
                                className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400 w-5 h-5"
                            />
                        </div>
                        <button
                            onClick={closeMobileSearch}
                            className="ml-4 w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white"
                        >
                            <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}
        </header>
    )
}