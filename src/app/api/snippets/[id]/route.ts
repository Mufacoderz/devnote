import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// cek login lalu ambil snippet by id
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const snippet = await prisma.snippet.findFirst({
        where: {
            id: Number(params.id),
            userId: Number(session.user.id)
        },
        include: { tags: { include: { tag: true } } }
    })

    // kalau tk ditemukan atau punya user lain
    if (!snippet) return NextResponse.json({ message: "Tidak ditemukan" }, { status: 404 })

    return NextResponse.json({ snippet })
}


//  cek login → hapus tags lama → update snippet + buat tags baru
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { title, language, code, tags } = await req.json()

    // tags lama dihapus dulu karena many-to-many tidak bisa di-update langsung
    // harus delete pivot lama → create pivot baru
    await prisma.snippetTag.deleteMany({
        where: { snippetId: Number(params.id) }
    })

    // update snippet + buat relasi tag baru
    const snippet = await prisma.snippet.update({
        where: { id: Number(params.id) },
        data: {
            title,
            language,
            code,
            tags: {
                create: tags?.map((tagName: string) => ({
                    tag: {
                        connectOrCreate: {
                            where: { name: tagName },
                            create: { name: tagName } // buat tag baru kalau belum ada
                        }
                    }
                })) ?? []
            }
        }
    })

    return NextResponse.json({ snippet })
}

//cek login → hapus snippet (cascade otomatis hapus SnippetTag)
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    // userId disertakan biar user hanya bisa hapus snippet miliknya sendiri
    await prisma.snippet.delete({
        where: {
            id: Number(params.id),
            userId: Number(session.user.id)
        }
    })

    return NextResponse.json({ message: "Snippet berhasil dihapus" })
}