import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import SnippetList from "@/components/snippet/SnippetList"
import { Snippet } from "@/components/snippet/SnippetDetail"

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ lang?: string; tag?: string; filter?: string; collection?: string; search?: string }>
}) {
  // rcek sesi
  const session = await auth()
  if (!session?.user) redirect("/login")

  // di Next.js 15+ searchParams harus di-await sebelum bisa diakses
  const { lang, tag, filter, collection, search } = await searchParams

  // ambil snippet user sesuai filter dinamis dri url params
  // semua kondisi hanya aktif kalau param-nya ada
  const rawSnippets = await prisma.snippet.findMany({
    where: {
      userId: Number(session.user.id),
      ...(lang && { language: lang }),
      ...(tag && { tags: { some: { tag: { name: tag } } } }),
      ...(filter === "favorites" && { isFavorite: true }),
      ...(collection && { collections: { some: { collectionId: Number(collection) } } }),
      // search mencari di title, code, description, dan nama tag sekaligus
      ...(search && {
        OR: [
          { title: { contains: search } },
          { code: { contains: search } },
          { description: { contains: search } },
          { tags: { some: { tag: { name: { contains: search } } } } },
        ]
      }),
    },
    include: { tags: { include: { tag: true } } },
    orderBy: { createdAt: "desc" }
  })

  // transformasi dari Prisma model ke Snippet interface yang dipakai komponen
  // tags di-flatten dari relasi many-to-many jadi array string biasa
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