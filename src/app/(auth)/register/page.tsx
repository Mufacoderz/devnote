"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
    const router = useRouter()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        //ambil value dru form
        const formData = new FormData(e.currentTarget)
        const name = formData.get("name") as string
        const email = formData.get("email") as string
        // const password = formData.get("password") as string

        //validasi pw
        if (password !== confirm) {
            setError("Password dan konfirmasi tidak cocok")
            setLoading(false)
            return
        }

        // kirim data ke api
        const result = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        })

        //kalau api retunr error muncul pesan ini
        if (!result.ok) {
            setError("Gagal registrasi")
            setLoading(false)
            return
        }





        router.push("/login")


    }

    return (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-8">
            <h1 className="text-[20px] font-semibold tracking-tight mb-1">Create account</h1>
            <p className="text-[13px] text-[var(--text3)] mb-6">Start your personal code library</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-[var(--text2)]">Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Your name"
                        required
                        className="bg-[var(--surface2)] border border-[var(--border2)] rounded-lg px-3 py-2.5 text-[13px] text-[var(--text)] placeholder:text-[var(--text4)] outline-none focus:border-[var(--em-border)] focus:shadow-[0_0_0_3px_var(--em-faint)] transition-all"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-[var(--text2)]">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="you@email.com"
                        required
                        className="bg-[var(--surface2)] border border-[var(--border2)] rounded-lg px-3 py-2.5 text-[13px] text-[var(--text)] placeholder:text-[var(--text4)] outline-none focus:border-[var(--em-border)] focus:shadow-[0_0_0_3px_var(--em-faint)] transition-all"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-[var(--text2)]">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-[var(--surface2)] border border-[var(--border2)] rounded-lg px-3 py-2.5 text-[13px] text-[var(--text)] placeholder:text-[var(--text4)] outline-none focus:border-[var(--em-border)] focus:shadow-[0_0_0_3px_var(--em-faint)] transition-all"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-[var(--text2)]">Confirm Password</label>
                    <input
                        type="password"
                        name="confirm"
                        placeholder="••••••••"
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                        className="bg-[var(--surface2)] border border-[var(--border2)] rounded-lg px-3 py-2.5 text-[13px] text-[var(--text)] placeholder:text-[var(--text4)] outline-none focus:border-[var(--em-border)] focus:shadow-[0_0_0_3px_var(--em-faint)] transition-all"
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
                    className="bg-[var(--em)] text-[#0a0a0a] font-semibold text-[13px] py-2.5 rounded-lg hover:bg-[#2bc48a] hover:shadow-[0_0_20px_var(--em-glow)] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                >
                    {loading ? "Creating account..." : "Create Account"}
                </button>
            </form>

            <p className="text-[12px] text-[var(--text3)] text-center mt-5">
                Already have an account?{" "}
                <a href="/login" className="text-[var(--em)] hover:underline">Sign in</a>
            </p>
        </div>
    )
}