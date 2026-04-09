# DevNote — Personal Code Snippet Library

**DevNote** adalah web aplikasi modern untuk developer yang membantu menyimpan, mengelola, dan menggunakan kembali potongan kode (code snippets) dengan cepat dan efisien.

Dirancang dengan fokus pada **kecepatan**, **keindahan UI**, **kerapihan**, dan **kemudahan akses**, DevNote membantu developer menghindari copy-paste berulang dan menjaga kode tetap terorganisir.

---

## Tech Stack

- **Next.js 16** (App Router) + **TypeScript**
- **TailwindCSS v3**
- **Prisma** + **MySQL**
- **NextAuth.js v5** (Authentication)
- **Shiki** (Syntax Highlighting)
- **Zustand** (State Management)
- **Framer Motion** (Animasi)
- **@uiw/react-codemirror** (Code Editor di form)

---

## Fitur Aplikasi

- Sistem Login & Registrasi
- CRUD Snippet (Create, Read, Update, Delete)
- Collection / Folder untuk mengelompokkan snippet
- Filter snippet berdasarkan: Language, Tag, Collection, Favorite
- Syntax Highlighting yang indah (mirip VS Code)
- Tombol Salin Kode + tracking jumlah copy
- Favorite snippet
- Responsive design (Desktop split-view & Mobile friendly)
- Dark theme modern dengan desain yang bersih

### Fitur yang akan datang:
- Halaman Snippet Publik
- Fitur Share Snippet

---

## Preview Aplikasi

## Welcome Page
<img src="PreviewIMG/welcome.png" width="100%"/>

## Login & Register
<img src="PreviewIMG/login.png" width="100%"/>
<img src="PreviewIMG/registrasi.png" width="100%"/>

## Home Page (Dashboard)
### Sidebar close
<img src="PreviewIMG/dashboard.png" width="100%"/>
### Sidebar open
<img src="PreviewIMG/dashboard2.png" width="100%"/>

## Form Create Snippet
<img src="PreviewIMG/tambah-snippet.png" width="100%"/>

## 404 Not-found Page
<img src="PreviewIMG/404.png" width="100%"/>

## Error Page
<img src="PreviewIMG/error.png" width="100%"/>

---

## Getting Started

### 1. Clone repository
```bash
git clone <url-repository-anda>
cd devnote-main

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
