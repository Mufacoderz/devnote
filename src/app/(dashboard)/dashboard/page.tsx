import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import SnippetList from "@/components/snippet/SnippetList"
import { Snippet } from "@/components/snippet/SnippetDetail"

export default async function DashboardPage() {

  // cek session
  const session = await auth()
  if (!session?.user) redirect("/login")

  // fetch snippet dari database
  const rawSnippets = await prisma.snippet.findMany({
    where: { userId: Number(session.user.id) },
    include: {
      tags: {
        include: { tag: true }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  // transform ke format yang dipakai komponen
  const snippets: Snippet[] = rawSnippets.map(s => ({
    id: s.id,
    title: s.title,
    language: s.language,
    description: s.description ?? null,
    code: s.code,
    copyCount: s.copyCount,
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