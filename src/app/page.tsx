import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"



export default async function HomePage() {
    const session = await auth()
    if (session?.user) {
        redirect("/dashboard")
    } else {
        return <WelcomePage />
    }
}

function WelcomePage() {
    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0a0a0a] flex items-center justify-center">

            {/* Grid bgsama kayk login page */}
            <div className="absolute inset-0"
                style={{
                    backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    opacity: 0.4
                }}
            />

            <div
                className="absolute inset-y-0 bg-[#34d399]"
                style={{
                    left: "15%",
                    right: "15%",
                    clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)"
                }}
            >
                <div className="absolute w-[500px] h-[500px] rounded-full bg-black/[0.04] -top-[150px] -right-[100px]" />
                <div className="absolute w-[350px] h-[350px] rounded-full bg-black/[0.04] -bottom-[100px] left-[50px]" />
            </div>

            {/* Hero */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-[500px]">

                {/* Logo */}
                <Image
                    src="/black-trans.png"
                    alt="devnote"
                    width={52}
                    height={52}
                    className="mb-6"
                />

                {/* Brand */}
                <p className="font-mono text-[11px] text-black/40 tracking-[3px] uppercase mb-5">
                    devnote
                </p>

                {/* Headline */}
                <h1 className="text-[50px] sm:text-[58px] font-bold tracking-[-2px] text-[#0a0a0a] leading-[1.05] mb-5">
                    Simpan.<br />
                    <span className="text-black/25">Temukan.</span><br />
                    Bagikan.
                </h1>

                {/* Subheadline */}
                <p className="text-[15px] text-black/50 font-light leading-relaxed max-w-[360px] mb-10">
                    Semua snippet kodemu di satu tempat —
                    terorganisir, mudah dicari, siap dipakai kapan saja.
                </p>

                {/* CTA */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/login"
                        className="px-7 py-3 rounded-lg bg-[#0a0a0a] text-white font-semibold text-[14px] hover:bg-[#1c1c1c] transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                    >
                        Masuk
                    </Link>
                    <Link
                        href="/explore"
                        className="px-7 py-3 rounded-lg border border-black/20 text-black/55 font-medium text-[14px] hover:border-black/35 hover:text-black/75 transition-all group flex items-center gap-2"
                    >
                        Jelajahi
                        <span className="group-hover:translate-x-1 transition-transform text-[12px]">→</span>
                    </Link>
                </div>

            </div>

        </div>
    )
}