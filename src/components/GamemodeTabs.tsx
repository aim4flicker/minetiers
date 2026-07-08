import Link from "next/link"
import { GAMEMODES } from "@/lib/data"
import type { Gamemode } from "@/types"

interface GamemodeTabsProps {
  active: Gamemode
}

const GAMEMODE_ICONS: Record<string, string> = {
  overall: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  vanilla: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
  uhc: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
  pot: "M19 5v2h-4V5h4zm0 4v2h-4V9h4zm-8 0v2H7V9h4zm8 4v2h-4v-2h4zm-8 0v2H7v-2h4zm8 4v2h-4v-2h4zm-8 0v2H7v-2h4zM3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2z",
  nethop: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  smp: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
  sword: "M20.8 11.6l-1.4-1.4L12 17.6 4.6 10.2l-1.4 1.4L12 20.4l8.8-8.8zM12 2L2 7l10 5 10-5-10-5z",
  axe: "M6 2l-4 4 6 6 2-2-4-4 4-4 4 4 2-2-6-6zm-4 8l-2 2 6 6 2-2-4-4 2-2-2-2-2 2zm12 2l-6 6 2 2 6-6-2-2zm4-4l-2 2 8 8 2-2-8-8z",
  mace: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z",
  ltm: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
}

export default function GamemodeTabs({ active }: GamemodeTabsProps) {
  return (
    <section className="w-full flex gap-1 absolute top-auto bottom-full left-0 overflow-x-auto overflow-y-hidden">
      {GAMEMODES.map((mode, i) => {
        const isActive = mode.key === active
        return (
          <Link
            key={mode.key}
            href={`/rankings/${mode.key}`}
            style={{ transform: "translateY(50px)" }}
            className={`w-28 h-fit duration-100 text-nowrap relative flex flex-col items-center justify-end rounded-t-3xl border-2 border-b-none border-border px-8 pt-1 ${
              isActive
                ? "bg-accent/50 text-foreground"
                : "text-muted-foreground/40 hover:bg-accent/50 hover:text-accent-foreground active:bg-accent/20"
            }`}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
              <path d={GAMEMODE_ICONS[mode.key]} />
            </svg>
            <strong className="capitalize text-sm">{mode.label}</strong>
            {isActive && (
              <span className="w-full h-0.5 bg-white block absolute bottom-0 left-0" />
            )}
          </Link>
        )
      })}
    </section>
  )
}
