"use client"
import { useEffect, useState, useCallback, useRef, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faChevronDown,
    faLayerGroup,
    faStar,
    faGlobe,
    faCopy,
    faFolder,
    faPlus,
    faEllipsis,
    faTrash,
    faPen,
    faCompass
} from "@fortawesome/free-solid-svg-icons"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { motion, AnimatePresence } from "framer-motion"

import { useAppStore } from "@/lib/store"
import { getLang } from "@/lib/languages"


function CollapseSection({ open, children }: { open: boolean; children: React.ReactNode }) {
    return (
        <AnimatePresence initial={false}>
            {open && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    )
}


interface NavItemProps {
    label: string
    count: number
    active?: boolean
    onClick?: () => void
    onPrefetch?: () => void
    dotColor?: string
    icon?: IconDefinition
}

function NavItem({ label, count, active, onClick, onPrefetch, dotColor, icon }: NavItemProps) {
    return (
        <div
            onClick={onClick}
            onPointerEnter={onPrefetch}
            onTouchStart={onPrefetch}
            onFocus={onPrefetch}
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


interface Collection {
    id: number
    name: string
    _count: { snippets: number }
}

interface SidebarClientProps {
    totalSnippets: number
    totalCopies: number
    totalFavorites: number
    totalPublic: number
    totalSnippetCopied: number
    languages: { name: string; count: number }[]
    tags: { name: string; count: number }[]
    onNavigate?: () => void
}

export default function SidebarClient({
    totalSnippets,
    totalCopies,
    totalFavorites,
    totalPublic,
    totalSnippetCopied,
    languages,
    tags,
    onNavigate
}: SidebarClientProps) {

    const { favCount, setFavCount, setFavoriteIds, setIsNavigating, publicCount, setPublicCount, setPublicIds } = useAppStore()
    const router = useRouter()
    const searchParams = useSearchParams()

    const [sidebarWidth, setSidebarWidth] = useState(260)
    const isResizing = useRef(false)
    const [isPending, startTransition] = useTransition()

    const [collapsed, setCollapsed] = useState({
        library: false,
        collections: true,
        languages: true,
        tags: true,
    })

    const [collections, setCollections] = useState<Collection[]>([])
    const [newColName, setNewColName] = useState("")
    const [addingCol, setAddingCol] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editingName, setEditingName] = useState("")
    const [menuOpenId, setMenuOpenId] = useState<number | null>(null)
    const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null)

    // Active states
    const activeLang = searchParams.get("lang")
    const activeTag = searchParams.get("tag")
    const activeFilter = searchParams.get("filter")
    const activeCollection = searchParams.get("collection")
    const isAll = !activeLang && !activeTag && !activeFilter && !activeCollection

    // auto refetch smua route
    useEffect(() => {
        const prefetchAllRoutes = () => {
            router.prefetch("/dashboard")

            languages.forEach(({ name }) => {
                if (name) router.prefetch(`/dashboard?lang=${encodeURIComponent(name)}`)
            })

            collections.forEach((col) => {
                router.prefetch(`/dashboard?collection=${col.id}`)
            })

            tags.forEach(({ name }) => {
                if (name) router.prefetch(`/dashboard?tag=${encodeURIComponent(name)}`)
            })

            router.prefetch("/dashboard?filter=favorites")
            router.prefetch("/dashboard?filter=most-copied")
            router.prefetch("/dashboard?filter=public")
        }

        const timeout = setTimeout(prefetchAllRoutes, 250)
        return () => clearTimeout(timeout)
    }, [router, languages, collections, tags])

    // fetch data
    useEffect(() => {
        setFavCount(totalFavorites)
    }, [totalFavorites, setFavCount])
    useEffect(() => {
        setPublicCount(totalPublic)
    }, [totalPublic, setPublicCount])

    useEffect(() => {
        fetch("/api/snippets?filter=favorites")
            .then(r => r.json())
            .then(d => setFavoriteIds((d.snippets ?? []).map((s: { id: number }) => s.id)))
            .catch(console.error)
    }, [setFavoriteIds])
    useEffect(() => {
        fetch("/api/snippets?filter=public")
            .then(r => r.json())
            .then(d => setPublicIds((d.snippets ?? []).map((s: { id: number }) => s.id)))
            .catch(console.error)
    }, [setPublicIds])
    

    useEffect(() => {
        fetch("/api/collections")
            .then(r => r.json())
            .then(d => setCollections(d.collections ?? []))
            .catch(console.error)
    }, [])

    // helper
    const toggle = (key: keyof typeof collapsed) => {
        setCollapsed(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const setFilter = (type: "lang" | "tag" | "filter" | "collection" | null, value?: string) => {
        setIsNavigating(true)
        startTransition(() => {
            if (type === null) {
                router.replace("/dashboard")
            } else {
                router.replace(`/dashboard?${type}=${value}`)
            }
        })
        onNavigate?.()
    }



    const prefetchRoute = useCallback((type: "lang" | "tag" | "filter" | "collection" | null, value?: string) => {
        const url = type === null
            ? "/dashboard"
            : `/dashboard?${type}=${value}`
        router.prefetch(url)
    }, [router])

    //hanlde collection
    const handleAddCollection = async () => {
        if (!newColName.trim()) return
        const res = await fetch("/api/collections", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newColName.trim() })
        })
        const data = await res.json()
        setCollections(prev => [{ ...data.collection, _count: { snippets: 0 } }, ...prev])
        setNewColName("")
        setAddingCol(false)
    }

    const handleRename = async (id: number) => {
        if (!editingName.trim()) return
        await fetch(`/api/collections/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: editingName.trim() })
        })
        setCollections(prev => prev.map(c => c.id === id ? { ...c, name: editingName.trim() } : c))
        setEditingId(null)
        setEditingName("")
    }

    const handleDelete = async (id: number) => {
        await fetch(`/api/collections/${id}`, { method: "DELETE" })
        setCollections(prev => prev.filter(c => c.id !== id))
        setMenuOpenId(null)
        if (activeCollection === String(id)) router.replace("/dashboard")
    }

    // resize logic
    const startResizing = useCallback(() => {
        isResizing.current = true
        document.body.style.cursor = "col-resize"
        document.body.style.userSelect = "none"
    }, [])

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!isResizing.current) return
            const newWidth = e.clientX
            if (newWidth >= 170 && newWidth <= 420) {
                setSidebarWidth(newWidth)
            }
        }
        const onMouseUp = () => {
            if (!isResizing.current) return
            isResizing.current = false
            document.body.style.cursor = ""
            document.body.style.userSelect = ""
        }

        window.addEventListener("mousemove", onMouseMove)
        window.addEventListener("mouseup", onMouseUp)

        return () => {
            window.removeEventListener("mousemove", onMouseMove)
            window.removeEventListener("mouseup", onMouseUp)
        }
    }, [])

    return (
        <aside
            style={{ width: sidebarWidth }}
            className="relative flex flex-col h-full bg-[var(--surface)] border-r border-[var(--border)] overflow-y-auto shrink-0"
        >
            {/* Loading Indicator */}
            {isPending && (
                <div className="absolute top-0 left-0 right-0 h-[2px] z-50 overflow-hidden">
                    <div className="h-full bg-[var(--em)] animate-pulse" />
                </div>
            )}

            {/* library */}
            <div className="px-3 py-2">
                <div
                    onClick={() => toggle("library")}
                    className="flex items-center justify-between px-2 mb-1 cursor-pointer group"
                >
                    <p className="text-[10px] font-semibold tracking-[1.5px] uppercase text-[var(--text4)] group-hover:text-[var(--text3)] transition-colors">
                        Library
                    </p>
                    <motion.div animate={{ rotate: collapsed.library ? -90 : 0 }} transition={{ duration: 0.2 }}>
                        <FontAwesomeIcon icon={faChevronDown} className="w-[8px] h-[8px] text-[var(--text4)]" />
                    </motion.div>
                </div>

                <CollapseSection open={!collapsed.library}>
                    <NavItem label="All Snippets" count={totalSnippets} active={isAll} onClick={() => setFilter(null)} onPrefetch={() => prefetchRoute(null)} icon={faLayerGroup} />
                    <NavItem label="Favorites" count={favCount} active={activeFilter === "favorites"} onClick={() => setFilter("filter", "favorites")} onPrefetch={() => prefetchRoute("filter", "favorites")} icon={faStar} />
                    <NavItem
                        label="Public"
                        count={publicCount}
                        active={activeFilter === "public"}
                        onClick={() => setFilter("filter", "public")}
                        onPrefetch={() => prefetchRoute("filter", "public")}
                        icon={faGlobe}
                    />
                    <NavItem label="Most Copied" count={totalSnippetCopied} active={activeFilter === "most-copied"} onClick={() => setFilter("filter", "most-copied")} onPrefetch={() => prefetchRoute("filter", "most-copied")} icon={faCopy} />
                </CollapseSection>
            </div>

            {/* folder colect */}
            <div className="px-3 py-2 border-t border-[var(--border)]">
                <div
                    onClick={() => toggle("collections")}
                    className="flex items-center justify-between px-2 mb-1 cursor-pointer group"
                >
                    <p className="text-[10px] font-semibold tracking-[1.5px] uppercase text-[var(--text4)] group-hover:text-[var(--text3)] transition-colors">
                        Collections
                    </p>
                    <motion.div animate={{ rotate: collapsed.collections ? -90 : 0 }} transition={{ duration: 0.2 }}>
                        <FontAwesomeIcon icon={faChevronDown} className="w-[8px] h-[8px] text-[var(--text4)]" />
                    </motion.div>
                </div>

                <CollapseSection open={!collapsed.collections}>
                    {addingCol ? (
                        <div className="flex flex-col gap-1.5 px-2 py-1 mb-1">
                            <input
                                autoFocus
                                value={newColName}
                                onChange={e => setNewColName(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === "Enter") handleAddCollection()
                                    if (e.key === "Escape") { setAddingCol(false); setNewColName("") }
                                }}
                                placeholder="Nama collection..."
                                className="w-full bg-[var(--bg)] border border-[var(--em-border)] rounded-md px-2 py-[5px] text-[12px] text-[var(--text)] outline-none placeholder:text-[var(--text4)]"
                            />
                            <div className="flex gap-1.5">
                                <button onClick={handleAddCollection} className="flex-1 text-[11px] bg-[var(--em)] text-[#0a0a0a] font-semibold py-[5px] rounded-md hover:bg-[#2bc48a] transition-all">
                                    Simpan
                                </button>
                                <button onClick={() => { setAddingCol(false); setNewColName("") }} className="flex-1 text-[11px] text-[var(--text1)] py-[5px] rounded-md hover:bg-[var(--surface2)] transition-all">
                                    Batal
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            onClick={() => setAddingCol(true)}
                            className="flex items-center gap-2 px-2 py-[6px] rounded-[5px] cursor-pointer text-[13px] text-[var(--text4)] hover:bg-[var(--em-faint)] hover:text-[var(--em)] transition-all mb-0.5"
                        >
                            <FontAwesomeIcon icon={faPlus} className="w-[12px] h-[12px] shrink-0" />
                            <span>Buat collection</span>
                        </div>
                    )}

                    <div className="overflow-y-auto max-h-[125px]">
                        {collections.length === 0 && (
                            <p className="text-[11px] text-[var(--text4)] px-2 py-1 italic">Belum ada collection</p>
                        )}
                        {collections.map(col => (
                            <div key={col.id} className="relative group">
                                {editingId === col.id ? (
                                    <div className="flex items-center gap-1.5 px-2 py-1">
                                        <input
                                            autoFocus
                                            value={editingName}
                                            onChange={e => setEditingName(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === "Enter") handleRename(col.id)
                                                if (e.key === "Escape") setEditingId(null)
                                            }}
                                            className="flex-1 bg-[var(--bg)] border border-[var(--em-border)] rounded-md px-2 py-[4px] text-[12px] text-[var(--text)] outline-none"
                                        />
                                        <button onClick={() => handleRename(col.id)} className="text-[11px] text-[var(--em)] font-medium px-2 py-[4px] rounded-md hover:bg-[var(--em-faint)] transition-all">
                                            OK
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => setFilter("collection", String(col.id))}
                                        onPointerEnter={() => prefetchRoute("collection", String(col.id))}
                                        onTouchStart={() => prefetchRoute("collection", String(col.id))}
                                        className={`flex items-center justify-between px-2 py-[6px] rounded-[5px] cursor-pointer text-[13px] transition-all
                                            ${activeCollection === String(col.id)
                                                ? 'bg-[var(--em-faint)] text-[var(--em)] font-medium'
                                                : 'text-[var(--text2)] hover:bg-[var(--em-faint)] hover:text-[var(--text)]'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <FontAwesomeIcon
                                                icon={faFolder}
                                                className={`w-[12px] h-[12px] shrink-0 ${activeCollection === String(col.id) ? 'text-[var(--em)]' : 'text-[var(--text4)]'}`}
                                            />
                                            <span className="truncate">{col.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <span className={`font-mono text-[10px] px-2 py-[1px] rounded-full
                                                ${activeCollection === String(col.id) ? 'text-[var(--em-dim)] bg-[var(--em-faint)]' : 'text-[var(--text4)] bg-[var(--surface3)]'}`}>
                                                {col._count.snippets}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                                                    setMenuPos({ x: rect.right, y: rect.bottom + 4 })
                                                    setMenuOpenId(col.id)
                                                }}
                                                className="opacity-0 group-hover:opacity-100 w-[18px] h-[18px] flex items-center justify-center rounded text-[var(--text4)] hover:text-[var(--text)] transition-all"
                                            >
                                                <FontAwesomeIcon icon={faEllipsis} className="w-[10px] h-[10px]" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CollapseSection>
            </div>

            {/* lang  */}
            <div className="px-3 py-2 border-t border-[var(--border)]">
                <div onClick={() => toggle("languages")} className="flex items-center justify-between px-2 mb-1 cursor-pointer group">
                    <p className="text-[10px] font-semibold tracking-[1.5px] uppercase text-[var(--text4)] group-hover:text-[var(--text3)] transition-colors">
                        Language
                    </p>
                    <motion.div animate={{ rotate: collapsed.languages ? -90 : 0 }} transition={{ duration: 0.2 }}>
                        <FontAwesomeIcon icon={faChevronDown} className="w-[8px] h-[8px] text-[var(--text4)]" />
                    </motion.div>
                </div>

                <CollapseSection open={!collapsed.languages}>
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
                                    onPrefetch={() => prefetchRoute("lang", name)}
                                />
                            )
                        })}
                    </div>
                </CollapseSection>
            </div>

            {/* tag */}
            <div className="px-3 py-2 border-t border-[var(--border)]">
                <div onClick={() => toggle("tags")} className="flex items-center justify-between px-2 mb-1 cursor-pointer group">
                    <p className="text-[10px] font-semibold tracking-[1.5px] uppercase text-[var(--text4)] group-hover:text-[var(--text3)] transition-colors">
                        Tags
                    </p>
                    <motion.div animate={{ rotate: collapsed.tags ? -90 : 0 }} transition={{ duration: 0.2 }}>
                        <FontAwesomeIcon icon={faChevronDown} className="w-[8px] h-[8px] text-[var(--text4)]" />
                    </motion.div>
                </div>

                <CollapseSection open={!collapsed.tags}>
                    <div className="overflow-y-auto max-h-[100px]">
                        <div className="flex flex-wrap gap-[5px] px-2 pt-1">
                            {tags.map(({ name }) => (
                                <span
                                    key={name}
                                    onClick={() => setFilter("tag", name)}
                                    onPointerEnter={() => prefetchRoute("tag", name)}
                                    onTouchStart={() => prefetchRoute("tag", name)}
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
                </CollapseSection>
            </div>

            {/* explore*/}
            <div className="px-3 py-2 border-t border-[var(--border)]">
                <div
                    onClick={() => { router.push("/explore"); onNavigate?.() }}
                    className="flex items-center justify-between px-3 py-2.5 rounded-[8px] cursor-pointer transition-all group bg-[var(--em-faint)] border border-[var(--em-border)] hover:bg-[var(--em)] hover:border-[var(--em)]"
                >
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCompass} className="w-[11px] h-[11px] shrink-0 text-[var(--em)] group-hover:text-[#0a0a0a] transition-all" />
                        <span className="text-[12px] font-medium text-[var(--em)] group-hover:text-[#0a0a0a] transition-all">
                            Jelajahi Snippet Publik
                        </span>
                    </div>
                    <span className="text-[11px] text-[var(--em)] group-hover:text-[#0a0a0a] group-hover:translate-x-1 transition-all">→</span>
                </div>
            </div>
            

            {/* stat */}
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

            {/* Resize Handle */}
            <div
                onMouseDown={startResizing}
                className="absolute top-0 right-0 w-[4px] h-full cursor-col-resize z-50 group"
            >
                <div className="w-full h-full bg-transparent group-hover:bg-[var(--em-dim)] transition-colors duration-150" />
            </div>

            {/* Collection Context Menu */}
            {menuOpenId !== null && menuPos && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => { setMenuOpenId(null); setMenuPos(null) }}
                    />
                    <div
                        className="fixed z-50 w-[140px] rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-xl p-1"
                        style={{ top: menuPos.y, left: menuPos.x - 140 }}
                    >
                        <button
                            onClick={() => {
                                const col = collections.find(c => c.id === menuOpenId)
                                if (col) {
                                    setEditingId(col.id)
                                    setEditingName(col.name)
                                }
                                setMenuOpenId(null)
                                setMenuPos(null)
                            }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[var(--text2)] hover:bg-[var(--surface2)] rounded-md transition-all"
                        >
                            <FontAwesomeIcon icon={faPen} className="w-[10px] h-[10px]" />
                            Rename
                        </button>
                        <button
                            onClick={() => handleDelete(menuOpenId)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-red-400 hover:bg-red-500/10 rounded-md transition-all"
                        >
                            <FontAwesomeIcon icon={faTrash} className="w-[10px] h-[10px]" />
                            Hapus
                        </button>
                    </div>
                </>
            )}
        </aside>
    )
}