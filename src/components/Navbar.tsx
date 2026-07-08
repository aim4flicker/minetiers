"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const links = [
    {
      href: "/",
      label: "Home",
      icon: "/nav_icons/home-muted.svg",
    },
    {
      href: "/rankings/overall",
      label: "Rankings",
      icon: "/nav_icons/rankings.svg",
    },
    {
      href: "#",
      label: "Discords",
      icon: "/nav_icons/discord.svg",
      external: true,
      externalHref: "https://discord.gg/mcpvp",
    },
    {
      href: "/docs",
      label: "API Docs",
      icon: "/nav_icons/file_code.svg",
    },
  ]

  return (
    <header className="w-full max-w-[1352px] mx-auto mt-4 rounded-xl bg-layout-section border-2 border-border z-50 animate-fadeIn">
      <nav className="flex items-center justify-between gap-2 px-4 h-16">
        <Link href="/" className="flex items-center gap-2 mr-auto max-w-40 w-full">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-accent">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-base font-bold tracking-tight">Minetiers</span>
        </Link>

        <ul className="hidden md:flex items-center max-w-fit">
          {links.map((link) => {
            const isActive = link.href !== "/" && pathname.startsWith(link.href.replace("/overall", ""))
            const isHome = link.href === "/" && pathname === "/"

            if (link.external) {
              return (
                <li key={link.label}>
                  <a
                    href={link.externalHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-2 relative flex items-center gap-2 z-20 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <img
                      src={link.icon}
                      alt=""
                      width={20}
                      height={20}
                      className="opacity-60 group-hover:opacity-100 transition-opacity"
                    />
                    <span>{link.label}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-muted-foreground/40">
                      <path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z" />
                    </svg>
                  </a>
                </li>
              )
            }

            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`group p-2 relative flex items-center gap-2 z-20 text-lg font-medium transition-colors ${
                    isHome || isActive
                      ? "text-muted cursor-default"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <img
                    src={link.icon}
                    alt=""
                    width={20}
                    height={20}
                    className={`transition-opacity ${
                      isHome || isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                    }`}
                  />
                  <span>{link.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="ml-auto max-w-52 max-md:max-w-fit w-full flex justify-end items-center gap-2">
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <>
                  <path d="M4 5h16" />
                  <path d="M4 12h16" />
                  <path d="M4 19h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-border px-4 py-3 space-y-1">
          {links.map((link) => (
            <div key={link.label}>
              {link.external ? (
                <a
                  href={link.externalHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/10"
                  onClick={() => setMobileOpen(false)}
                >
                  <img src={link.icon} alt="" width={16} height={16} className="opacity-60" />
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.href}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/10"
                  onClick={() => setMobileOpen(false)}
                >
                  <img src={link.icon} alt="" width={16} height={16} className="opacity-60" />
                  {link.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  )
}