"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useSidebar } from "./DashboardLayout"
import SidebarClient from "./SidebarClient"

interface SidebarData {
    totalSnippets: number
    totalCopies: number
    languages: { name: string; count: number }[]
    tags: { name: string; count: number }[]
}

export default function MobileSidebar() {
    const { sidebarOpen, setSidebarOpen } = useSidebar()
    const [data, setData] = useState<SidebarData | null>(null)

    // fetch data sidebar saat drawer dibuka pertama kali
    useEffect(() => {
        if (sidebarOpen && !data) {
            fetch("/api/sidebar")
                .then(res => res.json())
                .then(setData)
                .catch(console.error)
        }
    }, [sidebarOpen, data])

    // tutup saat tekan Escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSidebarOpen(false)
        }
        document.addEventListener("keydown", handleKey)
        return () => document.removeEventListener("keydown", handleKey)
    }, [setSidebarOpen])

    return (
        <AnimatePresence>
            {sidebarOpen && (
                <>
                    {/* overlay */}
                    <motion.div
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />

                    {/* drawer */}
                    <motion.div
                        key="drawer"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed left-0 top-0 h-full z-50 md:hidden"
                        style={{ width: "280px" }}
                        onClick={e => e.stopPropagation()}
                    >
                        {data ? (
                            <SidebarClient
                                totalSnippets={data.totalSnippets}
                                totalCopies={data.totalCopies}
                                languages={data.languages}
                                tags={data.tags}
                            />
                        ) : (
                            // skeleton loading saat data belum ready
                            <aside className="w-full h-full bg-[var(--surface)] border-r border-[var(--border)] flex flex-col gap-3 p-4">
                                {[80, 60, 90, 50, 70].map((w, i) => (
                                    <div
                                        key={i}
                                        className="h-[28px] rounded-[5px] animate-pulse bg-[var(--surface2)]"
                                        style={{ width: `${w}%` }}
                                    />
                                ))}
                            </aside>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}