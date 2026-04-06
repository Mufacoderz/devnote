import { create } from "zustand"

interface AppStore {
    favCount: number
    setFavCount: (count: number) => void
    incrementFav: () => void
    decrementFav: () => void
    favoriteIds: Set<number>
    setFavoriteIds: (ids: number[]) => void
    toggleFavoriteId: (id: number) => void
}

export const useAppStore = create<AppStore>((set) => ({
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
}))