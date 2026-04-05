import Sidebar from "@/components/layout/Sidebar"
import DashboardLayout from "@/components/layout/DashboardLayout"
import MobileSidebar from "@/components/layout/MobileSidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <DashboardLayout>
                <div className="flex flex-1 overflow-hidden">
                    {/* desktop — hidden di tablet ke bawah */}
                    <div className="hidden md:block">
                        <Sidebar />
                    </div>
                    <main className="flex-1 overflow-y-auto bg-[var(--bg2)]">
                        {children}
                    </main>
                </div>
                {/* mobile sidebar — drawer overlay */}
                <MobileSidebar />
            </DashboardLayout>
        </div>
    )
}