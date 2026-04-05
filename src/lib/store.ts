import { create } from "zustand"

interface AppStore {
    favCount: number
    setFavCount: (count: number) => void
    incrementFav: () => void
    decrementFav: () => void
}

export const useAppStore = create<AppStore>((set) => ({
    favCount: 0,
    setFavCount: (count) => set({ favCount: count }),
    incrementFav: () => set((s) => ({ favCount: s.favCount + 1 })),
    decrementFav: () => set((s) => ({ favCount: Math.max(0, s.favCount - 1) })),
}))