import { NextResponse } from "next/server"
import { createHash } from "crypto"
import { decodeSessionToken } from "@/lib/auth"
import { getSupabase, getAdminClient } from "@/lib/supabase"

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  const session = decodeSessionToken(authHeader?.replace("Bearer ", "") ?? "")
  if (!session || session.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const sb = getSupabase()
  const { data, error } = await sb
    .from("staff_accounts")
    .select("id, username, role, created_at")
    .order("created_at", { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization")
  const session = decodeSessionToken(authHeader?.replace("Bearer ", "") ?? "")
  if (!session || session.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { username, password } = await request.json()

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password required" }, { status: 400 })
  }

  const client = getAdminClient()
  const hash = createHash("sha256").update(password).digest("hex")

  const { data, error } = await client
    .from("staff_accounts")
    .insert({
      username: username.toLowerCase(),
      password_hash: hash,
      role: "staff",
    })
    .select("id, username, role, created_at")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request: Request) {
  const authHeader = request.headers.get("authorization")
  const session = decodeSessionToken(authHeader?.replace("Bearer ", "") ?? "")
  if (!session || session.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await request.json()
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 })
  }

  const client = getAdminClient()
  const { error } = await client.from("staff_accounts").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}