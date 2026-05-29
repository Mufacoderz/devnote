import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import WorkspaceCard from "@/components/workspace/WorkspaceCard"
import CreateWorkspaceModal from "@/components/workspace/CreateWorkspaceModal"
import JoinWorkspaceModal from "@/components/workspace/JoinWorkspaceModal"

interface PageProps {
  searchParams: Promise<{
    action?: string
  }>
}

export default async function WorkspacesPage({ searchParams }: PageProps) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const params = await searchParams
  const action = params.action

  const userId = Number(session.user.id)

  const memberships = await prisma.workspaceMember.findMany({
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
    orderBy: {
      createdAt: "desc",
    },
  })

  const workspaces = memberships.map((member) => ({
    id: member.workspace.id,
    name: member.workspace.name,
    description: member.workspace.description,
    inviteCode: member.workspace.inviteCode,
    role: member.role,
    snippetsCount: member.workspace._count.snippets,
    membersCount: member.workspace._count.members,
    createdAt: member.workspace.createdAt.toISOString(),
  }))

  return (
    <main className="min-h-full bg-[var(--bg)] text-[var(--text)]">
      <div className="max-w-6xl mx-auto px-5 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
          <div>
            <p className="text-[11px] uppercase tracking-[2px] text-[var(--em)] font-semibold mb-2">
              Collaborative Snippets
            </p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Workspaces
            </h1>
            <p className="text-sm text-[var(--text3)] mt-2 max-w-xl">
              Kelola snippet bareng tim, project, kelas, atau hackathon tanpa
              share link satu-satu kayak kurir paket nyasar.
            </p>
          </div>

          <div className="flex gap-2">
            <a
              href="/workspaces?action=join"
              className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition-all"
            >
              Gabung Workspace
            </a>

            <a
              href="/workspaces?action=create"
              className="px-4 py-2 rounded-lg bg-[var(--em)] text-[#0a0a0a] text-sm font-semibold hover:opacity-90 transition-all"
            >
              Buat Workspace
            </a>
          </div>
        </div>

        {workspaces.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {workspaces.map((workspace) => (
              <WorkspaceCard key={workspace.id} workspace={workspace} />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-[var(--border)] rounded-2xl bg-[var(--surface)] p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[var(--em-faint)] border border-[var(--em-border)] mx-auto mb-4 flex items-center justify-center text-[var(--em)]">
              #
            </div>

            <h2 className="text-lg font-semibold mb-2">
              Belum ada workspace
            </h2>

            <p className="text-sm text-[var(--text3)] max-w-md mx-auto mb-5">
              Mulai bikin workspace buat project kamu, atau gabung pakai invite
              code dari teman.
            </p>

            <div className="flex justify-center gap-2">
              <a
                href="/workspaces?action=join"
                className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition-all"
              >
                Gabung Workspace
              </a>

              <a
                href="/workspaces?action=create"
                className="px-4 py-2 rounded-lg bg-[var(--em)] text-[#0a0a0a] text-sm font-semibold hover:opacity-90 transition-all"
              >
                Buat Workspace
              </a>
            </div>
          </div>
        )}
      </div>

      {action === "create" && <CreateWorkspaceModal />}
      {action === "join" && <JoinWorkspaceModal />}
    </main>
  )
}