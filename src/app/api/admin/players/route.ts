import { NextResponse } from "next/server"
import { decodeSessionToken } from "@/lib/auth"
import { getSupabase, getAdminClient } from "@/lib/supabase"
import { rankPlayers } from "@/lib/tiers"

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !decodeSessionToken(authHeader.replace("Bearer ", ""))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const sb = getSupabase()
  const { data: players, error } = await sb
    .from("players")
    .select("*")
    .order("created_at", { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: tiers } = await sb
    .from("player_tiers")
    .select("*")

  const tierMap = new Map<string, { gamemode: string; tier: string }[]>()
  for (const t of tiers ?? []) {
    if (!tierMap.has(t.player_id)) tierMap.set(t.player_id, [])
    tierMap.get(t.player_id)!.push({ gamemode: t.gamemode, tier: t.tier })
  }

  const result = players.map((p) => ({
    id: p.id,
    name: p.name,
    uuid: p.uuid,
    region: p.region,
    avatar: p.avatar,
    desc: p.desc,
    created_at: p.created_at,
    gamemodes: tierMap.get(p.id) ?? [],
  }))

  return NextResponse.json(result)
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !decodeSessionToken(authHeader.replace("Bearer ", ""))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { name, uuid, region, avatar, desc, gamemodes } = body

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 })
  }

  const client = getAdminClient()
  const { data: player, error: playerError } = await client
    .from("players")
    .insert({
      name,
      uuid: uuid || name.toLowerCase(),
      region: region || "NA",
      avatar: avatar || `https://render.crafty.gg/3d/bust/${name}`,
      desc: desc || null,
    })
    .select()
    .single()

  if (playerError) {
    return NextResponse.json({ error: playerError.message }, { status: 500 })
  }

  if (gamemodes && Array.isArray(gamemodes)) {
    const tiers = gamemodes.map((g: { gamemode: string; tier: string }) => ({
      player_id: player.id,
      gamemode: g.gamemode,
      tier: g.tier,
    }))

    const { error: tiersError } = await client
      .from("player_tiers")
      .insert(tiers)

    if (tiersError) {
      return NextResponse.json({ error: tiersError.message }, { status: 500 })
    }
  }

  const allPlayers = await fetchAllPlayers(client)
  const rankings = rankPlayers(allPlayers)

  const sb = getSupabase()
  for (const p of allPlayers) {
    const r = rankings.get(p.id)
    if (r) {
      await sb.from("players").update({
        overall: r.overall,
        points: r.points,
      }).eq("id", p.id)
    }
  }

  return NextResponse.json({ success: true, player })
}

export async function PUT(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !decodeSessionToken(authHeader.replace("Bearer ", ""))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { id, name, uuid, region, avatar, desc, gamemodes } = body

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 })
  }

  const client = getAdminClient()
  const updates: Record<string, unknown> = {}
  if (name !== undefined) updates.name = name
  if (uuid !== undefined) updates.uuid = uuid
  if (region !== undefined) updates.region = region
  if (avatar !== undefined) updates.avatar = avatar
  if (desc !== undefined) updates.desc = desc

  if (Object.keys(updates).length > 0) {
    const { error } = await client.from("players").update(updates).eq("id", id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (gamemodes && Array.isArray(gamemodes)) {
    await client.from("player_tiers").delete().eq("player_id", id)

    const tiers = gamemodes.map((g: { gamemode: string; tier: string }) => ({
      player_id: id,
      gamemode: g.gamemode,
      tier: g.tier,
    }))
    const { error: tiersError } = await client.from("player_tiers").insert(tiers)
    if (tiersError) return NextResponse.json({ error: tiersError.message }, { status: 500 })
  }

  const allPlayers = await fetchAllPlayers(client)
  const rankings = rankPlayers(allPlayers)

  const sb = getSupabase()
  for (const p of allPlayers) {
    const r = rankings.get(p.id)
    if (r) {
      await sb.from("players").update({
        overall: r.overall,
        points: r.points,
      }).eq("id", p.id)
    }
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !decodeSessionToken(authHeader.replace("Bearer ", ""))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await request.json()

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 })
  }

  const client = getAdminClient()

  await client.from("player_tiers").delete().eq("player_id", id)
  const { error } = await client.from("players").delete().eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const allPlayers = await fetchAllPlayers(client)
  const rankings = rankPlayers(allPlayers)

  const sb = getSupabase()
  for (const p of allPlayers) {
    const r = rankings.get(p.id)
    if (r) {
      await sb.from("players").update({
        overall: r.overall,
        points: r.points,
      }).eq("id", p.id)
    }
  }

  return NextResponse.json({ success: true })
}

async function fetchAllPlayers(client: ReturnType<typeof getAdminClient>) {
  const { data: players } = await client
    .from("players")
    .select("*")

  const { data: tiers } = await client
    .from("player_tiers")
    .select("*")

  const tierMap = new Map<string, { gamemode: string; tier: string }[]>()
  for (const t of tiers ?? []) {
    if (!tierMap.has(t.player_id)) tierMap.set(t.player_id, [])
    tierMap.get(t.player_id)!.push({ gamemode: t.gamemode, tier: t.tier })
  }

  return (players ?? []).map((p) => ({
    id: p.id,
    gamemodes: (tierMap.get(p.id) ?? []).map((t) => ({
      gamemode: t.gamemode,
      tier: t.tier,
    })),
  }))
}