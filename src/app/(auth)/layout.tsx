export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
            <div className="w-full max-w-[400px] px-4">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-[28px] h-[28px] bg-[var(--em)] rounded-[6px] flex items-center justify-center text-[#0a0a0a] font-mono text-[11px] font-bold">
                        &lt;/&gt;
                    </div>
                    <span className="text-[18px] font-semibold tracking-tight">
                        dev<span className="text-[var(--em)]">note</span>
                    </span>
                </div>
                {children}
            </div>
        </div>
    )
}