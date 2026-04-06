import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { id } = await params

    // TODO: query ke prisma
    // cari semua SnippetCollection where snippetId = id
    // include collection { select: { id, name } }
    // return array of { id, name }
    const assigned = await prisma.snippetCollection.findMany({
        where: { snippetId: Number(id) },
        include: {
            collection: {
                select: { id: true, name: true }
            }
        }
    })

    // TODO: transform result jadi array of { id, name }
    // hint: assigned.map(a => a.collection)
    return NextResponse.json(assigned.map(a => a.collection))
}