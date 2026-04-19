import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const snippetId = parseInt(id)

    if (isNaN(snippetId)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const userId = parseInt(session.user.id)

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

    // Toggle shareId (share / unshare)
    const newShareId = snippet.shareId 
        ? null 
        : (()=>{
            const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ"
            let result = ""

            for(let i = 0; i<9; i++){
                result+= chars[Math.floor(Math.random()*chars.length)]
            }
            return result
        })()

    const updated = await prisma.snippet.update({
        where: { id: snippetId },
        data: { shareId: newShareId },
        select: { shareId: true }
    })

    return NextResponse.json({ shareId: updated.shareId })
}