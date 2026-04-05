"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { useRouter, useSearchParams } from "next/navigation"
import { getLang } from "@/lib/languages"
import { faCompass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faLayerGroup,
    faStar,
    faGlobe,
    faCopy
} from "@fortawesome/free-solid-svg-icons"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"

interface NavItemProps {
    label: string
    count: number
    active?: boolean
    onClick?: () => void
    dotColor?: string
    icon?: IconDefinition
}



function NavItem({ label, count, active, onClick, dotColor, icon }: NavItemProps) {


    return (
        <div
            onClick={onClick}
            className={`flex items-center justify-between px-2 py-[6px] rounded-[5px] cursor-pointer text-[13px] transition-all
            ${active
                    ? 'bg-[var(--em-faint)] text-[var(--em)] font-medium'
                    : 'text-[var(--text2)] hover:bg-[var(--em-faint)] hover:text-[var(--text)]'
                }`}
        >
            <div className="flex items-center gap-2">
                {icon ? (
                    <FontAwesomeIcon
                        icon={icon}
                        className={`w-[12px] h-[12px] shrink-0 transition-all
                        ${active ? 'text-[var(--em)]' : 'text-[var(--text4)]'}`}
                    />
                ) : (
                    <div
                        className="w-[5px] h-[5px] rounded-full shrink-0"
                        style={{ background: active ? 'var(--em)' : (dotColor ?? 'var(--border2)') }}
                    />
                )}
                {label}
            </div>
            <span className={`font-mono text-[10px] px-2 py-[1px] rounded-full
                ${active ? 'text-[var(--em-dim)] bg-[var(--em-faint)]' : 'text-[var(--text4)] bg-[var(--surface3)]'}`}>
                {count}
            </span>
        </div>
    )
}

interface SidebarClientProps {
    totalSnippets: number
    totalCopies: number
    totalFavorites: number
    languages: { name: string; count: number }[]
    tags: { name: string; count: number }[]
    onNavigate?: () => void
}

export default function SidebarClient({ totalSnippets, totalCopies, totalFavorites, languages, tags, onNavigate }: SidebarClientProps) {

    const { favCount, setFavCount } = useAppStore()
    const router = useRouter()
    const searchParams = useSearchParams()

    const activeLang = searchParams.get("lang")
    const activeTag = searchParams.get("tag")
    const activeFilter = searchParams.get("filter")
    const isAll = !activeLang && !activeTag && !activeFilter

    const setFilter = (type: "lang" | "tag" | "filter" | null, value?: string) => {
        if (type === null) {
            router.push("/dashboard")
        } else {
            router.push(`/dashboard?${type}=${value}`)
        }
        onNavigate?.()
    }
    
    useEffect(() => {
        setFavCount(totalFavorites)
    }, [totalFavorites, setFavCount])

    return (
        <aside className="w-[280px] h-full bg-[var(--surface)] border-r border-[var(--border)] flex flex-col overflow-y-auto">

            {/* Library */}
            <div className="px-3 pt-4 pb-2">
                <p className="text-[10px] font-semibold tracking-[1.5px] uppercase text-[var(--text4)] px-2 mb-1">
                    Library
                </p>
                <NavItem
                    label="All Snippets"
                    count={totalSnippets}
                    active={isAll}
                    onClick={() => setFilter(null)}
                    icon={faLayerGroup}
                />
                <NavItem
                    label="Favorites"
                    count={favCount}  // ← dari store, bukan prop
                    active={activeFilter === "favorites"}
                    onClick={() => setFilter("filter", "favorites")}
                    icon={faStar}
                />
                <NavItem
                    label="Public"
                    count={0}
                    icon={faGlobe}
                />
                <NavItem
                    label="Most Copied"
                    count={0}
                    icon={faCopy}
                />
            </div>

            {/* Language */}
            <div className="px-3 py-2 border-t border-[var(--border)]">
                <p className="text-[10px] font-semibold tracking-[1.5px] uppercase text-[var(--text4)] px-2 mb-1">
                    Language
                </p>
                <div className="overflow-y-auto max-h-[125px]">
                    {languages.map(({ name, count }) => {
                        const langConfig = getLang(name)
                        return (
                            <NavItem
                                key={name}
                                label={name.charAt(0).toUpperCase() + name.slice(1)}
                                count={count}
                                active={activeLang === name}
                                dotColor={langConfig.color}
                                onClick={() => setFilter("lang", name)}
                            />
                        )
                    })}
                </div>
            </div>

            {/* Tags */}
            <div className="px-3 py-2 border-t border-[var(--border)]">
                <p className="text-[10px] font-semibold tracking-[1.5px] uppercase text-[var(--text4)] px-2 mb-1">
                    Tags
                </p>
                <div className="overflow-y-auto max-h-[100px]">
                    <div className="flex flex-wrap gap-[5px] px-2 pt-1">
                        {tags.map(({ name }) => (
                            <span
                                key={name}
                                onClick={() => setFilter("tag", name)}
                                className={`font-mono text-[10px] px-2 py-[3px] rounded-full border cursor-pointer transition-all
                                    ${activeTag === name
                                        ? 'border-[var(--em-border)] text-[var(--em)] bg-[var(--em-faint)]'
                                        : 'border-[var(--border2)] text-[var(--text3)] hover:border-[var(--em-border)] hover:text-[var(--em)]'
                                    }`}
                            >
                                #{name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Explore */}
            <div className="px-3 py-2 border-t border-[var(--border)]">
                <p className="text-[10px] font-semibold tracking-[1.5px] uppercase text-[var(--text4)] px-2 mb-1">
                    Explore
                </p>
                <div
                    onClick={() => { router.push("/explore"); onNavigate?.() }}
                    className="flex items-center justify-between px-2 py-[6px] rounded-[5px] cursor-pointer text-[13px] text-[var(--text2)] hover:bg-[var(--em-faint)] hover:text-[var(--em)] transition-all group"
                >
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                            icon={faCompass}
                            className="w-[10px] h-[10px] shrink-0"
                        />
                        Jelajahi Snippet Publik
                    </div>
                    <span className="text-[10px] text-[var(--text4)] group-hover:text-[var(--em)] transition-all">
                        →
                    </span>
                </div>
            </div>

            {/* Stats */}
            <div className="mt-auto px-3 py-3 border-t border-[var(--border)]">
                <div className="grid grid-cols-2 gap-[6px]">
                    {[
                        { val: totalSnippets.toString(), label: 'Snippets' },
                        { val: totalCopies.toString(), label: 'Copies' },
                        { val: languages.length.toString(), label: 'Languages' },
                        { val: tags.length.toString(), label: 'Tags' },
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