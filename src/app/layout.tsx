import type { Metadata, Viewport } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  title: "Minetiers - Rankings",
  description: "View Minecraft's best combat players or participate in the ranked community!",
  keywords: ["minecraft", "pvp", "tierlist", "minetiers", "rankings"],
}

export const viewport: Viewport = {
  themeColor: "#06b6d4",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <Navbar />
        <div aria-hidden className="pt-8" />
        {children}
        <footer className="w-full h-fit p-12 bg-layout-section mt-24">
          <div className="text-2xl text-slate-400 text-center">
            Copyrights &copy; Minetiers 2025
          </div>
        </footer>
      </body>
    </html>
  )
}
