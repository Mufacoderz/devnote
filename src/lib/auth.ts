import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // cek apakah emil dikirim
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const email = credentials.email as string
                const password = credentials.password as string

                // caro user di db berdasarkan email
                const user = await prisma.user.findUnique({
                    where: { email }
                });

                //kalau user tidk ditemukan
                if (!user) {
                    return null;
                }

                // cocokkan pw
                const isValid = await bcrypt.compare(password, user.password);

                //kalau pw salah
                if (!isValid) {
                    return null;
                }

                //kalau semua valid, return user
                return {
                    id: String(user.id),
                    email: user.email,
                    name: user.name,
                }
            }
        })
    ],
    //ini atur gmna session user disimpan setelah login
    session: {
        strategy: "jwt"
    },

    //klo ini atur halaman login, kalau user belum login terus akses halaman yang butuh auth, dia bakal diarahin ke halaman login ini
    pages: {
        signIn: "/login"
    },

    callbacks: {
        jwt({ token, user }) {
            if (user) token.id = user.id
            return token
        },
        session({ session, token }) {
            if (token.id) session.user.id = token.id as string
            return session
        }
    }
})