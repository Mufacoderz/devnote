function NavItem({ label, count, active }: {
    label: string
    count: number
    active?: boolean
}) {
    return (
        <div className={`flex items-center justify-between px-2 py-[6px] rounded-[5px] cursor-pointer text-[13px] transition-all
        ${active
                ? 'bg-[var(--em-faint)] text-[var(--em)] font-medium'
                : 'text-[var(--text2)] hover:bg-[var(--em-faint)] hover:text-[var(--text)]'
            }`}>
            <div className="flex items-center gap-2">
                <div className={`w-[5px] h-[5px] rounded-full shrink-0 ${active ? 'bg-[var(--em)]' : 'bg-[var(--border2)]'}`} />
                {label}
            </div>
            <span className={`font-mono text-[10px] px-2 py-[1px] rounded-full
        ${active ? 'text-[var(--em-dim)] bg-[var(--em-faint)]' : 'text-[var(--text4)] bg-[var(--surface3)]'}`}>
                {count}
            </span>
        </div>
    )
}

export default function Sidebar() {
    return (
        <aside className="w-[224px] h-full bg-[var(--surface)] border-r border-[var(--border)] flex flex-col">



            {/* Library */}
            <div className="px-3 pt-4 pb-2">
                <p className="text-[10px] font-semibold tracking-[1.5px] uppercase text-[var(--text4)] px-2 mb-1">
                    Library
                </p>

                <NavItem label="All Snippets" count={12} active />
                <NavItem label="Favorites" count={4} />
                <NavItem label="Public" count={2} />
            </div>


            {/* Language */}
            <div className="px-3 py-2 border-t border-[var(--border)]">
                <p className="text-[10px] font-semibold tracking-[1.5px] uppercase text-[var(--text4)] px-2 mb-1">
                    Language
                </p>

                <NavItem label="TypeScript" count={4} />
                <NavItem label="JavaScript" count={3} />
                <NavItem label="PHP" count={2} />
                <NavItem label="CSS" count={2} />
                <NavItem label="SQL" count={1} />
            </div>

            {/* Tags */}
            <div className="px-3 py-2 border-t border-[var(--border)]">
                <p className="text-[10px] font-semibold tracking-[1.5px] uppercase text-[var(--text4)] px-2 mb-1">
                    Tags
                </p>
                <div className="flex flex-wrap gap-[5px] px-2 pt-1">
                    {['#auth', '#prisma', '#api', '#hook', '#laravel', '#middleware', '#css', '#sql'].map(tag => (
                        <span
                            key={tag}
                            className="font-mono text-[10px] px-2 py-[3px] rounded-full border border-[var(--border2)] text-[var(--text3)] cursor-pointer hover:border-[var(--em-border)] hover:text-[var(--em)] transition-all"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="mt-auto px-3 py-3 border-t border-[var(--border)]">
                <div className="grid grid-cols-2 gap-[6px]">
                    {[
                        { val: '12', label: 'Snippets' },
                        { val: '84', label: 'Copies' },
                        { val: '5', label: 'Languages' },
                        { val: '9', label: 'Tags' },
                    ].map(stat => (
                        <div key={stat.label} className="bg-[var(--surface2)] border border-[var(--border)] rounded-[6px] p-[10px]">
                            <div className="font-mono text-[18px] font-semibold text-[var(--em)] leading-none mb-[3px]">
                                {stat.val}
                            </div>
                            <div className="text-[10px] text-[var(--text3)]">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

        </aside>
    )
}