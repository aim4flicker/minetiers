"use client"

import { useEffect } from "react"
import type { Player } from "@/types"
import { GAMEMODES } from "@/lib/data"

interface PlayerModalProps {
  player: Player
  onClose: () => void
}

const ICON_MAP: Record<string, string> = {
  overall: "/tier_icons/overall.svg",
  vanilla: "/tier_icons/vanilla.svg",
  uhc: "/tier_icons/uhc.svg",
  pot: "/tier_icons/pot.svg",
  nethop: "/tier_icons/nethop.svg",
  smp: "/tier_icons/smp.svg",
  sword: "/tier_icons/sword.svg",
  axe: "/tier_icons/axe.svg",
  mace: "/tier_icons/mace.svg",
  ltm: "/tier_icons/2v2.svg",
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
      className="fixed inset-0 flex items-center justify-center p-2 bg-black/80 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="max-w-lg w-full rounded-3xl h-fit px-10 py-8 bg-card cursor-default border border-border animate-scaleIn"
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
                  <img src="/tier_icons/overall.svg" alt="" width={20} height={20} className="opacity-80" />
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
                    <img src={ICON_MAP[mode.key]} alt="" width={14} height={14} className="opacity-60" />
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