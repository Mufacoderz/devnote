"use client"

import { useRouter } from "next/navigation"
import SnippetModal from "@/components/snippet/SnippetModal"

interface WorkspaceSnippetModalProps {
  workspaceId: number
}

export default function WorkspaceSnippetModal({
  workspaceId,
}: WorkspaceSnippetModalProps) {
  const router = useRouter()

  const close = () => {
    router.push(`/workspaces/${workspaceId}`)
  }

  return (
    <SnippetModal
      isOpen
      onClose={close}
      snippetToEdit={null}
      workspaceId={workspaceId}
    />
  )
}
