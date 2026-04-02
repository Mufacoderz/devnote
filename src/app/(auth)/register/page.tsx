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
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    name="confirm"
                    placeholder="Konfirmasi Password"
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                />
                {error && <p>{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "Loading..." : "Register"}
                </button>
            </form>
        </div>
    )
}