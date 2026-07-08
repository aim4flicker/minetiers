"use client"

import { useEffect, useState } from "react"

interface StaffMember {
  id: string
  username: string
  role: string
  created_at: string
}

export default function StaffManager() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [showForm, setShowForm] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [saving, setSaving] = useState(false)
  const [notif, setNotif] = useState<{ type: "success" | "error"; message: string } | null>(null)

  useEffect(() => {
    loadStaff()
  }, [])

  async function loadStaff() {
    const token = localStorage.getItem("admin_token")
    try {
      const res = await fetch("/api/admin/staff", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setStaff(await res.json())
      }
    } catch {
      showNotif("error", "Failed to load staff")
    }
  }

  function showNotif(type: "success" | "error", message: string) {
    setNotif({ type, message })
    setTimeout(() => setNotif(null), 4000)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!username || !password) return

    setSaving(true)
    const token = localStorage.getItem("admin_token")

    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, password }),
      })

      if (res.ok) {
        showNotif("success", "Staff account created")
        setUsername("")
        setPassword("")
        setShowForm(false)
        await loadStaff()
      } else {
        const data = await res.json()
        showNotif("error", data.error || "Failed to create staff")
      }
    } catch {
      showNotif("error", "Connection error")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string, username: string) {
    if (!confirm(`Delete staff account "${username}"?`)) return

    const token = localStorage.getItem("admin_token")
    try {
      const res = await fetch("/api/admin/staff", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      })

      if (res.ok) {
        showNotif("success", `Staff "${username}" deleted`)
        await loadStaff()
      } else {
        showNotif("error", "Failed to delete staff")
      }
    } catch {
      showNotif("error", "Connection error")
    }
  }

  return (
    <div>
      {notif && (
        <div className={`fixed top-6 right-6 z-[9999] transition-all duration-500 ${
          notif ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}>
          <div className={`p-4 rounded-2xl shadow-2xl border-2 min-w-[280px] max-w-[400px] ${
            notif.type === "error"
              ? "bg-gradient-to-br from-red-500 to-red-700 border-red-400 text-white"
              : "bg-gradient-to-br from-green-500 to-green-700 border-green-400 text-white"
          }`}>
            <div className="flex items-center gap-3">
              <p className="font-bold">{notif.type === "error" ? "Error" : "Success"}</p>
              <p className="text-sm opacity-90">{notif.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Staff Accounts ({staff.length})</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-accent text-accent-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent/80 transition-colors"
        >
          + Add Staff
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-secondary/20 rounded-xl border border-border p-6 mb-6 space-y-4">
          <h3 className="font-semibold">New Staff Account</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
                required
                minLength={4}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-secondary text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-accent text-accent-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent/80 transition-colors disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Staff"}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {staff.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No staff accounts yet</div>
        ) : (
          staff.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between bg-secondary/30 rounded-lg px-4 py-3 border border-border"
            >
              <div>
                <p className="font-medium">{s.username}</p>
                <p className="text-xs text-muted-foreground">
                  {s.role} &middot; Created {new Date(s.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(s.id, s.username)}
                className="text-xs bg-destructive/10 text-destructive hover:bg-destructive/20 px-3 py-1.5 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}