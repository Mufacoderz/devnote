// // import ExploreClient from "./_components/ExploreClient"
// import { prisma } from "@/lib/prisma"

// async function getPublicSnippets() {
//     const snippets = await prisma.snippet.findMany({
//         where: { isPublic: true },
//         orderBy: { createdAt: 'desc' },
//         include: {
//             tags: { include: { tag: true } },
//             user: { select: { name: true, avatar: true } },
//             _count: { select: { likes: true } }
//         },
//         take: 20,
//     })
//     return snippets
// }

// export default async function ExplorePage() {
//     const snippets = await getPublicSnippets()
//     return <ExploreClient initialSnippets={snippets} />
// }