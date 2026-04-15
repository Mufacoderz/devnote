"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faUser } from "@fortawesome/free-solid-svg-icons"
import { useDebouncedCallback } from "use-debounce"

interface ExploreTopbarProps {
    search: string
    onSearch: (val: string) => void
}

export default function ExploreTopbar({ search, onSearch }: ExploreTopbarProps) {
    const { data: session } = useSession()
    const router = useRouter()
    const [inputVal, setInputVal] = useState(search)
    const [mobileSearch, setMobileSearch] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const pushDebounced = useDebouncedCallback((val: string) => {
        onSearch(val)
    }, 400)

    const handleChange = (val: string) => {
        setInputVal(val)
        pushDebounced(val)
    }

    useEffect(() => {
        if (mobileSearch && inputRef.current) {
            inputRef.current.focus()
        }
    }, [mobileSearch])

    return (


        <header className="h-14 bg-[#0a0f0c] border-b border-emerald-950/80 flex items-center px-5 sticky top-0 z-50 backdrop-blur-md">
            {/* Mobile Search Overlay
            {mobileSearch && (
                <div className="absolute inset-0 z-50 flex items-center gap-3 px-4 bg-[#0a0f0c] lg:hidden">
                    <div className="relative flex-1">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputVal}
                            onChange={e => handleChange(e.target.value)}
                            placeholder="Cari snippet publik..."
                            className="w-full bg-[#111a14] border border-emerald-700 focus:border-emerald-500 rounded-2xl px-5 py-2.5 pl-11 text-sm text-white placeholder:text-emerald-700 outline-none transition-all"
                        />
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 w-4 h-4"
                        />
                    </div>
                    <button
                        onClick={() => setMobileSearch(false)}
                        className="w-10 h-10 flex items-center justify-center text-emerald-400 hover:text-white hover:bg-emerald-950 rounded-xl transition-all"
                    >
                        <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                    </button>
                </div>
            )} */}

            <div className="grid grid-cols-3 items-center w-full">

                <div className="flex items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-8 h-8">
                            <Image
                                src="/emerald-trans.png"
                                alt="devnote"
                                width={32}
                                height={32}
                                className="transition-transform group-hover:scale-110"
                            />
                        </div>
                        <span className="text-xl font-semibold tracking-tighter text-white">
                            dev<span className="text-emerald-400">note</span>
                        </span>
                    </Link>
                </div>

                <div className="hidden lg:flex justify-center">
                    <div className="relative">
                        <input
                            type="text"
                            value={inputVal}
                            onChange={e => handleChange(e.target.value)}
                            placeholder="Cari snippet publik..."
                            className="bg-[#111a14] border border-emerald-900 focus:border-emerald-500 
                    rounded-2xl px-5 py-2.5 pl-11 w-[320px] text-sm text-white 
                    placeholder:text-emerald-700 outline-none transition-all focus:w-[360px]"
                        />
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 w-4 h-4"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                    {/* mobile search */}
                    <button
                        onClick={() => setMobileSearch(true)}
                        className="lg:hidden w-10 h-10 flex items-center justify-center text-emerald-400 hover:text-white hover:bg-emerald-950 rounded-xl transition-all"
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="w-5 h-5" />
                    </button>

                    {session?.user ? (
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-sm px-5 py-2 rounded-2xl transition-all active:scale-95"
                        >
                            <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                            Dashboard
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="text-sm text-emerald-300 hover:text-white px-4 py-2 transition-all"
                            >
                                Masuk
                            </Link>
                            <Link
                                href="/register"
                                className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-sm px-5 py-2 rounded-2xl transition-all active:scale-95"
                            >
                                Daftar
                            </Link>
                        </div>
                    )}
                </div>

            </div>
        </header>
    )
}