export const TIER_SCORE: Record<string, number> = {
  HT1: 1, HT2: 2, HT3: 3, HT4: 4, HT5: 5,
  HT6: 6, HT7: 7, HT8: 8, HT9: 9, HT10: 10,
  MT1: 11, MT2: 12, MT3: 13, MT4: 14, MT5: 15,
  MT6: 16, MT7: 17, MT8: 18, MT9: 19, MT10: 20,
  LT1: 21, LT2: 22, LT3: 23, LT4: 24, LT5: 25,
  LT6: 26, LT7: 27, LT8: 28, LT9: 29, LT10: 30,
}

export type TierGroup = "HT" | "MT" | "LT"

export const TIER_GROUPS: TierGroup[] = ["HT", "MT", "LT"]

export const TIER_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const

export const ALL_TIERS: string[] = Object.keys(TIER_SCORE)

export function getTierScore(tier: string): number {
  return TIER_SCORE[tier] ?? 30
}

export function getTierColor(tier: string): string {
  const prefix = tier.slice(0, 1)
  switch (prefix) {
    case "H": return "text-red-400"
    case "M": return "text-blue-400"
    case "L": return "text-yellow-400"
    default: return "text-gray-400"
  }
}

export function calculateOverallAndPoints(gamemodes: { tier: string }[]): { overall: number; points: number } {
  const scores = gamemodes.map((g) => getTierScore(g.tier))
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length
  const points = Math.max(0, Math.round(10000 - avg * 300))
  return { overall: 0, points }
}

export function rankPlayers(
  players: { id: string; gamemodes: { tier: string }[] }[]
): Map<string, { overall: number; points: number }> {
  const withAvg = players.map((p) => {
    const scores = p.gamemodes.map((g) => getTierScore(g.tier))
    const avg = scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : 999
    return { id: p.id, avg, points: Math.max(0, Math.round(10000 - avg * 300)) }
  })
  withAvg.sort((a, b) => a.avg - b.avg)
  const result = new Map<string, { overall: number; points: number }>()
  withAvg.forEach((p, i) => {
    result.set(p.id, { overall: i + 1, points: p.points })
  })
  return result
}