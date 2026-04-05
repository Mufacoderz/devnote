export interface LanguageConfig {
    label: string        // label pendek untuk pip: "TS", "JS", dst
    color: string        // CSS variable atau hex untuk dot/stripe
    pip: string          // class Tailwind untuk badge pip
    stripe: string       // class untuk stripe di SnippetCard (kalau ada)
}

export const languages: Record<string, LanguageConfig> = {
    // --- Web ---
    typescript: {
        label: "TS",
        color: "var(--ts)",
        pip: "bg-[rgba(96,165,250,0.1)] text-[var(--ts)] border-[rgba(96,165,250,0.2)]",
        stripe: "bg-[var(--ts)]",
    },
    javascript: {
        label: "JS",
        color: "var(--js)",
        pip: "bg-[rgba(251,191,36,0.1)] text-[var(--js)] border-[rgba(251,191,36,0.2)]",
        stripe: "bg-[var(--js)]",
    },
    html: {
        label: "HTML",
        color: "var(--html)",
        pip: "bg-[rgba(251,113,133,0.1)] text-[var(--html)] border-[rgba(251,113,133,0.2)]",
        stripe: "bg-[var(--html)]",
    },
    css: {
        label: "CSS",
        color: "var(--css)",
        pip: "bg-[rgba(56,189,248,0.1)] text-[var(--css)] border-[rgba(56,189,248,0.2)]",
        stripe: "bg-[var(--css)]",
    },
    scss: {
        label: "SCSS",
        color: "#f472b6",
        pip: "bg-[rgba(244,114,182,0.1)] text-[#f472b6] border-[rgba(244,114,182,0.2)]",
        stripe: "bg-[#f472b6]",
    },

    // --- Backend ---
    python: {
        label: "PY",
        color: "var(--python)",
        pip: "bg-[rgba(74,222,128,0.1)] text-[var(--python)] border-[rgba(74,222,128,0.2)]",
        stripe: "bg-[var(--python)]",
    },
    php: {
        label: "PHP",
        color: "var(--php)",
        pip: "bg-[rgba(167,139,250,0.1)] text-[var(--php)] border-[rgba(167,139,250,0.2)]",
        stripe: "bg-[var(--php)]",
    },
    java: {
        label: "JAVA",
        color: "#fb923c",
        pip: "bg-[rgba(251,146,60,0.1)] text-[#fb923c] border-[rgba(251,146,60,0.2)]",
        stripe: "bg-[#fb923c]",
    },
    csharp: {
        label: "C#",
        color: "#a78bfa",
        pip: "bg-[rgba(167,139,250,0.1)] text-[#a78bfa] border-[rgba(167,139,250,0.2)]",
        stripe: "bg-[#a78bfa]",
    },
    go: {
        label: "GO",
        color: "var(--go)",
        pip: "bg-[rgba(103,232,249,0.1)] text-[var(--go)] border-[rgba(103,232,249,0.2)]",
        stripe: "bg-[var(--go)]",
    },
    rust: {
        label: "RS",
        color: "var(--rust)",
        pip: "bg-[rgba(251,146,60,0.1)] text-[var(--rust)] border-[rgba(251,146,60,0.2)]",
        stripe: "bg-[var(--rust)]",
    },
    ruby: {
        label: "RB",
        color: "#f87171",
        pip: "bg-[rgba(248,113,113,0.1)] text-[#f87171] border-[rgba(248,113,113,0.2)]",
        stripe: "bg-[#f87171]",
    },
    kotlin: {
        label: "KT",
        color: "#c084fc",
        pip: "bg-[rgba(192,132,252,0.1)] text-[#c084fc] border-[rgba(192,132,252,0.2)]",
        stripe: "bg-[#c084fc]",
    },
    swift: {
        label: "SW",
        color: "#fb923c",
        pip: "bg-[rgba(251,146,60,0.1)] text-[#fb923c] border-[rgba(251,146,60,0.2)]",
        stripe: "bg-[#fb923c]",
    },
    dart: {
        label: "DART",
        color: "#38bdf8",
        pip: "bg-[rgba(56,189,248,0.1)] text-[#38bdf8] border-[rgba(56,189,248,0.2)]",
        stripe: "bg-[#38bdf8]",
    },

    // --- Data & DB ---
    sql: {
        label: "SQL",
        color: "var(--sql)",
        pip: "bg-[var(--em-faint)] text-[var(--sql)] border-[var(--em-border)]",
        stripe: "bg-[var(--sql)]",
    },
    postgresql: {
        label: "PG",
        color: "#60a5fa",
        pip: "bg-[rgba(96,165,250,0.1)] text-[#60a5fa] border-[rgba(96,165,250,0.2)]",
        stripe: "bg-[#60a5fa]",
    },
    mysql: {
        label: "MY",
        color: "#f59e0b",
        pip: "bg-[rgba(245,158,11,0.1)] text-[#f59e0b] border-[rgba(245,158,11,0.2)]",
        stripe: "bg-[#f59e0b]",
    },
    mongodb: {
        label: "MDB",
        color: "#4ade80",
        pip: "bg-[rgba(74,222,128,0.1)] text-[#4ade80] border-[rgba(74,222,128,0.2)]",
        stripe: "bg-[#4ade80]",
    },

    // --- Config & Scripting ---
    bash: {
        label: "SH",
        color: "#a3e635",
        pip: "bg-[rgba(163,230,53,0.1)] text-[#a3e635] border-[rgba(163,230,53,0.2)]",
        stripe: "bg-[#a3e635]",
    },
    powershell: {
        label: "PS",
        color: "#818cf8",
        pip: "bg-[rgba(129,140,248,0.1)] text-[#818cf8] border-[rgba(129,140,248,0.2)]",
        stripe: "bg-[#818cf8]",
    },
    yaml: {
        label: "YML",
        color: "#fb7185",
        pip: "bg-[rgba(251,113,133,0.1)] text-[#fb7185] border-[rgba(251,113,133,0.2)]",
        stripe: "bg-[#fb7185]",
    },
    toml: {
        label: "TOML",
        color: "#fbbf24",
        pip: "bg-[rgba(251,191,36,0.1)] text-[#fbbf24] border-[rgba(251,191,36,0.2)]",
        stripe: "bg-[#fbbf24]",
    },
    dockerfile: {
        label: "DOCK",
        color: "#38bdf8",
        pip: "bg-[rgba(56,189,248,0.1)] text-[#38bdf8] border-[rgba(56,189,248,0.2)]",
        stripe: "bg-[#38bdf8]",
    },

    // --- Data Format ---
    json: {
        label: "JSON",
        color: "#fbbf24",
        pip: "bg-[rgba(251,191,36,0.1)] text-[#fbbf24] border-[rgba(251,191,36,0.2)]",
        stripe: "bg-[#fbbf24]",
    },
    xml: {
        label: "XML",
        color: "#f87171",
        pip: "bg-[rgba(248,113,113,0.1)] text-[#f87171] border-[rgba(248,113,113,0.2)]",
        stripe: "bg-[#f87171]",
    },
    markdown: {
        label: "MD",
        color: "#94a3b8",
        pip: "bg-[rgba(148,163,184,0.1)] text-[#94a3b8] border-[rgba(148,163,184,0.2)]",
        stripe: "bg-[#94a3b8]",
    },

    // --- Lainnya ---
    c: {
        label: "C",
        color: "#60a5fa",
        pip: "bg-[rgba(96,165,250,0.1)] text-[#60a5fa] border-[rgba(96,165,250,0.2)]",
        stripe: "bg-[#60a5fa]",
    },
    cpp: {
        label: "C++",
        color: "#818cf8",
        pip: "bg-[rgba(129,140,248,0.1)] text-[#818cf8] border-[rgba(129,140,248,0.2)]",
        stripe: "bg-[#818cf8]",
    },
    r: {
        label: "R",
        color: "#38bdf8",
        pip: "bg-[rgba(56,189,248,0.1)] text-[#38bdf8] border-[rgba(56,189,248,0.2)]",
        stripe: "bg-[#38bdf8]",
    },
    elixir: {
        label: "EX",
        color: "#a78bfa",
        pip: "bg-[rgba(167,139,250,0.1)] text-[#a78bfa] border-[rgba(167,139,250,0.2)]",
        stripe: "bg-[#a78bfa]",
    },
    haskell: {
        label: "HS",
        color: "#c084fc",
        pip: "bg-[rgba(192,132,252,0.1)] text-[#c084fc] border-[rgba(192,132,252,0.2)]",
        stripe: "bg-[#c084fc]",
    },
    lua: {
        label: "LUA",
        color: "#818cf8",
        pip: "bg-[rgba(129,140,248,0.1)] text-[#818cf8] border-[rgba(129,140,248,0.2)]",
        stripe: "bg-[#818cf8]",
    },
    scala: {
        label: "SC",
        color: "#f87171",
        pip: "bg-[rgba(248,113,113,0.1)] text-[#f87171] border-[rgba(248,113,113,0.2)]",
        stripe: "bg-[#f87171]",
    },
    other: {
        label: "?",
        color: "#64748b",
        pip: "bg-white/5 text-white/40 border-white/10",
        stripe: "bg-[#64748b]",
    },
}

// fallback kalau language tidak ditemukan di config
export const defaultLang: LanguageConfig = {
    label: "?",
    color: "#64748b",
    pip: "bg-white/5 text-white/40 border-white/10",
    stripe: "bg-[#64748b]",
}

// helper function
export function getLang(language: string): LanguageConfig {
    return languages[language.toLowerCase()] ?? defaultLang
}

// list untuk dropdown modal
export const LANGUAGE_OPTIONS = Object.keys(languages)