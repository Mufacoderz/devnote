export interface LanguageConfig {
    label: string
    color: string
    pip: string
    stripe: string
}

export const languages: Record<string, LanguageConfig> = {

    // --- Web ---
    typescript: {
        label: "TS",
        color: "#3178c6",
        pip: "bg-[rgba(49,120,198,0.1)] text-[#3178c6] border-[rgba(49,120,198,0.25)]",
        stripe: "bg-[#3178c6]",
    },
    javascript: {
        label: "JS",
        color: "#f7df1e",
        pip: "bg-[rgba(247,223,30,0.1)] text-[#f7df1e] border-[rgba(247,223,30,0.25)]",
        stripe: "bg-[#f7df1e]",
    },
    html: {
        label: "HTML",
        color: "#e34c26",
        pip: "bg-[rgba(227,76,38,0.1)] text-[#e34c26] border-[rgba(227,76,38,0.25)]",
        stripe: "bg-[#e34c26]",
    },
    css: {
        label: "CSS",
        color: "#264de4",
        pip: "bg-[rgba(38,77,228,0.1)] text-[#264de4] border-[rgba(38,77,228,0.25)]",
        stripe: "bg-[#264de4]",
    },
    scss: {
        label: "SCSS",
        color: "#cc6699",
        pip: "bg-[rgba(204,102,153,0.1)] text-[#cc6699] border-[rgba(204,102,153,0.25)]",
        stripe: "bg-[#cc6699]",
    },

    // --- Frontend ---
    vue: {
        label: "VUE",
        color: "#42b883",
        pip: "bg-[rgba(66,184,131,0.1)] text-[#42b883] border-[rgba(66,184,131,0.25)]",
        stripe: "bg-[#42b883]",
    },
    react: {
        label: "RE",
        color: "#61dafb",
        pip: "bg-[rgba(97,218,251,0.1)] text-[#61dafb] border-[rgba(97,218,251,0.25)]",
        stripe: "bg-[#61dafb]",
    },

    // --- Backend ---
    python: {
        label: "PY",
        color: "#ffd43b",
        pip: "bg-[rgba(255,212,59,0.1)] text-[#ffd43b] border-[rgba(255,212,59,0.25)]",
        stripe: "bg-[#ffd43b]",
    },
    php: {
        label: "PHP",
        color: "#777bb4",
        pip: "bg-[rgba(119,123,180,0.1)] text-[#777bb4] border-[rgba(119,123,180,0.25)]",
        stripe: "bg-[#777bb4]",
    },
    java: {
        label: "JAVA",
        color: "#f89820",
        pip: "bg-[rgba(248,152,32,0.1)] text-[#f89820] border-[rgba(248,152,32,0.25)]",
        stripe: "bg-[#f89820]",
    },
    csharp: {
        label: "C#",
        color: "#9b4f96",
        pip: "bg-[rgba(155,79,150,0.1)] text-[#9b4f96] border-[rgba(155,79,150,0.25)]",
        stripe: "bg-[#9b4f96]",
    },
    go: {
        label: "GO",
        color: "#00add8",
        pip: "bg-[rgba(0,173,216,0.1)] text-[#00add8] border-[rgba(0,173,216,0.25)]",
        stripe: "bg-[#00add8]",
    },
    rust: {
        label: "RS",
        color: "#dea584",
        pip: "bg-[rgba(222,165,132,0.1)] text-[#dea584] border-[rgba(222,165,132,0.25)]",
        stripe: "bg-[#dea584]",
    },

    // --- Database ---
    mysql: {
        label: "MY",
        color: "#00758f",
        pip: "bg-[rgba(0,117,143,0.1)] text-[#00758f] border-[rgba(0,117,143,0.25)]",
        stripe: "bg-[#00758f]",
    },
    postgresql: {
        label: "PG",
        color: "#336791",
        pip: "bg-[rgba(51,103,145,0.1)] text-[#336791] border-[rgba(51,103,145,0.25)]",
        stripe: "bg-[#336791]",
    },
    mongodb: {
        label: "MDB",
        color: "#47a248",
        pip: "bg-[rgba(71,162,72,0.1)] text-[#47a248] border-[rgba(71,162,72,0.25)]",
        stripe: "bg-[#47a248]",
    },

    // --- DevOps ---
    dockerfile: {
        label: "DOCK",
        color: "#2496ed",
        pip: "bg-[rgba(36,150,237,0.1)] text-[#2496ed] border-[rgba(36,150,237,0.25)]",
        stripe: "bg-[#2496ed]",
    },

    // --- Data ---
    json: {
        label: "JSON",
        color: "#f5a623",
        pip: "bg-[rgba(245,166,35,0.1)] text-[#f5a623] border-[rgba(245,166,35,0.25)]",
        stripe: "bg-[#f5a623]",
    },
    markdown: {
        label: "MD",
        color: "#94a3b8",
        pip: "bg-[rgba(148,163,184,0.1)] text-[#94a3b8] border-[rgba(148,163,184,0.25)]",
        stripe: "bg-[#94a3b8]",
    },

    // --- fallback ---
    other: {
        label: "?",
        color: "#64748b",
        pip: "bg-white/5 text-white/40 border-white/10",
        stripe: "bg-[#64748b]",
    },
}

export const defaultLang: LanguageConfig = languages.other

// alias biar fleksibel input
const alias: Record<string, string> = {
    ts: "typescript",
    js: "javascript",
    py: "python",
    sh: "bash",
    yml: "yaml",
    md: "markdown",
    rs: "rust",
    golang: "go",
    "c#": "csharp",
    "c++": "cpp",
}


export function getLang(language: string): LanguageConfig {
    if (!language) return defaultLang

    let key = language.toLowerCase().trim()

    // hapus spasi aneh
    key = key.replace(/\s+/g, "")

    const normalized = alias[key] ?? key

    return languages[normalized] ?? defaultLang
}

// dropdown options
export const LANGUAGE_OPTIONS = Object.keys(languages)