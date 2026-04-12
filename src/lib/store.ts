import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Prefs {
    sortOrder: "newest" | "oldest" | "az" | "za"
    defaultLanguage: string
    listView: "comfortable" | "compact"
    codeTheme: string
    codeFontSize: "12" | "13" | "14"
    lineNumbers: boolean
}

interface AppStore {
    favCount: number
    setFavCount: (count: number) => void
    incrementFav: () => void
    decrementFav: () => void
    favoriteIds: Set<number>
    setFavoriteIds: (ids: number[]) => void
    toggleFavoriteId: (id: number) => void
    isNavigating: boolean
    setIsNavigating: (val: boolean) => void
    prefs: Prefs
    updatePref: <K extends keyof Prefs>(key: K, val: Prefs[K]) => void
}

const DEFAULT_PREFS: Prefs = {
    sortOrder: "newest",
    defaultLanguage: "typescript",
    listView: "comfortable",
    codeTheme: "one-dark-pro",
    codeFontSize: "13",
    lineNumbers: false,
}

export const useAppStore = create<AppStore>()(
    persist(
        (set) => ({
            favCount: 0,
            setFavCount: (count) => set({ favCount: count }),
            incrementFav: () => set((s) => ({ favCount: s.favCount + 1 })),
            decrementFav: () => set((s) => ({ favCount: Math.max(0, s.favCount - 1) })),
            favoriteIds: new Set(),
            setFavoriteIds: (ids) => set({ favoriteIds: new Set(ids) }),
            toggleFavoriteId: (id) => set((s) => {
                const next = new Set(s.favoriteIds)
                if (next.has(id)) {
                    next.delete(id)
                } else {
                    next.add(id)
                }
                return { favoriteIds: next }
            }),
            isNavigating: false,
            setIsNavigating: (val) => set({ isNavigating: val }),
            prefs: DEFAULT_PREFS,
            updatePref: (key, val) => set((s) => ({
                prefs: { ...s.prefs, [key]: val }
            })),
        }),
        {
            name: "devnote_store",
            // Set tidak bisa di-serialize JSON, skip favoriteIds dan isNavigating dari persist
            partialize: (s) => ({
                prefs: s.prefs,
                favCount: s.favCount,
            }),
        }
    )
)