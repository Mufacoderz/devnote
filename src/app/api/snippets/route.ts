import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// ── GET — ambil semua snippet milik user yang login
export async function GET() {

    // cek session, return 401 kalau belum login
    const session = await auth()
    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // ambil semua snippet milik user
    // hint: prisma.snippet.findMany, filter by userId, include tags, urutkan by createdAt desc
    const snippets = await prisma.snippet.findMany({
        where: {userId: Number(session.user.id)},
        include:{
            tags:{
                include: {tag: true}
            }
        },
        orderBy: {createdAt: 'desc'}
    })

    return NextResponse.json({ snippets })
}

// ── POST — buat snippet baru
export async function POST(req: NextRequest) {

    // cek session
    const session = await auth()
    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // ambil data dari request body
    const { title, language, description, code, tags } = await req.json()

    // validasi — return 400 kalau title, language, atau code kosong
    if (!title || !language || !code) {
        return NextResponse.json({ message: "Semua harus diisi" }, { status: 400 })
    }

    // simpan snippet baru ke database
    // hint: prisma.snippet.create, userId dari session.user.id
    const snippet = await prisma.snippet.create({
        data: {
            title,
            language,
            description: description?.trim() || null,
            code,
            userId: Number(session.user.id),
            tags:{
                create: tags.map((tagName: string) => ({
                    tag: {
                        connectOrCreate: {
                            where: { name: tagName },
                            create: { name: tagName }
                        }
                    }
                }))
            }
        }
    })

    return NextResponse.json({ snippet }, { status: 201 })
}