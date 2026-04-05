import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// DELETE — hapus collection
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { id } = await params

    await prisma.collection.delete({
        where: {
            id: Number(id),
            userId: Number(session.user.id)
        }
    })

    return NextResponse.json({ message: "Collection berhasil dihapus" })
}

// PUT — rename collection
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const { name } = await req.json()

    const collection = await prisma.collection.update({
        where: {
            id: Number(id),
            userId: Number(session.user.id)
        },
        data: { name: name.trim() }
    })

    return NextResponse.json({ collection })
}