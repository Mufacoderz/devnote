import { Metadata } from "next"
import { Suspense } from "react"
import ExploreClient from "./ExploreClient"

export const metadata: Metadata = {
    title: "Explore — DevNote",
    description: "Temukan dan bagikan snippet kode publik dari developer di seluruh dunia.",
}

export default function ExplorePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-[var(--em)] border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <ExploreClient />
        </Suspense>
    )
}