"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import PlayerManager from "./PlayerManager"
import StaffManager from "./StaffManager"

export default function AdminDashboard() {
  const router = useRouter()
  const [role, setRole] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [tab, setTab] = useState<"players" | "staff">("players")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    const savedRole = localStorage.getItem("admin_role")
    const savedUsername = localStorage.getItem("admin_username")

    if (!token || !savedRole) {
      router.push("/admin/login")
      return
    }

    setRole(savedRole)
    setUsername(savedUsername)
    setLoading(false)
  }, [router])

  function handleLogout() {
    localStorage.removeItem("admin_token")
    localStorage.removeItem("admin_role")
    localStorage.removeItem("admin_username")
    router.push("/admin/login")
  }

  if (loading) {
    return (
      <main className="w-full max-w-6xl mx-auto min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </main>
    )
  }

  return (
    <main className="w-full max-w-6xl mx-auto min-h-screen px-4 py-8">
      <div className="w-full h-fit rounded-xl bg-card border-2 border-border p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Logged in as <span className="text-accent font-medium">{username || "Owner"}</span>
              {" "}({role === "owner" ? "Owner" : "Staff"})
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-destructive/10 text-destructive border border-destructive/30 px-4 py-2 rounded-lg text-sm font-medium hover:bg-destructive/20 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border pb-2">
          <button
            onClick={() => setTab("players")}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
              tab === "players"
                ? "bg-accent/10 text-accent border-b-2 border-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Manage Players
          </button>
          {role === "owner" && (
            <button
              onClick={() => setTab("staff")}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                tab === "staff"
                  ? "bg-accent/10 text-accent border-b-2 border-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Manage Staff
            </button>
          )}
        </div>

        {tab === "players" && <PlayerManager />}
        {tab === "staff" && role === "owner" && <StaffManager />}
      </div>
    </main>
  )
}