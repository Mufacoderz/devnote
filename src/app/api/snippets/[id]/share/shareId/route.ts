import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
    req: NextRequest,
    { params }: { params: { shareId: string } }
) {
    const { shareId } = params

    if (!shareId) {
        return NextResponse.json({ error: "Invalid share ID" }, { status: 400 })
    }

    // 1. Fetch snippet by shareId — no auth required
    // Include user untuk profile header, tags untuk display
    const snippet = await prisma.snippet.findUnique({
        where: { shareId },
        select: {
            id: true,
            title: true,
            description: true,
            code: true,
            language: true,
            isPublic: true,
            copyCount: true,
            createdAt: true,
            // user untuk header profile di halaman share
            user: {
                select: {
                    name: true,
                    avatar: true,
                }
            },
            // tags untuk badge di header
            tags: {
                select: {
                    tag: {
                        select: { name: true }
                    }
                }
            }
        }
    })

    // 2. Kalau tidak ditemukan berarti shareId invalid
    // atau sudah di-unshare (shareId di-set null di DB)
    if (!snippet) {
        return NextResponse.json({ error: "Snippet not found" }, { status: 404 })
    }

    // 3. Flatten tags dari relasi pivot jadi array string biasa
    // dari [{ tag: { name: "react" } }] → ["react", "nextjs"]
    const tags = snippet.tags.map(t => t.tag.name)

    return NextResponse.json({
        snippet: {
            ...snippet,
            tags,
        }
    })
}