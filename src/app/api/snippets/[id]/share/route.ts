import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> } // ← Promise
) {
    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params // ← await dulu
    const snippetId = parseInt(id)
    if (isNaN(snippetId)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    // 2. Parse userId dari token (disimpan sebagai string, DB pakai Int)
    const userId = parseInt(session.user.id)

    // 3. Cari snippet, pastikan milik user yang request
    const snippet = await prisma.snippet.findUnique({
        where: { id: snippetId },
        select: { id: true, userId: true, shareId: true }
    })

    if (!snippet) {
        return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    if (snippet.userId !== userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // 4. Toggle logic
    // Kalau shareId sudah ada → unshare (set null)
    // Kalau belum ada → generate shareId baru 12 char
    const newShareId = snippet.shareId
        ? null
        : crypto.randomUUID().replace(/-/g, "").slice(0, 12)

    const updated = await prisma.snippet.update({
        where: { id: snippetId },
        data: { shareId: newShareId },
        select: { shareId: true }
    })

    // 5. Return shareId (string kalau baru di-share, null kalau unshare)
    return NextResponse.json({ shareId: updated.shareId })
}