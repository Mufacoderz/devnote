import CopyButton from "./CopyButton"
import CodeBlock from "./CodeBlock"

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

export interface Snippet {
    id: number
    title: string
    language: string
    description: string | null
    code: string
    tags: string[]
    copyCount: number
    createdAt: string
}

export default function SnippetDetail({ snippet }: { snippet: Snippet }) {
    const lang = snippet.language.toLowerCase()
    const pipClass = langPip[lang] ?? 'bg-white/10 text-white/50 border-white/10'

    return (
        <div className="flex-1 flex flex-col overflow-hidden">

            {/* Header */}
            <div className="px-6 py-5 border-b border-[var(--border)] shrink-0">
                <div className="flex items-center gap-2 mb-3">
                    <span className={`font-mono text-[10px] font-semibold px-2 py-[3px] rounded-[4px] border ${pipClass}`}>
                        {langLabel[lang] ?? snippet.language.toUpperCase().slice(0, 3)}
                    </span>
                    <span className="text-[12px] text-[var(--text3)]">{snippet.language}</span>
                </div>

                <h2 className="text-[22px] font-bold tracking-[-0.5px] mb-3">
                    {snippet.title}
                </h2>

                {snippet.description && (
                    <p className="text-[13px] text-[var(--text3)] mb-4 leading-relaxed">
                        {snippet.description}
                    </p>
                )}

                <div className="flex gap-2 mb-4">
                    {snippet.tags.map(tag => (
                        <span key={tag} className="font-mono text-[10px] text-[var(--text3)] bg-[var(--surface2)] border border-[var(--border2)] px-2.5 py-[3px] rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <CopyButton code={snippet.code} />
                    <button className="text-[13px] font-medium px-4 py-2 rounded-lg border border-[var(--border2)] text-[var(--text3)] hover:border-yellow-500/60 hover:text-yellow-300 transition-all">
                        Edit
                    </button>
                    <button className="text-[13px] font-medium px-4 py-2 rounded-lg border border-[var(--border2)] text-[var(--text3)] hover:border-red-500/60 hover:text-red-400 transition-all">
                        Hapus
                    </button>
                </div>

                <div className="flex items-center gap-4 mt-4 font-mono text-[11px] text-[var(--text4)]">
                    <span className="flex items-center gap-1.5">
                        <div className="w-[4px] h-[4px] rounded-full bg-[var(--em)]" />
                        Disimpan {snippet.createdAt}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <div className="w-[4px] h-[4px] rounded-full bg-[var(--em)]" />
                        {snippet.copyCount} kali disalin
                    </span>
                    <span className="flex items-center gap-1.5">
                        <div className="w-[4px] h-[4px] rounded-full bg-[var(--em)]" />
                        Privat
                    </span>
                </div>
            </div>

            {/* Code */}
            <div className="flex-1 overflow-hidden">
                <CodeBlock code={snippet.code} language={snippet.language} />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-2.5 border-t border-[var(--border)] bg-[var(--surface)] shrink-0">
                <div className="flex items-center gap-4 font-mono text-[10px] text-[var(--text4)]">
                    <span>{snippet.code.split('\n').length} baris</span>
                    <span>UTF-8</span>
                    <span>{snippet.language}</span>
                </div>
                <button className="font-mono text-[10px] text-[var(--em-dim)] border border-[var(--em-border)] px-3 py-1.5 rounded-full hover:text-[var(--em)] transition-all">
                    Bagikan Link →
                </button>
            </div>

        </div>
    )
}