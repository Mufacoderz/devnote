import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const snippetId = Number(id)
    const userId = Number(session.user.id)

    const existing = await prisma.like.findUnique({
        where: { userId_snippetId: { userId, snippetId } }
    })

    if (existing) {
        await prisma.like.delete({
            where: { userId_snippetId: { userId, snippetId } }
        })
        const count = await prisma.like.count({ where: { snippetId } })
        return NextResponse.json({ liked: false, count })
    } else {
        await prisma.like.create({ data: { userId, snippetId } })
        const count = await prisma.like.count({ where: { snippetId } })
        return NextResponse.json({ liked: true, count })
    }
}