import { NextResponse } from "next/server"
import { verifyPin, createSessionToken } from "@/lib/auth"

export async function POST(request: Request) {
  const { pin } = await request.json()

  if (!pin || !verifyPin(pin)) {
    return NextResponse.json({ error: "Invalid PIN" }, { status: 401 })
  }

  const token = createSessionToken("owner", "owner")

  return NextResponse.json({ token, role: "owner" })
}