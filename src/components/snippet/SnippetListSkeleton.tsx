// components/dashboard/SnippetListSkeleton.tsx
import SnippetCardSkeleton from "./SnippetCardSkeleton"

export default function SnippetListSkeleton() {
    return (
        <div className="hidden lg:flex h-full overflow-hidden">
            {/* kiri: list panel */}
            <div className="w-[300px] border-r border-[var(--border)] flex flex-col shrink-0">
                {/* header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] shrink-0">
                    <div className="h-[10px] w-[90px] rounded bg-[var(--surface3)] animate-pulse" />
                    <div className="h-[16px] w-[24px] rounded-full bg-[var(--surface3)] animate-pulse" />
                </div>
                {/* cards */}
                <div className="flex-1 overflow-hidden p-2 flex flex-col gap-0.5">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <SnippetCardSkeleton key={i} />
                    ))}
                </div>
            </div>

            {/* kanan: detail panel skeleton */}
            <div className="flex-1 flex flex-col animate-pulse">
                {/* detail header */}
                <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between shrink-0">
                    <div className="flex flex-col gap-2">
                        <div className="h-[16px] w-[180px] rounded bg-[var(--surface3)]" />
                        <div className="h-[10px] w-[100px] rounded bg-[var(--surface3)]" />
                    </div>
                    <div className="flex gap-2">
                        <div className="h-[30px] w-[70px] rounded-lg bg-[var(--surface3)]" />
                        <div className="h-[30px] w-[70px] rounded-lg bg-[var(--surface3)]" />
                    </div>
                </div>
                {/* code area */}
                <div className="flex-1 m-4 rounded-[8px] bg-[var(--surface3)]" />
            </div>
        </div>
    )
}