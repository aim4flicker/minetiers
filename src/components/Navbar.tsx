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
      icon: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
    },
    {
      href: "/rankings/overall",
      label: "Rankings",
      icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
    },
    {
      href: "#",
      label: "Discords",
      icon: "M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019",
      external: true,
      externalHref: "https://discord.gg/mcpvp",
    },
    {
      href: "/docs",
      label: "API Docs",
      icon: "M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z",
    },
  ]

  return (
    <header className="w-full max-w-[1352px] mx-auto mt-4 rounded-xl bg-layout-section border-2 border-border z-50">
      <nav className="flex items-center justify-between gap-2 px-4 h-16">
        <Link href="/" className="flex items-center gap-2 mr-auto max-w-40 w-full">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-accent">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-base font-bold tracking-tight">Minetiers</span>
        </Link>

        {/* Desktop nav */}
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
                    className={`group p-2 relative flex items-center gap-2 z-20 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-muted-foreground/60 group-hover:text-foreground transition-colors">
                      <path d={link.icon} />
                    </svg>
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
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`transition-colors ${
                      isHome || isActive ? "text-muted" : "text-muted-foreground/60 group-hover:text-foreground"
                    }`}
                  >
                    <path d={link.icon} />
                  </svg>
                  <span>{link.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Search + Mobile hamburger */}
        <div className="ml-auto max-w-52 max-md:max-w-fit w-full flex justify-end items-center gap-2">
          {/* Mobile hamburger */}
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

      {/* Mobile menu */}
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={link.icon} /></svg>
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.href}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/10"
                  onClick={() => setMobileOpen(false)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={link.icon} /></svg>
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
