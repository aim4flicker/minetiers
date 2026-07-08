"use client"

import { useMemo, useState } from "react"
import { GAMEMODES } from "@/lib/data"
import type { Gamemode, Player } from "@/types"
import PlayerRow from "./PlayerRow"
import SearchBar from "./SearchBar"
import PlayerModal from "./PlayerModal"

interface RankingsTableProps {
  gamemode: Gamemode
  initialPlayers: Player[]
}

export default function RankingsTable({ gamemode, initialPlayers }: RankingsTableProps) {
  const [search, setSearch] = useState("")
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [toast, setToast] = useState<{ type: "error" | "success"; message: string } | null>(null)

  const players = initialPlayers

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    const gmSet = new Set(
      players
        .filter((p) => p.gamemodes.some((g) => g.gamemode === gamemode))
        .map((p) => p.id)
    )
    const sorted = [...players]
      .filter((p) => gamemode === "overall" || gmSet.has(p.id))
      .sort((a, b) => a.overall - b.overall)
    if (!q) return sorted
    return sorted.filter((p) => p.name.toLowerCase().includes(q))
  }, [gamemode, search, players])

  const handleSearchSubmit = (value: string) => {
    const q = value.trim().toLowerCase()
    if (!q) return
    const player = players.find((p) => p.name.toLowerCase() === q)
    if (player) {
      setSelectedPlayer(player)
      setToast({ type: "success", message: `Found player: ${player.name}` })
    } else {
      setToast({ type: "error", message: "Player not found. Please check the username and try again." })
    }
    setTimeout(() => setToast(null), 4000)
  }

  return (
    <div>
      <div className="flex items-center justify-end mb-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          onSubmit={handleSearchSubmit}
        />
      </div>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[9999] transition-all duration-500 ${
            toast ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        >
          <div
            className={`p-4 rounded-2xl shadow-2xl border-2 min-w-[280px] max-w-[400px] ${
              toast.type === "error"
                ? "bg-gradient-to-br from-red-500 to-red-700 border-red-400 text-white"
                : "bg-gradient-to-br from-green-500 to-green-700 border-green-400 text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                toast.type === "error" ? "bg-red-600" : "bg-green-600"
              }`}>
                {toast.type === "error" ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-bold">{toast.type === "error" ? "Error" : "Success"}</p>
                <p className="text-sm opacity-90">{toast.message}</p>
              </div>
            </div>
            <button
              onClick={() => setToast(null)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full hover:bg-black/20 flex items-center justify-center"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Desktop header */}
      <div className="hidden md:flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase text-muted tracking-wider">
        <span className="w-8 shrink-0">#</span>
        <span className="w-[196px] shrink-0 text-right">Player</span>
        <span className="inline-block text-right ml-auto">Region</span>
        <span className="w-[340px] text-center ml-auto">
          {GAMEMODES.map((m) => (
            <span
              key={m.key}
              className={`inline-block w-6 text-center mx-1.5 ${
                m.key === gamemode ? "text-accent" : ""
              }`}
            >
              {m.label.slice(0, 2)}
            </span>
          ))}
        </span>
      </div>

      {/* Mobile header */}
      <div className="flex md:hidden items-center gap-2 px-4 py-2 text-xs font-bold uppercase text-muted tracking-wider">
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
            onClick={setSelectedPlayer}
          />
        ))
      )}

      {selectedPlayer && (
        <PlayerModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  )
}
