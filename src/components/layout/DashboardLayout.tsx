"use client"

import { useState } from "react"
import Sidebar from "@/components/layout/Sidebar"
import Topbar from "@/components/layout/Topbar"
import SnippetModal from "@/components/snippet/SnippetModal"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [modalOpen, setModalOpen] = useState(false)

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <Topbar onNewSnippet={() => setModalOpen(true)} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto bg-[var(--bg2)]">
                    {children}
                </main>
            </div>
            <SnippetModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    )
}