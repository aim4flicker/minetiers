import { NextResponse } from "next/server"
import { createHash } from "crypto"
import { createSessionToken } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  const { username, password } = await request.json()

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password required" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("staff_accounts")
    .select("*")
    .eq("username", username.toLowerCase())
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const hash = createHash("sha256").update(password).digest("hex")
  if (hash !== data.password_hash) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const token = createSessionToken(data.role, data.username)

  return NextResponse.json({ token, role: data.role, username: data.username })
}