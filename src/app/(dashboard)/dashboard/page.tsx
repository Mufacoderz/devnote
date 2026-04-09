import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import SnippetList from "@/components/snippet/SnippetList"
import { Snippet } from "@/components/snippet/SnippetDetail"

async function DashboardContent({
  searchParams,
}: {
  searchParams: Promise<{ 
    lang?: string; 
    tag?: string; 
    filter?: string; 
    collection?: string; 
    search?: string 
  }>
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const { lang, tag, filter, collection, search } = await searchParams

  const rawSnippets = await prisma.snippet.findMany({
    where: {
      userId: Number(session.user.id),
      ...(lang && { language: lang }),
      ...(tag && { tags: { some: { tag: { name: tag } } } }),
      ...(filter === "favorites" && { isFavorite: true }),
      ...(collection && { collections: { some: { collectionId: Number(collection) } } }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { code: { contains: search } },
          { description: { contains: search } },
          { tags: { some: { tag: { name: { contains: search } } } } },
        ]
      }),
    },
    orderBy: filter === "most-copied"
      ? { copyCount: "desc" }
      : { createdAt: "desc" },
    include: { 
      tags: { include: { tag: true } } 
    }
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

  return <SnippetList snippets={snippets} />
}

export default function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    lang?: string; 
    tag?: string; 
    filter?: string; 
    collection?: string; 
    search?: string 
  }>
}) {
  return (
    <div className="h-full overflow-hidden">
      {/* Bungkus dengan Suspense karena kemungkinan SnippetList menggunakan useSearchParams */}
      <Suspense fallback={
        <div className="flex h-full items-center justify-center">
          <p className="text-gray-500">Memuat snippet...</p>
        </div>
      }>
        <DashboardContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}