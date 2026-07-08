"use client"

import { useMemo, useState } from "react"
import { players, GAMEMODES } from "@/lib/data"
import type { Gamemode } from "@/types"
import PlayerRow from "./PlayerRow"
import SearchBar from "./SearchBar"

interface RankingsTableProps {
  gamemode: Gamemode
}

export default function RankingsTable({ gamemode }: RankingsTableProps) {
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    const sorted = [...players].sort((a, b) => a.tiers[gamemode] - b.tiers[gamemode])
    if (!q) return sorted
    return sorted.filter((p) => p.name.toLowerCase().includes(q))
  }, [gamemode, search])

  return (
    <div>
      <div className="flex items-center justify-end mb-4">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {/* Desktop header */}
      <div className="hidden md:flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase text-muted-foreground tracking-wider">
        <span className="w-8 shrink-0">#</span>
        <span className="w-[196px] shrink-0 text-right">Player</span>
        <span className="ml-auto">Region</span>
        <span className="w-[340px] text-center ml-auto">
          {GAMEMODES.map((m) => (
            <span
              key={m.key}
              className={`inline-block w-6 text-center mx-1.5 ${
                m.key === gamemode ? "text-accent" : ""
              }`}
            >
              {m.key === gamemode ? m.label.slice(0, 2) : m.label.slice(0, 2)}
            </span>
          ))}
        </span>
      </div>

      {/* Mobile header */}
      <div className="flex md:hidden items-center gap-2 px-4 py-2 text-xs font-bold uppercase text-muted-foreground tracking-wider">
        <span className="w-8 shrink-0">#</span>
        <span className="w-[196px] shrink-0 text-right">Player</span>
        <span className="ml-auto w-[84px] text-right shrink-0">Region</span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No players found for &quot;{search}&quot;
        </div>
      ) : (
        filtered.map((player, i) => (
          <PlayerRow
            key={player.id}
            player={player}
            rank={i + 1}
            activeGamemode={gamemode}
          />
        ))
      )}
    </div>
  )
}
