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
      return getDemoPlayers()
    }

    const { data: dbTiers, error: tErr } = await supabase
      .from("player_tiers")
      .select("*")

    if (tErr) {
      return getDemoPlayers()
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
    return getDemoPlayers()
  }
}

function getDemoPlayers(): Player[] {
  const players: Player[] = [
    {
      id: "1", name: "Aim4Flicker", uuid: "aim4flicker", region: "EU",
      avatar: "https://render.crafty.gg/3d/bust/Aim4Flicker",
      overall: 1, points: 9850,
      gamemodes: [
        { gamemode: "vanilla", tier: "HT1" }, { gamemode: "nethop", tier: "HT1" },
        { gamemode: "sword", tier: "HT1" }, { gamemode: "pot", tier: "HT2" },
        { gamemode: "uhc", tier: "MT2" }, { gamemode: "smp", tier: "LT3" },
        { gamemode: "axe", tier: "HT2" }, { gamemode: "mace", tier: "HT1" },
        { gamemode: "ltm", tier: "HT1" },
      ],
    },
    {
      id: "2", name: "Dream", uuid: "dream", region: "NA",
      avatar: "https://render.crafty.gg/3d/bust/Dream",
      overall: 2, points: 9200,
      gamemodes: [
        { gamemode: "vanilla", tier: "HT2" }, { gamemode: "nethop", tier: "HT3" },
        { gamemode: "sword", tier: "HT2" }, { gamemode: "pot", tier: "MT3" },
        { gamemode: "uhc", tier: "HT1" }, { gamemode: "smp", tier: "HT1" },
        { gamemode: "axe", tier: "HT1" }, { gamemode: "mace", tier: "MT2" },
        { gamemode: "ltm", tier: "HT2" },
      ],
    },
    {
      id: "3", name: "Technoblade", uuid: "technoblade", region: "NA",
      avatar: "https://render.crafty.gg/3d/bust/Technoblade",
      overall: 3, points: 8950,
      gamemodes: [
        { gamemode: "vanilla", tier: "HT2" }, { gamemode: "nethop", tier: "MT3" },
        { gamemode: "sword", tier: "HT3" }, { gamemode: "pot", tier: "HT2" },
        { gamemode: "uhc", tier: "HT3" }, { gamemode: "smp", tier: "HT2" },
        { gamemode: "axe", tier: "HT3" }, { gamemode: "mace", tier: "HT2" },
        { gamemode: "ltm", tier: "MT3" },
      ],
    },
    {
      id: "4", name: "Fruitberries", uuid: "fruitberries", region: "NA",
      avatar: "https://render.crafty.gg/3d/bust/Fruitberries",
      overall: 4, points: 8700,
      gamemodes: [
        { gamemode: "vanilla", tier: "HT4" }, { gamemode: "nethop", tier: "HT2" },
        { gamemode: "sword", tier: "HT4" }, { gamemode: "pot", tier: "HT3" },
        { gamemode: "uhc", tier: "HT4" }, { gamemode: "smp", tier: "HT4" },
        { gamemode: "axe", tier: "HT4" }, { gamemode: "mace", tier: "HT4" },
        { gamemode: "ltm", tier: "HT4" },
      ],
    },
    {
      id: "5", name: "Purpled", uuid: "purpled", region: "NA",
      avatar: "https://render.crafty.gg/3d/bust/Purpled",
      overall: 5, points: 8400,
      gamemodes: [
        { gamemode: "vanilla", tier: "MT5" }, { gamemode: "nethop", tier: "HT4" },
        { gamemode: "sword", tier: "MT5" }, { gamemode: "pot", tier: "HT4" },
        { gamemode: "uhc", tier: "MT5" }, { gamemode: "smp", tier: "MT5" },
        { gamemode: "axe", tier: "MT5" }, { gamemode: "mace", tier: "MT5" },
        { gamemode: "ltm", tier: "MT5" },
      ],
    },
  ]

  const rankings = rankPlayers(players.map((p) => ({
    id: p.id,
    gamemodes: p.gamemodes,
  })))

  return players.map((p) => {
    const r = rankings.get(p.id)
    return { ...p, overall: r?.overall ?? 0, points: r?.points ?? 0 }
  }).sort((a, b) => a.overall - b.overall)
}

export function clearPlayerCache() {
  cachedPlayers = null
}