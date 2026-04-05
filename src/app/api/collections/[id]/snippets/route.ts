import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET — ambil snippet dalam collection
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { id } = await params

    const collection = await prisma.collection.findFirst({
        where: { id: Number(id), userId: Number(session.user.id) },
        include: {
            snippets: {
                include: {
                    snippet: {
                        include: { tags: { include: { tag: true } } }
                    }
                }
            }
        }
    })

    if (!collection) return NextResponse.json({ message: "Tidak ditemukan" }, { status: 404 })

    return NextResponse.json({ collection })
}

// POST — tambah snippet ke collection
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const { snippetId } = await req.json()

    await prisma.snippetCollection.create({
        data: {
            collectionId: Number(id),
            snippetId: Number(snippetId)
        }
    })

    return NextResponse.json({ ok: true })
}

// DELETE — hapus snippet dari collection
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const { snippetId } = await req.json()

    await prisma.snippetCollection.delete({
        where: {
            snippetId_collectionId: {
                snippetId: Number(snippetId),
                collectionId: Number(id)
            }
        }
    })

    return NextResponse.json({ ok: true })
}