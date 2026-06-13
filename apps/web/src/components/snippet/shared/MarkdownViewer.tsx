"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function MarkdownViewer({ content }: { content: string }) {
    return (
        <div className="h-full overflow-auto bg-[#080a08]">
            <article className="markdown-viewer min-h-full px-6 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                </ReactMarkdown>
            </article>
        </div>
    )
}
