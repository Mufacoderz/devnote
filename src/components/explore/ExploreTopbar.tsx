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


        <header className="fixed top-0 left-0 right-0 h-16 z-50 
bg-gradient-to-b from-black/40 via-black/20 to-transparent
backdrop-blur-xl 
border-b border-white/5 
flex items-center px-5">

            <div className="grid grid-cols-3 items-center w-full">

                <div className="flex items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-8 h-8">
                            <Image
                                src="/emerald-trans.png"
                                alt="devnote"
                                width={32}
                                height={32}
                                className="transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>
                        <span className="text-xl font-semibold tracking-tighter text-white">
                            dev<span className="text-emerald-400">note</span>
                        </span>
                    </Link>
                </div>

                <div className="hidden lg:flex justify-center">
                    <div className="relative group">
                        <input
                            type="text"
                            value={inputVal}
                            onChange={e => handleChange(e.target.value)}
                            placeholder="Cari snippet publik..."
                            className="
                        bg-white/5 
                        border border-white/10 
                        focus:border-emerald-400/60
                        rounded-2xl 
                        px-5 py-2.5 pl-11 
                        w-[320px] text-sm text-white 
                        placeholder:text-white/40 
                        outline-none 
                        backdrop-blur-md
                        transition-all duration-300
                        focus:w-[360px]
                    "
                        />
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400/70 w-4 h-4"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3">

                    <button
                        onClick={() => setMobileSearch(true)}
                        className="lg:hidden w-10 h-10 flex items-center justify-center 
                text-white/70 hover:text-white 
                hover:bg-white/10 rounded-xl transition-all"
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="w-5 h-5" />
                    </button>

                    {session?.user ? (
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="
                        flex items-center gap-2.5 
                        bg-emerald-500/90 hover:bg-emerald-400
                        text-black font-semibold text-sm 
                        px-5 py-2 rounded-2xl 
                        shadow-lg shadow-emerald-900/30
                        transition-all active:scale-95
                    "
                        >
                            <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                            Dashboard
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="text-sm text-white/70 hover:text-white px-4 py-2 transition-all"
                            >
                                Masuk
                            </Link>
                            <Link
                                href="/register"
                                className="
                            bg-emerald-500/90 hover:bg-emerald-400
                            text-black font-semibold text-sm 
                            px-5 py-2 rounded-2xl 
                            shadow-lg shadow-emerald-900/30
                            transition-all active:scale-95
                        "
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