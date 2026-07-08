import { createHash } from "crypto"

const ADMIN_PIN_HASH = createHash("sha256").update("minetiers@2024").digest("hex")

export function verifyPin(pin: string): boolean {
  const hash = createHash("sha256").update(pin).digest("hex")
  return hash === ADMIN_PIN_HASH
}

export function createSessionToken(role: "owner" | "staff", username: string): string {
  const payload = `${role}:${username}:${Date.now()}`
  const hash = createHash("sha256").update(payload + ADMIN_PIN_HASH).digest("hex")
  return Buffer.from(`${payload}:${hash}`).toString("base64")
}

export function decodeSessionToken(token: string): { role: string; username: string } | null {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8")
    const parts = decoded.split(":")
    if (parts.length < 4) return null
    const role = parts[0]
    const username = parts[1]
    const timestamp = parts[2]
    const hash = parts[3]
    const expected = createHash("sha256").update(`${role}:${username}:${timestamp}${ADMIN_PIN_HASH}`).digest("hex")
    if (hash !== expected) return null
    const age = Date.now() - parseInt(timestamp)
    if (age > 24 * 60 * 60 * 1000) return null
    return { role, username }
  } catch {
    return null
  }
}