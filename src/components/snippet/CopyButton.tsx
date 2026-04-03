'use client'

import { useState } from "react"

export default function CopyButton({ code }: { code: string }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <button
            onClick={handleCopy}
            className={`flex items-center gap-2 text-[13px] font-semibold px-4 py-2 rounded-lg transition-all
        ${copied
                    ? 'bg-[var(--em-dim)] text-white'
                    : 'bg-[var(--em)] text-[#0a0a0a] hover:bg-[#2bc48a] hover:shadow-[0_4px_16px_var(--em-glow)]'
                }`}
        >
            {copied ? 'Tersalin!' : 'Salin Kode'}
        </button>
    )
}