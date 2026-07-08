import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let _supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) throw new Error("Supabase env vars not configured")
    _supabase = createClient(url, key)
  }
  return _supabase
}

let _admin: SupabaseClient | null = null
let _adminFallback: SupabaseClient | null = null

export function getAdminClient(): SupabaseClient {
  if (!_admin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (url && key) {
      _admin = createClient(url, key, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    } else {
      _admin = getSupabase()
    }
  }
  return _admin
}

export async function fetchPlayers() {
  const { data: players, error } = await getSupabase()
    .from("players")
    .select("*")
    .order("created_at", { ascending: true })

  if (error) throw error
  return players ?? []
}

export async function fetchPlayerTiers() {
  const { data: tiers, error } = await getSupabase()
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