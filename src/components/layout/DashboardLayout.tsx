"use client"

import { useState, createContext, useContext } from "react"
import Topbar from "@/components/layout/Topbar"
import SnippetModal from "@/components/snippet/SnippetModal"

// context untuk share state sidebar ke Topbar dan MobileSidebar
export const SidebarContext = createContext<{
    sidebarOpen: boolean
    setSidebarOpen: (value: boolean) => void
}>({
    sidebarOpen: false,
    setSidebarOpen: () => {}
})

export function useSidebar() {
    return useContext(SidebarContext)
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [modalOpen, setModalOpen] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
            <Topbar
                onNewSnippet={() => setModalOpen(true)}
                onToggleSidebar={() => setSidebarOpen(prev => !prev)}
            />
            {children}
            <SnippetModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </SidebarContext.Provider>
    )
}