import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null

export async function fetchPlayers() {
  const { data: players, error } = await supabase
    .from("players")
    .select("*")
    .order("created_at", { ascending: true })

  if (error) throw error
  return players ?? []
}

export async function fetchPlayerTiers() {
  const { data: tiers, error } = await supabase
    .from("player_tiers")
    .select("*")

  if (error) throw error
  return tiers ?? []
}

export async function getAllPlayersWithTiers() {
  const [players, tiers] = await Promise.all([fetchPlayers(), fetchPlayerTiers()])

  const tierMap = new Map<string, { gamemode: string; tier: string }[]>()
  for (const t of tiers) {
    if (!tierMap.has(t.player_id)) tierMap.set(t.player_id, [])
    tierMap.get(t.player_id)!.push({ gamemode: t.gamemode, tier: t.tier })
  }

  return players.map((p) => ({
    id: p.id,
    name: p.name,
    uuid: p.uuid,
    region: p.region,
    avatar: p.avatar,
    overall: 0,
    points: 0,
    desc: p.desc ?? undefined,
    gamemodes: (tierMap.get(p.id) ?? []).map((t) => ({
      gamemode: t.gamemode,
      tier: t.tier,
    })),
  }))
}