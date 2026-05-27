"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"

interface NavItemProps {
  label: string
  count: number
  active?: boolean
  onClick?: () => void
  onPrefetch?: () => void
  dotColor?: string
  icon?: IconDefinition
}

export default function NavItem({
  label,
  count,
  active,
  onClick,
  onPrefetch,
  dotColor,
  icon,
}: NavItemProps) {
  return (
    <div
      onClick={onClick}
      onPointerEnter={onPrefetch}
      onTouchStart={onPrefetch}
      onFocus={onPrefetch}
      className={`flex items-center justify-between px-2 py-[6px] rounded-[5px] cursor-pointer text-[13px] transition-all
      ${
        active
          ? "bg-[var(--em-faint)] text-[var(--em)] font-medium"
          : "text-[var(--text2)] hover:bg-[var(--em-faint)] hover:text-[var(--text)]"
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        {icon ? (
          <FontAwesomeIcon
            icon={icon}
            className={`w-[12px] h-[12px] shrink-0 transition-all ${
              active ? "text-[var(--em)]" : "text-[var(--text4)]"
            }`}
          />
        ) : (
          <div
            className="w-[5px] h-[5px] rounded-full shrink-0"
            style={{ background: active ? "var(--em)" : dotColor ?? "var(--border2)" }}
          />
        )}

        <span className="truncate">{label}</span>
      </div>

      <span
        className={`font-mono text-[10px] px-2 py-[1px] rounded-full shrink-0
        ${
          active
            ? "text-[var(--em-dim)] bg-[var(--em-faint)]"
            : "text-[var(--text4)] bg-[var(--surface3)]"
        }`}
      >
        {count}
      </span>
    </div>
  )
}