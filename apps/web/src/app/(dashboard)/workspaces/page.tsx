import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import AddExistingSnippetModal from "@/components/workspace/AddExistingSnippetModal"
import WorkspaceSnippetPanel from "@/components/workspace/WorkspaceSnippetPanel"
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader"
import type { Snippet } from "@/components/snippet/SnippetDetail"

interface PageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    action?: string
  }>
}

export default async function WorkspaceDetailPage({
  params,
  searchParams,
}: PageProps) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const userId = Number(session.user.id)
  const { id } = await params
  const { action } = await searchParams

  const workspaceId = Number(id)

  if (Number.isNaN(workspaceId)) {
    notFound()
  }

  const member = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
  })

  if (!member) {
    notFound()
  }

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: {
      _count: {
        select: {
          snippets: true,
          members: true,
        },
      },
    },
  })

  if (!workspace) {
    notFound()
  }

  const workspaceSnippets = await prisma.workspaceSnippet.findMany({
    where: { workspaceId },
    include: {
      snippet: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const canEdit = member.role === "OWNER" || member.role === "EDITOR"
  const isOwner = member.role === "OWNER"

  const availableSnippets = canEdit
    ? await prisma.snippet.findMany({
        where: {
          userId,
          workspaces: {
            none: {
              workspaceId,
            },
          },
        },
        select: {
          id: true,
          title: true,
          language: true,
          description: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    : []

  const snippets = workspaceSnippets.map((item) => {
    const snippet: Snippet = {
      id: item.snippet.id,
      title: item.snippet.title,
      description: item.snippet.description,
      code: item.snippet.code,
      language: item.snippet.language,
      isPublic: item.snippet.isPublic,
      isFavorite: item.snippet.isFavorite,
      copyCount: item.snippet.copyCount,
      createdAt: item.snippet.createdAt.toISOString(),
      shareId: item.snippet.shareId,
      tags: item.snippet.tags.map(({ tag }) => tag.name),
    }

    return {
      workspaceId: item.workspaceId,
      snippetId: item.snippetId,
      snippet,
      authorName:
        item.snippet.user?.name ||
        item.snippet.user?.email ||
        "Unknown",
    }
  })

  return (
    <main className="h-[calc(100vh-64px)] bg-[var(--bg2)] text-[var(--text)] flex flex-col overflow-hidden">
      <WorkspaceHeader
        workspaceId={workspaceId}
        name={workspace.name}
        description={workspace.description}
        inviteCode={workspace.inviteCode}
        snippetsCount={workspace._count.snippets}
        membersCount={workspace._count.members}
        role={member.role}
        canEdit={canEdit}
        isOwner={isOwner}
      />

      {snippets.length > 0 ? (
        <WorkspaceSnippetPanel
          workspaceId={workspaceId}
          snippets={snippets}
          canEdit={canEdit}
        />
      ) : (
        <div className="flex-1 min-h-0 flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">
              Belum ada snippet di workspace ini
            </h3>

            <p className="text-sm text-[var(--text3)] mb-5">
              Tambahkan snippet baru atau ambil dari library pribadi kamu.
            </p>

            {canEdit && (
              <div className="flex justify-center gap-2">
                <Link
                  href={`/workspaces/${workspaceId}?action=add-existing`}
                  className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm text-[var(--text2)] hover:bg-[var(--surface2)] transition-all"
                >
                  Add Existing
                </Link>

                <Link
                  href={`/snippets/new?workspaceId=${workspaceId}`}
                  className="px-4 py-2 rounded-lg bg-[var(--em)] text-[#0a0a0a] text-sm font-semibold hover:opacity-90 transition-all"
                >
                  New Snippet
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {action === "add-existing" && canEdit && (
        <AddExistingSnippetModal
          workspaceId={workspaceId}
          snippets={availableSnippets}
        />
      )}
    </main>
  )
}