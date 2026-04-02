"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

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

        router.push("/")

        
    }

    return (
            <div>
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
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
                        required
                    />
                    {error && <p>{error}</p>}
                    <button type="submit" disabled={loading}>
                        {loading ? "Loading..." : "Login"}
                    </button>
                </form>
            </div>
        )
}