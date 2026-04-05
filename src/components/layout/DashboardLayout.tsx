"use client"

import { useState } from "react"
import Topbar from "@/components/layout/Topbar"
import SnippetModal from "@/components/snippet/SnippetModal"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [modalOpen, setModalOpen] = useState(false)

    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            <Topbar onNewSnippet={() => setModalOpen(true)} />
            <main className="flex-1 overflow-y-auto bg-[var(--bg2)]">
                {children}
            </main>
            <SnippetModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    )
}