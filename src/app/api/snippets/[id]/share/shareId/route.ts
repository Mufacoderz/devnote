import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ shareId: string }> }
) {
    const { shareId } = await params

    if (!shareId) {
        return NextResponse.json({ error: "Invalid share ID" }, { status: 400 })
    }

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
            user: {
                select: {
                    name: true,
                    avatar: true,
                }
            },
            tags: {
                select: {
                    tag: {
                        select: { name: true }
                    }
                }
            }
        }
    })

    if (!snippet) {
        return NextResponse.json({ error: "Snippet not found" }, { status: 404 })
    }

    // Flatten tags
    const tags = snippet.tags.map(t => t.tag.name)

    return NextResponse.json({
        snippet: {
            ...snippet,
            tags,
        }
    })
}