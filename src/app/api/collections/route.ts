import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET — ambil semua collection milik user
export async function GET() {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const collections = await prisma.collection.findMany({
        where: { userId: Number(session.user.id) },
        include: {
            _count: { select: { snippets: true } }
        },
        orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ collections })
}

// POST — buat collection baru
export async function POST(req: NextRequest) {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { name } = await req.json()
    if (!name?.trim()) return NextResponse.json({ message: "Nama wajib diisi" }, { status: 400 })

    const collection = await prisma.collection.create({
        data: {
            name: name.trim(),
            userId: Number(session.user.id)
        }
    })

    return NextResponse.json({ collection })
}