export default function Loading() {
    return (
        <div className="flex-1 flex flex-col h-full">
            {/* Snippet List Skeleton */}
            <div className="flex h-full">
                {/* List panel */}
                <div className="w-[280px] border-r border-[var(--border)] flex flex-col gap-2 p-3 shrink-0">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="relative pl-3 pr-3 py-3 rounded-[6px] border border-transparent">
                            {/* stripe */}
                            <div className="absolute left-0 top-0 h-full w-[2px] rounded-l-[6px] bg-[var(--border2)] animate-pulse" />
                            {/* pip */}
                            <div className="h-[18px] w-[48px] rounded-[3px] bg-[var(--surface2)] animate-pulse mb-[8px]" />
                            {/* title */}
                            <div
                                className="h-[13px] rounded-md bg-[var(--surface2)] animate-pulse mb-[8px]"
                                style={{ width: `${60 + (i % 4) * 10}%` }}
                            />
                            {/* code preview */}
                            <div className="h-[10px] w-[80%] rounded-md bg-[var(--surface3)] animate-pulse mb-[8px]" />
                            {/* tags */}
                            <div className="flex gap-1.5">
                                <div className="h-[14px] w-[36px] rounded-full bg-[var(--surface3)] animate-pulse" />
                                <div className="h-[14px] w-[28px] rounded-full bg-[var(--surface3)] animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detail panel */}
                <div className="flex-1 flex flex-col px-6 py-5 gap-4">
                    {/* header */}
                    <div className="flex items-start justify-between gap-4 pb-5 border-b border-[var(--border)]">
                        <div className="flex flex-col gap-2 flex-1">
                            <div className="flex items-center gap-2">
                                <div className="h-[18px] w-[48px] rounded-[3px] bg-[var(--surface2)] animate-pulse" />
                                <div className="h-[12px] w-[60px] rounded-md bg-[var(--surface3)] animate-pulse" />
                            </div>
                            <div className="h-[26px] w-[55%] rounded-md bg-[var(--surface2)] animate-pulse" />
                            <div className="h-[13px] w-[80%] rounded-md bg-[var(--surface3)] animate-pulse mt-1" />
                            <div className="h-[13px] w-[60%] rounded-md bg-[var(--surface3)] animate-pulse" />
                            {/* tags */}
                            <div className="flex gap-2 mt-2">
                                {[40, 52, 36].map((w, i) => (
                                    <div key={i} className="h-[22px] rounded-full bg-[var(--surface2)] animate-pulse" style={{ width: w }} />
                                ))}
                            </div>
                            {/* action buttons */}
                            <div className="flex gap-2 mt-2">
                                {[72, 88, 56, 64].map((w, i) => (
                                    <div key={i} className="h-[34px] rounded-lg bg-[var(--surface2)] animate-pulse" style={{ width: w }} />
                                ))}
                            </div>
                        </div>
                        {/* favorite button */}
                        <div className="h-[34px] w-[96px] rounded-lg bg-[var(--surface2)] animate-pulse shrink-0" />
                    </div>

                    {/* code block */}
                    <div className="flex-1 rounded-xl bg-[var(--surface2)] animate-pulse min-h-[200px]" />
                </div>
            </div>
        </div>
    )
}