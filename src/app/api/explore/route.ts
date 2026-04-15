import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
    const session = await auth()
    const currentUserId = session?.user?.id ? Number(session.user.id) : null

    const { searchParams } = new URL(req.url)
    const sort = searchParams.get("sort") ?? "newest"       // newest | oldest | popular | most-copied
    const lang = searchParams.get("lang") ?? ""
    const search = searchParams.get("search") ?? ""
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"))
    const limit = 10

    const where = {
        isPublic: true,
        ...(lang && { language: lang }),
        ...(search && {
            OR: [
                { title: { contains: search, mode: "insensitive" as const } },
                { description: { contains: search, mode: "insensitive" as const } },
                { tags: { some: { tag: { name: { contains: search, mode: "insensitive" as const } } } } },
            ]
        })
    }

    const orderBy =
        sort === "oldest" ? { createdAt: "asc" as const } :
        sort === "popular" ? { likes: { _count: "desc" as const } } :
        sort === "most-copied" ? { copyCount: "desc" as const } :
        { createdAt: "desc" as const }

    const [snippets, total] = await Promise.all([
        prisma.snippet.findMany({
            where,
            include: {
                tags: { include: { tag: true } },
                user: { select: { id: true, name: true, avatar: true } },
                likes: currentUserId
                    ? { where: { userId: currentUserId }, select: { userId: true } }
                    : false,
                _count: { select: { likes: true } }
            },
            orderBy,
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.snippet.count({ where })
    ])

    const result = snippets.map(s => ({
        id: s.id,
        title: s.title,
        description: s.description,
        code: s.code,
        language: s.language,
        copyCount: s.copyCount,
        createdAt: s.createdAt,
        tags: s.tags.map(t => t.tag.name),
        user: s.user,
        likeCount: s._count.likes,
        likedByMe: currentUserId ? (s.likes as { userId: number }[]).length > 0 : false,
    }))

    return NextResponse.json({
        snippets: result,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    })
}