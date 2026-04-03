"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if (result?.error) {
            setError("Email atau password salah")
            setLoading(false)
            return
        }

        router.push("/dashboard")
    }

    return (
        <div className="min-h-screen grid grid-cols-2">

            {/* Left — Form */}
            <div className="flex flex-col justify-center px-14 py-12 bg-[var(--bg)] relative overflow-hidden">
                {/* Grid bg */}
                <div className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                <div className="relative z-10 max-w-[360px]">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-10">
                        <div className="w-[26px] h-[26px] bg-[var(--em)] rounded-[6px] flex items-center justify-center text-[#0a0a0a] font-mono text-[10px] font-bold shrink-0">
                            &lt;/&gt;
                        </div>
                        <span className="text-[15px] font-semibold tracking-tight">
                            dev<span className="text-[var(--em)]">note</span>
                        </span>
                    </div>

                    <h1 className="text-[32px] font-bold tracking-[-0.8px] leading-[1.1] mb-2">
                        Welcome<br />back.
                    </h1>
                    <p className="text-[14px] text-[var(--text2)] font-light mb-9 leading-relaxed">
                        Sign in to your personal<br />code library.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11.5px] font-medium text-[var(--text2)] tracking-[0.2px]">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="you@email.com"
                                required
                                className="bg-[var(--surface)] border border-[var(--border2)] rounded-lg px-3.5 py-3 text-[14px] text-[var(--text)] placeholder:text-[var(--text3)] outline-none focus:border-[var(--em-dim)] focus:shadow-[0_0_0_3px_var(--em-faint)] transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11.5px] font-medium text-[var(--text2)] tracking-[0.2px]">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••••"
                                required
                                className="bg-[var(--surface)] border border-[var(--border2)] rounded-lg px-3.5 py-3 text-[14px] text-[var(--text)] placeholder:text-[var(--text3)] outline-none focus:border-[var(--em-dim)] focus:shadow-[0_0_0_3px_var(--em-faint)] transition-all"
                            />
                        </div>

                        {error && (
                            <p className="text-[12px] text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[var(--em)] text-[#0a0a0a] font-semibold text-[14px] py-3 rounded-lg hover:bg-[#2bc48a] hover:shadow-[0_4px_24px_var(--em-glow)] hover:-translate-y-[1px] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                        >
                            {loading ? "Signing in..." : "Sign In →"}
                        </button>
                    </form>

                    <p className="text-[13px] text-[var(--text2)] text-center mt-6">
                        Belum punya akun?{" "}
                        <Link href="/register" className="text-[var(--em)] hover:underline font-medium">
                            Buat akun
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right — Green Panel */}
            <div className="relative flex flex-col justify-center px-14 py-12 bg-[var(--em)] overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute w-[400px] h-[400px] rounded-full bg-white/[0.06] -top-[100px] -right-[100px]" />
                <div className="absolute w-[300px] h-[300px] rounded-full bg-white/[0.04] -bottom-[80px] -left-[80px]" />

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-black/15 px-4 py-1.5 rounded-full font-mono text-[11px] font-medium text-black/60 tracking-[0.5px] mb-8">
                        <div className="w-[6px] h-[6px] rounded-full bg-black/35" />
                        PERSONAL CODE LIBRARY
                    </div>

                    <h2 className="text-[38px] font-bold tracking-[-1px] text-[#0a0a0a] leading-[1.15] mb-5">
                        Your code,<br />
                        <span className="text-black/40">always within</span><br />
                        reach.
                    </h2>

                    <p className="text-[15px] text-black/50 font-light leading-relaxed max-w-[340px]">
                        Stop rewriting the same code twice. Save, organize, and instantly reuse your best snippets.
                    </p>
                </div>
            </div>

        </div>
    )
}