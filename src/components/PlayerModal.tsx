"use client"

import { useEffect } from "react"
import type { Player } from "@/types"
import { GAMEMODES } from "@/lib/data"

interface PlayerModalProps {
  player: Player
  onClose: () => void
}

function getTierColor(tier: string): string {
  const prefix = tier.slice(0, 1)
  switch (prefix) {
    case "H": return "text-red-400"
    case "M": return "text-blue-400"
    case "L": return "text-yellow-400"
    default: return "text-gray-400"
  }
}

export default function PlayerModal({ player, onClose }: PlayerModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onClose])

  const gamemodeMap = new Map(player.gamemodes.map((g) => [g.gamemode, g.tier]))

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-2 bg-black/80 z-50"
      onClick={onClose}
    >
      <div
        className="max-w-lg w-full rounded-3xl h-fit px-10 py-8 bg-card cursor-default border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="size-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center float-right text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <section className="w-full h-fit text-center py-2 flex items-center justify-center flex-col space-y-4">
          <div className="m-auto size-28 overflow-hidden border-2 border-border bg-secondary rounded-full flex items-center justify-center">
            <img
              src={player.avatar}
              alt={`${player.name}'s Skin`}
              width={95}
              height={95}
              className="object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${player.name}`
              }}
            />
          </div>

          <h1 className="text-3xl font-bold text-slate-300">
            {player.name}
          </h1>

          <h3 className="text-lg font-semibold text-muted-foreground">
            {player.region}
          </h3>

          <a
            href={`https://namemc.com/profile/${player.uuid || player.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-secondary rounded-lg text-sm px-3 py-1.5 text-muted-foreground hover:text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            <img
              src="https://pt.minecraft.wiki/images/NameMC.png?f63c3"
              height={16}
              width={16}
              alt="NameMC"
              className="rounded-sm"
            />
            NameMC
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </a>
        </section>

        <section className="w-full h-fit space-y-4 mt-6">
          <div className="w-full space-y-2">
            <h2 className="text-lg text-muted-foreground font-medium">POSITION</h2>
            <div className="flex items-center gap-3 bg-secondary/50 rounded-xl px-4 py-3 border border-border">
              <div className="flex items-center gap-2">
                <strong className="text-3xl font-bold italic text-accent">
                  #{player.overall}
                </strong>
                <div className="flex items-center gap-1.5">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-accent">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <strong className="text-base">OVERALL</strong>
                </div>
              </div>
              {player.points && (
                <span className="text-sm text-muted-foreground ml-auto">
                  ({player.points} points)
                </span>
              )}
            </div>
          </div>

          <div className="w-full space-y-2">
            <h2 className="text-lg text-muted-foreground font-medium">TIERS</h2>
            <div className="flex flex-wrap gap-2">
              {GAMEMODES.map((mode) => {
                const tier = gamemodeMap.get(mode.key)
                return (
                  <div
                    key={mode.key}
                    className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1.5 rounded-lg border border-border"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-muted-foreground">
                      <path d={GAMEMODE_ICONS[mode.key] || ""} />
                    </svg>
                    <span className={`text-xs font-bold ${tier ? getTierColor(tier) : "text-muted-foreground"}`}>
                      {tier || "—"}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {player.desc && (
            <p className="text-sm text-muted-foreground text-center mt-2">{player.desc}</p>
          )}
        </section>
      </div>
    </div>
  )
}

const GAMEMODE_ICONS: Record<string, string> = {
  overall: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  vanilla: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z",
  uhc: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
  pot: "M19 5v2h-4V5h4zm0 4v2h-4V9h4z",
  nethop: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  smp: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z",
  sword: "M12 2L2 7l10 5 10-5-10-5z",
  axe: "M6 2l-4 4 6 6 2-2-4-4 4-4 4 4 2-2-6-6z",
  mace: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z",
  ltm: "M12 2L2 7l10 5 10-5-10-5z",
}
