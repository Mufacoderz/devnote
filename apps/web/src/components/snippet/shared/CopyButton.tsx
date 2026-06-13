'use client'

import { useState } from "react"

export default function CopyButton({ 
    code, 
    snippetId,
    onCopy
}: { 
    code: string
    snippetId: number
    onCopy?: () => void  // callback opsional — dipanggil setelah copy berhasil
}) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        // salin kode ke clipboard browser
        navigator.clipboard.writeText(code)
        
        // ubah tampilan tombol jadi "Tersalin!" selama 2 detik
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)

        // beritahu parent bahwa copy sudah terjadi
        // pakai ?. supaya tidak error kalau onCopy tidak dikirim
        onCopy?.()

        // hit API di background — tidak perlu di-await karena
        // UI sudah update duluan (optimistic update)
        // .catch(() => {}) supaya error API tidak bikin app crash
        fetch(`/api/snippets/${snippetId}/copy`, { method: "POST" }).catch(() => {})
    }

    return (
        <button
            onClick={handleCopy}
            className={`flex h-[36px] items-center gap-2 text-[12px] font-semibold px-4 rounded-md border transition-all
        ${copied
                    ? 'bg-[var(--em-dim)] border-[var(--em-dim)] text-[#07100c]'
                    : 'bg-[var(--em)] border-[var(--em)] text-[#07100c] hover:bg-[#55e4ad] hover:border-[#55e4ad]'
                }`}
        >
            {copied ? 'Tersalin!' : 'Salin Kode'}
        </button>
    )
}
