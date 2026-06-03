"use client"

import Link from "next/link"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faChevronDown,
  faPlus,
  faGear,
} from "@fortawesome/free-solid-svg-icons"
import WorkspaceRoleBadge from "./WorkspaceRoleBadge"

interface WorkspaceHeaderProps {
  workspaceId: number
  name: string
  description: string | null
  inviteCode: string
  snippetsCount: number
  membersCount: number
  role: "OWNER" | "EDITOR" | "VIEWER"
  canEdit: boolean
  isOwner: boolean
}

export default function WorkspaceHeader({
  workspaceId,
  name,
  description,
  inviteCode,
  snippetsCount,
  membersCount,
  role,
  canEdit,
  isOwner,
}: WorkspaceHeaderProps) {
  const [open, setOpen] = useState(false)

  return (
    <section className="shrink-0 border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="flex items-center justify-between gap-3 px-5 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="w-8 h-8 rounded-lg border border-[var(--border)] text-[var(--text3)] hover:text-[var(--em)] hover:bg-[var(--surface2)] transition-all shrink-0"
            aria-label={open ? "Tutup detail workspace" : "Buka detail workspace"}
          >
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`w-3 h-3 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          <div className="min-w-0">
            <h1 className="text-[17px] font-bold tracking-[-0.3px] truncate">
              {name}
            </h1>

            {!open && (
              <p className="text-[11px] text-[var(--text4)] truncate">
                {role} • {snippetsCount} snippets • {membersCount} members
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {canEdit && (
            <>
              <Link
                href={`/workspaces/${workspaceId}?action=add-existing`}
                className="hidden sm:flex px-3 py-2 rounded-lg border border-[var(--border)] text-[12px] text-[var(--text2)] hover:bg-[var(--surface2)] transition-all"
              >
                Add Existing
              </Link>

              <Link
                href={`/snippets/new?workspaceId=${workspaceId}`}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--em)] text-[#0a0a0a] text-[12px] font-semibold hover:opacity-90 transition-all"
              >
                <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                <span className="hidden sm:inline">New Snippet</span>
              </Link>
            </>
          )}

          {isOwner && (
            <button className="w-9 h-9 rounded-lg border border-[var(--border)] text-[var(--text3)] hover:text-[var(--em)] hover:bg-[var(--surface2)] transition-all">
              <FontAwesomeIcon icon={faGear} className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <WorkspaceRoleBadge role={role} />

                <span className="text-[10px] uppercase tracking-[1.6px] text-[var(--text4)] font-semibold">
                  Private Workspace
                </span>
              </div>

              <p className="text-[13px] text-[var(--text3)] max-w-3xl">
                {description || "Tidak ada deskripsi workspace."}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text3)]">
                  {snippetsCount} snippets
                </span>

                <span className="px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text3)]">
                  {membersCount} members
                </span>

                <span className="px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--em-dim)] font-mono">
                  {inviteCode}
                </span>
              </div>

              {canEdit && (
                <div className="flex sm:hidden flex-wrap gap-2 mt-3">
                  <Link
                    href={`/workspaces/${workspaceId}?action=add-existing`}
                    className="px-3 py-2 rounded-lg border border-[var(--border)] text-[12px] text-[var(--text2)] hover:bg-[var(--surface2)] transition-all"
                  >
                    Add Existing
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}