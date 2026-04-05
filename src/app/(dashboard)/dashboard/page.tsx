import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import SnippetList from "@/components/snippet/SnippetList"
import { Snippet } from "@/components/snippet/SnippetDetail"

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ lang?: string; tag?: string; filter?: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  // await searchParams karena Next.js 15+ searchParams adalah Promise
  const { lang, tag, filter } = await searchParams

  const rawSnippets = await prisma.snippet.findMany({
    where: {
      userId: Number(session.user.id),
      ...(lang && { language: lang }),
      ...(tag && { tags: { some: { tag: { name: tag } } } }),
      ...(filter === "favorites" && { isFavorite: true }),
    },
    include: { tags: { include: { tag: true } } },
    orderBy: { createdAt: "desc" }
  })

  const snippets: Snippet[] = rawSnippets.map(s => ({
    id: s.id,
    title: s.title,
    language: s.language,
    description: s.description ?? null,
    code: s.code,
    copyCount: s.copyCount,
    isFavorite: s.isFavorite,
    createdAt: s.createdAt.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }),
    tags: s.tags.map(t => t.tag.name)
  }))

  return (
    <div className="h-full overflow-hidden">
      <SnippetList snippets={snippets} />
    </div>
  )
}