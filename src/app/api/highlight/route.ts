import { codeToHtml } from 'shiki'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const { code, language } = await req.json()

    const html = await codeToHtml(code, {
        lang: language,
        theme: 'one-dark-pro',
    })

    return NextResponse.json({ html })
}