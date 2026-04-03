'use client'

import { Snippet } from "./SnippetDetail"

const langLabel: Record<string, string> = {
    typescript: 'TS', javascript: 'JS', php: 'PHP',
    css: 'CSS', sql: 'SQL', python: 'PY',
    html: 'HTML', rust: 'RS', go: 'GO',
}

const langPip: Record<string, string> = {
    typescript: 'bg-[rgba(96,165,250,0.1)] text-[var(--ts)] border-[rgba(96,165,250,0.2)]',
    javascript: 'bg-[rgba(251,191,36,0.1)] text-[var(--js)] border-[rgba(251,191,36,0.2)]',
    php: 'bg-[rgba(167,139,250,0.1)] text-[var(--php)] border-[rgba(167,139,250,0.2)]',
    css: 'bg-[rgba(56,189,248,0.1)] text-[var(--css)] border-[rgba(56,189,248,0.2)]',
    sql: 'bg-[var(--em-faint)] text-[var(--sql)] border-[var(--em-border)]',
    python: 'bg-[rgba(74,222,128,0.1)] text-[var(--python)] border-[rgba(74,222,128,0.2)]',
    html: 'bg-[rgba(251,113,133,0.1)] text-[var(--html)] border-[rgba(251,113,133,0.2)]',
    rust: 'bg-[rgba(251,146,60,0.1)] text-[var(--rust)] border-[rgba(251,146,60,0.2)]',
    go: 'bg-[rgba(103,232,249,0.1)] text-[var(--go)] border-[rgba(103,232,249,0.2)]',
}

const langStripe: Record<string, string> = {
    typescript: 'bg-[var(--ts)]', javascript: 'bg-[var(--js)]',
    php: 'bg-[var(--php)]', css: 'bg-[var(--css)]',
    sql: 'bg-[var(--sql)]', python: 'bg-[var(--python)]',
    html: 'bg-[var(--html)]', rust: 'bg-[var(--rust)]',
    go: 'bg-[var(--go)]',
}

export default function SnippetCard({ snippet, active, onClick }: {
    snippet: Snippet
    active?: boolean
    onClick?: () => void
}) {
    const lang = snippet.language.toLowerCase()
    const pipClass = langPip[lang] ?? 'bg-white/10 text-white/50 border-white/10'
    const stripeClass = langStripe[lang] ?? 'bg-white/30'

    return (
        <div
            onClick={onClick}
            className={`relative pl-3 pr-3 py-3 rounded-[6px] cursor-pointer transition-all border
        ${active
                    ? 'bg-[var(--surface)] border-[var(--em-border)] shadow-[0_0_0_1px_var(--em-border)]'
                    : 'border-transparent hover:bg-[var(--surface2)] hover:border-[var(--border)]'
                }`}
        >
            <div className={`absolute left-0 top-[6px] bottom-[6px] w-[2px] rounded-full ${stripeClass}`} />

            <div className="flex items-center justify-between mb-[5px]">
                <span className={`font-mono text-[9px] font-semibold px-[7px] py-[2px] rounded-[3px] border ${pipClass}`}>
                    {langLabel[lang] ?? snippet.language.toUpperCase().slice(0, 3)}
                </span>
                <span className="font-mono text-[10px] text-[var(--text4)]">{snippet.createdAt}</span>
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