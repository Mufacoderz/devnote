export { auth as middleware } from "@/lib/auth"

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/snippets/:path*",
        "/collections/:path*",
        "/settings/:path*",
    ]
}