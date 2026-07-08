"use client"

import type { Player, Gamemode } from "@/types"
import { GAMEMODES } from "@/lib/data"

interface PlayerRowProps {
  player: Player
  rank: number
  activeGamemode: Gamemode
  onClick: (player: Player) => void
}

function getTierColor(tier: string): string {
  const prefix = tier.slice(0, 1)
  switch (prefix) {
    case "H": return "text-red-400"
    case "M": return "text-blue-400"
    case "L": return "text-yellow-400"
    default: return "text-muted-foreground"
  }
}

const gamemodeMap = new Map(GAMEMODES.map((m) => [m.key, m.key]))

export default function PlayerRow({ player, rank, activeGamemode, onClick }: PlayerRowProps) {
  const tierMap = new Map(player.gamemodes.map((g) => [g.gamemode, g.tier]))

  return (
    <div
      className="flex items-center gap-2 px-4 py-3 border-b border-border hover:bg-secondary/30 transition-colors cursor-pointer"
      onClick={() => onClick(player)}
    >
      <span className="w-8 text-sm font-bold text-muted-foreground shrink-0">
        {rank}
      </span>
      <div className="flex items-center gap-2 w-[196px] shrink-0">
        <img
          src={player.avatar}
          alt={player.name}
          className="w-8 h-8 rounded-lg object-contain bg-secondary"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none"
            ;(e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden")
          }}
        />
        <span className="text-sm font-medium truncate">{player.name}</span>
      </div>
      <span className="text-xs font-semibold text-muted-foreground ml-auto md:ml-0 shrink-0">
        {player.region}
      </span>
      <div className="hidden md:flex items-center gap-1.5 w-[340px] justify-end ml-auto">
        {GAMEMODES.map((mode) => {
          const tier = tierMap.get(mode.key)
          return (
            <span
              key={mode.key}
              className={`text-xs font-bold w-6 text-center ${
                mode.key === activeGamemode
                  ? "text-accent"
                  : tier
                    ? getTierColor(tier)
                    : "text-muted-foreground"
              }`}
            >
              {tier ? tier.slice(-1) : "—"}
            </span>
          )
        })}
      </div>
    </div>
  )
}
