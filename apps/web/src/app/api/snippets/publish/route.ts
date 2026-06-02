import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const language = searchParams.get('language')
    const tag = searchParams.get('tag')
    const sort = searchParams.get('sort')

    const snippets = await prisma.snippet.findMany({
        where: {
            isPublic: true,
            ...(language && { language }),
            ...(tag && {
                tags: { some: { tag: { name: tag } } }
            }),
        },
        orderBy: sort === 'popular'
            ? { likes: { _count: 'desc' } }
            : sort === 'mostcopied'
                ? { copyCount: 'desc' }
                : { createdAt: 'desc' },
        include: {
            tags: { include: { tag: true } },
            user: { select: { name: true, avatar: true } },
            likes: true,
            _count: { select: { likes: true } }
        },
        take: 20,
    })

    return Response.json(snippets)
}