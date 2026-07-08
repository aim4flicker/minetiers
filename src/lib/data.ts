import type { GamemodeInfo, Player } from "@/types"
import { getSupabase } from "./supabase"
import { rankPlayers } from "./tiers"

export const GAMEMODES: GamemodeInfo[] = [
  { key: "overall", label: "Overall" },
  { key: "vanilla", label: "Vanilla" },
  { key: "uhc", label: "UHC" },
  { key: "pot", label: "Pot" },
  { key: "nethop", label: "NethOP" },
  { key: "smp", label: "SMP" },
  { key: "sword", label: "Sword" },
  { key: "axe", label: "Axe" },
  { key: "mace", label: "Mace" },
  { key: "ltm", label: "LTMs" },
]

let cachedPlayers: Player[] | null = null

export async function getPlayers(): Promise<Player[]> {
  if (cachedPlayers) return cachedPlayers

  try {
    const supabase = getSupabase()

    const { data: dbPlayers, error: pErr } = await supabase
      .from("players")
      .select("*")

    if (pErr || !dbPlayers || dbPlayers.length === 0) {
      return []
    }

    const { data: dbTiers, error: tErr } = await supabase
      .from("player_tiers")
      .select("*")

    if (tErr) {
      return []
    }

    const tierMap = new Map<string, { gamemode: string; tier: string }[]>()
    for (const t of dbTiers ?? []) {
      if (!tierMap.has(t.player_id)) tierMap.set(t.player_id, [])
      tierMap.get(t.player_id)!.push({ gamemode: t.gamemode, tier: t.tier })
    }

    const raw = dbPlayers.map((p) => ({
      id: p.id,
      name: p.name,
      uuid: p.uuid || undefined,
      region: p.region,
      avatar: p.avatar || `https://render.crafty.gg/3d/bust/${p.name}`,
      overall: p.overall ?? 0,
      points: p.points ?? 0,
      desc: p.desc || undefined,
      gamemodes: (tierMap.get(p.id) ?? []).map((t) => ({
        gamemode: t.gamemode as Player["gamemodes"][0]["gamemode"],
        tier: t.tier,
      })),
    }))

    const rankings = rankPlayers(raw.map((p) => ({
      id: p.id,
      gamemodes: p.gamemodes,
    })))

    const result = raw.map((p) => {
      const r = rankings.get(p.id)
      return {
        ...p,
        overall: r?.overall ?? 0,
        points: r?.points ?? 0,
      }
    })

    result.sort((a, b) => a.overall - b.overall)

    cachedPlayers = result
    return result
  } catch {
    return []
  }
}

export function clearPlayerCache() {
  cachedPlayers = null
}