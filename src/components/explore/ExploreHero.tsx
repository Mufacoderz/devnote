import AnimatedGradient from "@/components/ui/AnimatedGradient"

interface ExploreHeroProps {
    total: number
}

export default function ExploreHero({ total }: ExploreHeroProps) {
    return (
        <section className="relative h-auto md:h-screen -mt-14 overflow-hidden border-b border-emerald-950">

<AnimatedGradient />

            <div className="absolute inset-0 bg-[#0a0f0c]/70 backdrop-blur-[2px]" />

            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                        linear-gradient(to right, #10b981 1px, transparent 1px),
                        linear-gradient(to bottom, #10b981 1px, transparent 1px)
                        `,
                        backgroundSize: "60px 60px"
                    }}
                />
            </div>

            <div className="absolute top-0 left-1/3 w-[800px] h-[600px] bg-emerald-500/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[500px] bg-teal-500/10 blur-[100px] rounded-full" />

            <div className="relative z-10 max-w-5xl mx-auto px-5 h-full flex items-center">
                <div className="grid lg:grid-cols-12 gap-12 items-center">

                    <div className="lg:col-span-7 space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-950/60 border border-emerald-800 rounded-full text-emerald-400 text-xs font-medium tracking-widest">
                            DISCOVER • SHARE • INSPIRE
                        </div>

                        <h1 className="text-5xl lg:text-6xl font-bold tracking-tighter leading-none text-white">
                            Jelajahi Snippet<br />
                            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                                Publik Terbaik
                            </span>
                        </h1>

                        <p className="text-lg text-emerald-100/80 max-w-md leading-relaxed">
                            Temukan ribuan potongan kode berkualitas dari developer Indonesia dan dunia.
                        </p>

                        <div className="flex items-center gap-10 pt-4">
                            <div>
                                <div className="text-4xl font-semibold text-white font-mono tracking-tight">
                                    {total.toLocaleString()}
                                </div>
                                <div className="text-emerald-400/80 text-sm mt-1">Snippet Publik</div>
                            </div>

                            <div className="h-9 w-px bg-emerald-800" />

                            <div>
                                <div className="text-4xl font-semibold text-white font-mono tracking-tight">1.2K</div>
                                <div className="text-emerald-400/80 text-sm mt-1">Developer Aktif</div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 relative">
                        <div className="relative bg-[#0a0f0c]/80 backdrop-blur-md border border-emerald-900/80 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-950/50">

                            <div className="flex items-center gap-2 px-5 py-3 border-b border-emerald-950 bg-black/40">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                </div>
                                <div className="mx-auto text-[10px] text-emerald-500/70 font-mono">
                                    beautiful-snippet.tsx
                                </div>
                            </div>

                            <div className="p-6 font-mono text-sm leading-relaxed text-emerald-100/90 bg-[#050805]/80">
                                <div>
                                    <span className="text-emerald-400">export</span>{" "}
                                    <span className="text-emerald-300">async function</span>{" "}
                                    <span className="text-white">getTrendingSnippets</span>() {"{"}
                                </div>
                                <div className="pl-6 text-emerald-200/80">
                                    const data = await db.snippet.findMany({"{"}<br />
                                    &nbsp;&nbsp;where: {"{ isPublic: true }"},<br />
                                    &nbsp;&nbsp;orderBy: {"{ likes: 'desc' }"},<br />
                                    &nbsp;&nbsp;take: 12<br />
                                    {"}"})
                                </div>
                                <div className="pl-6 mt-2 text-emerald-400">return</div>
                                <div className="pl-8 text-white">data</div>
                                <div>{"}"}</div>
                            </div>

                            <div className="px-5 py-3 bg-black/60 border-t border-emerald-950 flex items-center justify-between text-[10px] text-emerald-500/60">
                                <div>12 likes • 8 copies</div>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    Trending
                                </div>
                            </div>
                        </div>

                        <div className="absolute -top-4 -right-4 bg-emerald-600 text-white text-xs font-semibold px-4 py-1.5 rounded-2xl shadow-xl shadow-emerald-900/70 border border-emerald-400/30">
                            Join Now
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}