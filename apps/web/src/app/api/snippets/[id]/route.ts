import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { id } = await params

    const snippet = await prisma.snippet.findFirst({
        where: {
            id: Number(id),
            userId: Number(session.user.id)
        },
        include: { tags: { include: { tag: true } } }
    })

    if (!snippet) return NextResponse.json({ message: "Tidak ditemukan" }, { status: 404 })

    return NextResponse.json({ snippet })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const { title, language, description, code, tags } = await req.json()

    await prisma.snippetTag.deleteMany({
        where: { snippetId: Number(id) }
    })

    const snippet = await prisma.snippet.update({
        where: { id: Number(id) },
        data: {
            title,
            language,
            description,
            code,
            tags: {
                create: tags?.map((tagName: string) => ({
                    tag: {
                        connectOrCreate: {
                            where: { name: tagName },
                            create: { name: tagName }
                        }
                    }
                })) ?? []
            }
        }
    })

    return NextResponse.json({ snippet })
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { id } = await params

    await prisma.snippet.delete({
        where: {
            id: Number(id),
            userId: Number(session.user.id)
        }
    })

    return NextResponse.json({ message: "Snippet berhasil dihapus" })
}