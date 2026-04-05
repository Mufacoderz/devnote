'use client'

import { Snippet } from "./SnippetDetail"
import { getLang } from "@/lib/languages"

export default function SnippetCard({ snippet, active, onClick }: {
    snippet: Snippet
    active?: boolean
    onClick?: () => void
}) {
    const lang = getLang(snippet.language)

    return (
        <div
            onClick={onClick}
            className={`relative pl-3 pr-3 py-3 rounded-[6px] cursor-pointer transition-all border
        ${active
                    ? 'bg-[var(--surface)] border-[var(--em-border)] shadow-[0_0_0_1px_var(--em-border)]'
                    : 'border-transparent hover:bg-[var(--surface2)] hover:border-[var(--border)]'
                }`}
        >
            {/* stripe — pakai inline style karena color dari languages.ts adalah hex, bukan class Tailwind */}
            <div
                className="absolute left-0 top-0 h-full w-[2px] rounded-l-[6px]"
                style={{ background: lang.color }}
            />

            <div className="flex items-center justify-between mb-[5px]">
                {/* pip — pakai class dari languages.ts */}
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