interface Snippet {
    id: number
    title: string
    language: string
    code: string
    tags: string[]
    copyCount: number
    createdAt: string
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
    typescript: 'bg-[var(--ts)]',
    javascript: 'bg-[var(--js)]',
    php: 'bg-[var(--php)]',
    css: 'bg-[var(--css)]',
    sql: 'bg-[var(--sql)]',
    python: 'bg-[var(--python)]',
    html: 'bg-[var(--html)]',
    rust: 'bg-[var(--rust)]',
    go: 'bg-[var(--go)]',
}

export default function SnippetCard({ snippet }: { snippet: Snippet }) {
    const lang = snippet.language.toLowerCase()
const pipClass = langPip[lang] ?? 'bg-white/10 text-white/50 border-white/10'
const stripeClass = langStripe[lang] ?? 'bg-white/30'

    return (
        <div className="relative bg-[var(--surface)] border border-[var(--border)] rounded-[10px] overflow-hidden hover:border-[var(--border2)] hover:-translate-y-[1px] hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all group">

            {/* Stripe kiri */}
            <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${stripeClass}`} />

            {/* Header */}
            <div className="flex items-center justify-between pl-5 pr-4 py-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`font-mono text-[10px] font-semibold px-2 py-[3px] rounded-[4px] border shrink-0 ${pipClass}`}>
                        {snippet.language.toUpperCase().slice(0, 3)}
                    </span>
                    <span className="text-[14px] font-medium text-[var(--text)] tracking-[-0.2px] truncate">
                        {snippet.title}
                    </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <div className="flex gap-1.5">
                        {snippet.tags.map(tag => (
                            <span key={tag} className="font-mono text-[10px] text-[var(--text3)] bg-[var(--surface2)] px-2 py-[2px] rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <button className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-[5px] rounded-[6px] border border-[var(--border2)] text-[var(--text3)] hover:border-[var(--em-border)] hover:text-[var(--em)] hover:bg-[var(--em-faint)] transition-all">
                        Salin
                    </button>
                </div>
            </div>

            {/* Code */}
            <div className="bg-[#080a08] pl-5 pr-4 py-3 max-h-[160px] overflow-hidden">
                <pre className="font-mono text-[11.5px] text-[var(--text2)] leading-[1.7] overflow-hidden">
                    <code>{snippet.code}</code>
                </pre>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pl-5 pr-4 py-2 border-t border-[var(--border)]">
                <span className="font-mono text-[11px] text-[var(--text3)]">
                    {snippet.createdAt}
                </span>
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--text3)]">
                    <div className="w-[4px] h-[4px] rounded-full bg-[var(--em)]" />
                    {snippet.copyCount} disalin
                </div>
            </div>

        </div>
    )
}