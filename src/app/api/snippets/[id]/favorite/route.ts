import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { id } = await params

    // cek kepemilikan dulu
    const snippet = await prisma.snippet.findFirst({
        where: { id: Number(id), userId: Number(session.user.id) }
    })
    if (!snippet) return NextResponse.json({ message: "Tidak ditemukan" }, { status: 404 })

    // toggle — kalau sudah fav jadi tidak fav, dan sebaliknya
    const updated = await prisma.snippet.update({
        where: { id: Number(id) },
        data: { isFavorite: !snippet.isFavorite }
    })

    return NextResponse.json({ isFavorite: updated.isFavorite })
}