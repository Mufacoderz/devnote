"use client"

interface StatsSectionProps {
  totalSnippets: number
  totalCopies: number
  totalTags: number
}

export default function StatsSection({
  totalSnippets,
  totalCopies,
  totalTags,
}: StatsSectionProps) {
  const stats = [
    { val: totalSnippets.toString(), label: "Snippets" },
    { val: totalCopies.toString(), label: "Copies" },
    { val: totalTags.toString(), label: "Tags" },
  ]

  return (
    <div className="mt-auto px-3 py-3 border-t border-[var(--border)]">
      <div className="grid grid-cols-2 gap-[6px]">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[var(--surface2)] border border-[var(--border)] rounded-[6px] p-[10px]"
          >
            <div className="font-mono text-[18px] font-semibold text-[var(--em)] leading-none mb-[3px]">
              {stat.val}
            </div>
            <div className="text-[10px] text-[var(--text3)]">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}