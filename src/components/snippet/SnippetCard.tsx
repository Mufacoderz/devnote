'use client'

import { Snippet } from "./SnippetDetail"
import { getLang } from "@/lib/languages"
import { useAppStore } from "@/lib/store"

export default function SnippetCard({ snippet, active, onClick }: {
    snippet: Snippet
    active?: boolean
    onClick?: () => void
}) {
    const lang = getLang(snippet.language)
    const isFav = useAppStore(s => s.favoriteIds.has(snippet.id))

    return (
        <div
            onClick={onClick}
            className={`relative pl-3 pr-3 py-3 rounded-[6px] cursor-pointer transition-all border
        ${active
                    ? 'bg-[var(--surface)] border-[var(--em-border)] shadow-[0_0_0_1px_var(--em-border)]'
                    : 'border-transparent hover:bg-[var(--surface2)] hover:border-[var(--border)]'
                }`}
        >
            <div
                className="absolute left-0 top-0 h-full w-[2px] rounded-l-[6px]"
                style={{ background: lang.color }}
            />

            <div className="flex items-center justify-between mb-[5px]">
                <span
                    className="font-mono text-[9px] font-semibold px-[7px] py-[2px] rounded-[3px] border"
                    style={{
                        color: lang.color,
                        borderColor: lang.color + "55",
                        background: lang.color + "18",
                    }}
                >
                    {lang.label}
                </span>

                <span style={{ color: isFav ? '#f59e0b' : 'var(--text3)' }}>
                    {isFav ? (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    ) : (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    )}
                </span>
            </div>

            <div className={`text-[13px] font-medium mb-[5px] truncate tracking-[-0.2px]
        ${active ? 'text-[var(--em)]' : 'text-[var(--text)]'}`}>
                {snippet.title}
            </div>

            <div className="font-mono text-[10px] text-[var(--text3)] truncate mb-[6px]">
                {snippet.code.split('\n')[0]}
            </div>

            <div className="flex gap-1.5 flex-wrap">
                {snippet.tags.map(tag => (
                    <span key={tag} className={`font-mono text-[9px] px-[7px] py-[1px] rounded-full
            ${active
                            ? 'text-[var(--em-dim)] bg-[var(--em-faint)]'
                            : 'text-[var(--text4)] bg-[var(--surface3)]'
                        }`}>
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    )
}