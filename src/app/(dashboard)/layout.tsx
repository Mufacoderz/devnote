import Sidebar from "@/components/layout/Sidebar"
import DashboardLayout from "@/components/layout/DashboardLayout"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen flex overflow-hidden">
            <Sidebar />  {/* server component — fetch prisma di sini */}
            <DashboardLayout>
                {children}
            </DashboardLayout>
        </div>
    )
}