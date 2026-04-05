import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faPlus, faBars } from '@fortawesome/free-solid-svg-icons'

interface TopbarProps {
    onNewSnippet: () => void
    onToggleSidebar: () => void
}

export default function Topbar({ onNewSnippet, onToggleSidebar }: TopbarProps) {
    return (
        <header className="h-[52px] bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-5 shrink-0">

            {/* kiri */}
            <div className="flex items-center gap-3">
                {/* hamburger — hanya muncul di bawah md */}
                <button
                    onClick={onToggleSidebar}
                    className="md:hidden w-[32px] h-[32px] flex items-center justify-center rounded-lg text-[var(--text3)] hover:bg-[var(--surface2)] hover:text-[var(--text)] transition-all"
                >
                    <FontAwesomeIcon icon={faBars} className="w-[14px] h-[14px]" />
                </button>

                <div className="flex items-center gap-2">
                    <div className="w-[26px] h-[26px] bg-[var(--em)] rounded-[6px] flex items-center justify-center text-[#0a0a0a] font-mono text-[11px] font-bold shrink-0">
                        &lt;/&gt;
                    </div>
                    <span className="text-[15px] font-semibold tracking-tight">
                        dev<span className="text-[var(--em)]">note</span>
                    </span>
                </div>
            </div>

            {/* kanan */}
            <div className="flex items-center gap-3">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Cari snippets..."
                        className="bg-[var(--surface2)] border border-[var(--border2)] rounded-full px-4 py-[6px] pl-8 text-[12px] font-mono text-[var(--text)] placeholder:text-[var(--text4)] outline-none w-[200px] focus:border-[var(--em-border)] focus:shadow-[0_0_0_3px_var(--em-faint)] transition-all"
                    />
                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text4)] w-[12px] h-[12px]"
                    />
                </div>

                <button
                    onClick={onNewSnippet}
                    className="flex items-center gap-2 bg-[var(--em)] text-[#0a0a0a] font-semibold text-[13px] px-4 py-[6px] rounded-full border-[1px] border-transparent hover:bg-transparent hover:text-[var(--em)] hover:border-[var(--em)] hover:shadow-[0_0_20px_var(--em-glow)] transition-all"
                >
                    <FontAwesomeIcon icon={faPlus} className="w-[12px] h-[12px]" />
                    <span className="hidden sm:inline">Tambah Snippet</span>
                </button>

                <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[var(--em-dim)] to-[var(--em)] flex items-center justify-center text-[#0a0a0a] text-[11px] font-bold cursor-pointer shrink-0">
                    F
                </div>
            </div>
        </header>
    )
}