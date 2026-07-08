"use client"

import { useEffect, useState } from "react"
import { GAMEMODES } from "@/lib/data"
import { ALL_TIERS } from "@/lib/tiers"
import type { Gamemode } from "@/types"

interface PlayerForm {
  id?: string
  name: string
  uuid: string
  region: string
  avatar: string
  desc: string
  gamemodes: { gamemode: string; tier: string }[]
}

const defaultForm: PlayerForm = {
  name: "",
  uuid: "",
  region: "NA",
  avatar: "",
  desc: "",
  gamemodes: GAMEMODES.filter((m) => m.key !== "overall").map((m) => ({
    gamemode: m.key,
    tier: "MT1",
  })),
}

export default function PlayerManager() {
  const [players, setPlayers] = useState<PlayerForm[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<PlayerForm | null>(null)
  const [saving, setSaving] = useState(false)
  const [notif, setNotif] = useState<{ type: "success" | "error"; message: string } | null>(null)

  useEffect(() => {
    loadPlayers()
  }, [])

  async function loadPlayers() {
    const token = localStorage.getItem("admin_token")
    try {
      const res = await fetch("/api/admin/players", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setPlayers(data)
      }
    } catch {
      showNotif("error", "Failed to load players")
    }
  }

  function showNotif(type: "success" | "error", message: string) {
    setNotif({ type, message })
    setTimeout(() => setNotif(null), 4000)
  }

  function handleEdit(player: PlayerForm) {
    setEditing(player)
    setShowForm(true)
  }

  function handleAdd() {
    setEditing(null)
    setShowForm(true)
  }

  async function handleSave(form: PlayerForm) {
    setSaving(true)
    const token = localStorage.getItem("admin_token")

    try {
      const res = await fetch("/api/admin/players", {
        method: form.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          avatar: form.avatar || `https://render.crafty.gg/3d/bust/${form.name}`,
        }),
      })

      if (res.ok) {
        showNotif("success", form.id ? "Player updated" : "Player created")
        setShowForm(false)
        setEditing(null)
        await loadPlayers()
      } else {
        const data = await res.json()
        showNotif("error", data.error || "Failed to save player")
      }
    } catch {
      showNotif("error", "Connection error")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this player?")) return

    const token = localStorage.getItem("admin_token")
    try {
      const res = await fetch("/api/admin/players", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      })

      if (res.ok) {
        showNotif("success", "Player deleted")
        await loadPlayers()
      } else {
        showNotif("error", "Failed to delete player")
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
        <h2 className="text-lg font-semibold">Players ({players.length})</h2>
        <button
          onClick={handleAdd}
          className="bg-accent text-accent-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent/80 transition-colors"
        >
          + Add Player
        </button>
      </div>

      {showForm && (
        <PlayerFormComponent
          initial={editing ?? defaultForm}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null) }}
          saving={saving}
        />
      )}

      {/* Players list */}
      <div className="space-y-2">
        {players.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No players yet</div>
        ) : (
          players.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 bg-secondary/30 rounded-lg px-4 py-3 border border-border"
            >
              <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden shrink-0">
                <img
                  src={p.avatar || `https://render.crafty.gg/3d/bust/${p.name}`}
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {p.uuid} &middot; {p.region} &middot; {p.gamemodes?.length ?? 0} tiers
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(p)}
                  className="text-xs bg-secondary hover:bg-secondary/80 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => p.id && handleDelete(p.id)}
                  className="text-xs bg-destructive/10 text-destructive hover:bg-destructive/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function PlayerFormComponent({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: PlayerForm
  onSave: (form: PlayerForm) => Promise<void>
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState<PlayerForm>({
    ...initial,
    gamemodes: initial.gamemodes.length > 0
      ? initial.gamemodes
      : GAMEMODES.filter((m) => m.key !== "overall").map((m) => ({
          gamemode: m.key,
          tier: "MT1",
        })),
  })

  function updateField(field: keyof PlayerForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function updateTier(gamemode: string, tier: string) {
    setForm((prev) => ({
      ...prev,
      gamemodes: prev.gamemodes.map((g) =>
        g.gamemode === gamemode ? { ...g, tier } : g
      ),
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSave(form)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-secondary/20 rounded-xl border border-border p-6 mb-6 space-y-4">
      <h3 className="font-semibold">{form.id ? "Edit Player" : "Add Player"}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">UUID (optional)</label>
          <input
            type="text"
            value={form.uuid}
            onChange={(e) => updateField("uuid", e.target.value)}
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Region</label>
          <select
            value={form.region}
            onChange={(e) => updateField("region", e.target.value)}
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
          >
            <option value="NA">NA</option>
            <option value="EU">EU</option>
            <option value="OCE">OCE</option>
            <option value="AS">AS</option>
            <option value="SA">SA</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Avatar URL (optional)</label>
          <input
            type="text"
            value={form.avatar}
            onChange={(e) => updateField("avatar", e.target.value)}
            placeholder="https://render.crafty.gg/3d/bust/"
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1">Description (optional)</label>
        <textarea
          value={form.desc}
          onChange={(e) => updateField("desc", e.target.value)}
          rows={2}
          className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent resize-none"
        />
      </div>

      {/* Tiers */}
      <div>
        <label className="block text-sm text-muted-foreground mb-2">Tiers</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {GAMEMODES.filter((m) => m.key !== "overall").map((mode) => {
            const current = form.gamemodes.find((g) => g.gamemode === mode.key)
            return (
              <div key={mode.key} className="bg-secondary/50 rounded-lg px-3 py-2 border border-border">
                <label className="text-xs text-muted-foreground block mb-1">{mode.label}</label>
                <select
                  value={current?.tier ?? "MT1"}
                  onChange={(e) => updateTier(mode.key, e.target.value)}
                  className="w-full bg-background border border-border rounded px-2 py-1 text-xs text-foreground focus:outline-none focus:border-accent"
                >
                  {ALL_TIERS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="bg-secondary text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="bg-accent text-accent-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent/80 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Player"}
        </button>
      </div>
    </form>
  )
}