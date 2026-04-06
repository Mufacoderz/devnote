import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Devnote",
  description: "Personal code snippet library for developers",
  icons: {
    icon: [
      { url: "/emerald-trans.png", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${outfit.variable} ${jetbrainsMono.variable}`}
    >
      
      <body className="min-h-screen bg-[#0a0a0a] text-[#e8f0e8] antialiased">

        <Providers>
          {children}
        </Providers>

      </body>
    </html>
  );
}