"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<"pin" | "staff">("pin")
  const [pin, setPin] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handlePinLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/admin/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Invalid PIN")
        return
      }

      const data = await res.json()
      localStorage.setItem("admin_token", data.token)
      localStorage.setItem("admin_role", data.role)
      router.push("/admin")
    } catch {
      setError("Connection error")
    } finally {
      setLoading(false)
    }
  }

  async function handleStaffLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/admin/staff-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Invalid credentials")
        return
      }

      const data = await res.json()
      localStorage.setItem("admin_token", data.token)
      localStorage.setItem("admin_role", data.role)
      localStorage.setItem("admin_username", data.username)
      router.push("/admin")
    } catch {
      setError("Connection error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="w-full max-w-md mx-auto min-h-screen flex items-center justify-center px-4">
      <div className="w-full h-fit rounded-xl bg-card border-2 border-border p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {mode === "pin" ? "Enter owner PIN" : "Staff login"}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("pin")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "pin"
                ? "bg-accent text-accent-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            Owner PIN
          </button>
          <button
            onClick={() => setMode("staff")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "staff"
                ? "bg-accent text-accent-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            Staff
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 mb-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {mode === "pin" ? (
          <form onSubmit={handlePinLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">PIN</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter admin PIN"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-accent-foreground font-medium py-2.5 rounded-lg hover:bg-accent/80 transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleStaffLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Staff username"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Staff password"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-accent-foreground font-medium py-2.5 rounded-lg hover:bg-accent/80 transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Login"}
            </button>
          </form>
        )}

        <div className="mt-4 text-center">
          <a href="/rankings/overall" className="text-sm text-muted-foreground hover:text-accent transition-colors">
            &larr; Back to rankings
          </a>
        </div>
      </div>
    </main>
  )
}