import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const userId = Number(session.user.id)

  const [
    totalSnippets,
    totalCopiesResult,
    totalFavorites,
    totalPublic,
    tags,
    workspaceSnippetsCount,
    memberships,
  ] = await Promise.all([
    prisma.snippet.count({
      where: { userId },
    }),

    prisma.snippet.aggregate({
      where: { userId },
      _sum: { copyCount: true },
    }),

    prisma.snippet.count({
      where: {
        userId,
        isFavorite: true,
      },
    }),

    prisma.snippet.count({
      where: {
        userId,
        isPublic: true,
      },
    }),

    prisma.tag.findMany({
      where: {
        snippets: {
          some: {
            snippet: {
              userId,
            },
          },
        },
      },
      select: {
        name: true,
        _count: {
          select: {
            snippets: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.snippet.count({
      where: {
        userId,
        workspaces: {
          some: {
            workspace: {
              members: {
                some: {
                  userId,
                },
              },
            },
          },
        },
      },
    }),

    prisma.workspaceMember.findMany({
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
    }),
  ])

  return NextResponse.json({
    totalSnippets,
    totalCopies: totalCopiesResult._sum.copyCount ?? 0,
    totalFavorites,
    totalPublic,
    workspaceSnippetsCount,
    workspaces: memberships.map((member) => ({
      id: member.workspace.id,
      name: member.workspace.name,
      role: member.role,
      snippetsCount: member.workspace._count.snippets,
    })),
    tags: tags.map((tag) => ({
      name: tag.name,
      count: tag._count.snippets,
    })),
  })
}