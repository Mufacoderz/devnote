import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const userId = Number(session.user.id)

    const snippets = await prisma.snippet.findMany({
        where: { userId },
        select: {
            language: true,
            copyCount: true,
            isFavorite: true,
            isPublic: true,
            tags: { select: { tag: { select: { name: true } } } }
        }
    })

    const langMap = snippets.reduce<Record<string, number>>((acc, s) => {
        acc[s.language] = (acc[s.language] ?? 0) + 1
        return acc
    }, {})
    const languages = Object.entries(langMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)

    const tagMap = snippets.reduce<Record<string, number>>((acc, s) => {
        s.tags.forEach(t => {
            acc[t.tag.name] = (acc[t.tag.name] ?? 0) + 1
        })
        return acc
    }, {})
    const tags = Object.entries(tagMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)

    return NextResponse.json({
        totalSnippets: snippets.length,
        totalCopies: snippets.reduce((acc, s) => acc + s.copyCount, 0),
        totalFavorites: snippets.filter(s => s.isFavorite).length,
        languages,
        tags,
    })
}