import { Suspense } from "react"
import Sidebar from "@/components/layout/Sidebar"
import DashboardLayout from "@/components/layout/DashboardLayout"
import MobileSidebar from "@/components/layout/MobileSidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <DashboardLayout>
                <div className="flex flex-1 overflow-hidden">
                    <div className="hidden lg:block">
                        <Suspense fallback={<div className="w-[260px] shrink-0 border-r border-[var(--border)] bg-[var(--surface)]" />}>
                            <Sidebar />
                        </Suspense>
                    </div>
                    <main className="flex-1 overflow-y-auto bg-[var(--bg2)]">
                        {children}
                    </main>
                </div>
                <Suspense fallback={null}>
                    <MobileSidebar />
                </Suspense>
            </DashboardLayout>
        </div>
    )
}