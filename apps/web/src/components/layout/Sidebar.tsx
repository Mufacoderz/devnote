import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import SidebarClient from "./sidebar/SidebarClient"


export default async function Sidebar() {
    const session = await auth()
    const userId = Number(session?.user?.id)

    // ambil semua snippet user — untuk hitung language + total
    const snippets = await prisma.snippet.findMany({
        where: { userId },
        select: {
            language: true,
            copyCount: true,
            tags: { select: { tag: { select: { name: true } } } },
            isFavorite: true,
            isPublic: true,
        }
    })

    const workspaces = await prisma.workspaceMember.findMany({
        where: { userId },
        include: {
            workspace: {
                include: {
                    _count: {
                        select: {
                            snippets: true,
                            members: true,
                        },
                    },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    })

    const workspaceSnippetsCount = await prisma.snippet.count({
        where: {
            workspaces: {
                some: {
                    workspace: {
                        members: {
                            some: { userId },
                        },
                    },
                },
            },
        },
    })

    // // hitung jumlah per language, urutkan dari terbanyak
    // const langMap = snippets.reduce<Record<string, number>>((acc, s) => {
    //     acc[s.language] = (acc[s.language] ?? 0) + 1
    //     return acc
    // }, {})
    // const languages = Object.entries(langMap)
    //     .map(([name, count]) => ({ name, count }))
    //     .sort((a, b) => b.count - a.count)

    // kumpulkan semua tag unik + hitung kemunculannya
    const tagMap = snippets.reduce<Record<string, number>>((acc, s) => {
        s.tags.forEach(t => {
            acc[t.tag.name] = (acc[t.tag.name] ?? 0) + 1
        })
        return acc
    }, {})
    const tags = Object.entries(tagMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)

    // total copies dari semua snippet
    const totalCopies = snippets.reduce((acc, s) => acc + s.copyCount, 0)

    //snippet yg dicpy
    // const totalSnippetCopied = snippets.filter(s => s.copyCount>0).length


    //total fav
    const totalFavorites = snippets.filter(s => s.isFavorite).length

    const totalPublic = snippets.filter(s => s.isPublic).length



    return (
        <SidebarClient
            totalSnippets={snippets.length}
            totalCopies={totalCopies}
            totalFavorites={totalFavorites}
            totalPublic={totalPublic}
            // totalSnippetCopied={totalSnippetCopied}
            // languages={languages}
            tags={tags}
            workspaceSnippetsCount={workspaceSnippetsCount}
            workspaces={workspaces.map((member) => ({
                id: member.workspace.id,
                name: member.workspace.name,
                role: member.role,
                snippetsCount: member.workspace._count.snippets,
            }))}

        />
    )
}