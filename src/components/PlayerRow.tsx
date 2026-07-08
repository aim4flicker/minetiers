import type { Player, Gamemode } from "@/types"

interface PlayerRowProps {
  player: Player
  rank: number
  activeGamemode: Gamemode
}

const TIER_COLORS: Record<string, string> = {
  "1": "text-yellow-400",
  "2": "text-orange-400",
  "3": "text-red-400",
  "4": "text-purple-400",
  "5": "text-blue-400",
}

function getTierColor(tier: number): string {
  return TIER_COLORS[String(tier)] ?? "text-muted-foreground"
}

export default function PlayerRow({ player, rank, activeGamemode }: PlayerRowProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-border hover:bg-secondary/30 transition-colors">
      <span className="w-8 text-sm font-bold text-muted-foreground shrink-0">
        {rank}
      </span>
      <div className="flex items-center gap-2 w-[196px] shrink-0">
        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent shrink-0">
          {player.name.charAt(0)}
        </div>
        <span className="text-sm font-medium truncate">{player.name}</span>
      </div>
      <span className="text-xs font-semibold text-muted-foreground ml-auto md:ml-0 shrink-0">
        {player.region}
      </span>
      <div className="hidden md:flex items-center gap-3 w-[340px] justify-end ml-auto">
        {(Object.keys(player.tiers) as Gamemode[]).map((mode) => (
          <span
            key={mode}
            className={`text-xs font-bold w-6 text-center ${
              mode === activeGamemode
                ? "text-accent text-sm"
                : getTierColor(player.tiers[mode])
            }`}
          >
            {player.tiers[mode]}
          </span>
        ))}
      </div>
    </div>
  )
}
