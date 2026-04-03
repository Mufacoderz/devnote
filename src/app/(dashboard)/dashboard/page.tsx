import SnippetList from "@/components/snippet/SnippetList"
import { Snippet } from "@/components/snippet/SnippetDetail"

const dummySnippets: Snippet[] = [
  {
    id: 1,
    title: "Prisma Client Singleton",
    language: "typescript",
    code: `import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prisma = prisma`,
    tags: ["#prisma", "#typescript"],
    copyCount: 14,
    createdAt: "2 hari lalu",
  },
  {
    id: 2,
    title: "JWT Auth Middleware",
    language: "javascript",
    code: `const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Unauthorized' })

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(403).json({ message: 'Token tidak valid' })
  }
}`,
    tags: ["#express", "#auth"],
    copyCount: 22,
    createdAt: "5 hari lalu",
  },
  {
    id: 3,
    title: "useLocalStorage Hook",
    language: "typescript",
    code: `function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initial
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}`,
    tags: ["#hook", "#react"],
    copyCount: 18,
    createdAt: "1 minggu lalu",
  },
  {
    id: 4,
    title: "Laravel API Response Helper",
    language: "php",
    code: `return response()->json([
    'success' => true,
    'message' => 'Data berhasil diambil',
    'data'    => $data,
], 200);`,
    tags: ["#laravel", "#api"],
    copyCount: 11,
    createdAt: "2 minggu lalu",
  },
  {
    id: 5,
    title: "Glassmorphism Card",
    language: "css",
    code: `.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}`,
    tags: ["#css", "#ui"],
    copyCount: 19,
    createdAt: "3 minggu lalu",
  },
]

export default function DashboardPage() {
  return (
    <div className="h-full overflow-hidden">
      <SnippetList snippets={dummySnippets} />
    </div>
  )
}