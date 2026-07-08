export type Gamemode =
  | "overall"
  | "vanilla"
  | "uhc"
  | "pot"
  | "nethop"
  | "smp"
  | "sword"
  | "axe"
  | "mace"
  | "ltm"

export interface PlayerTier {
  id?: string
  player_id?: string
  gamemode: Gamemode
  tier: string
}

export interface Player {
  id: string
  name: string
  uuid?: string
  region: string
  avatar: string
  overall: number
  points?: number
  gamemodes: PlayerTier[]
  desc?: string
  created_at?: string
}

export type PlayerRole = "owner" | "staff"

export interface StaffAccount {
  id: string
  username: string
  password_hash: string
  role: PlayerRole
  created_at: string
}

export interface GamemodeInfo {
  key: Gamemode
  label: string
}

export interface DbPlayer {
  id: string
  name: string
  uuid: string
  region: string
  avatar: string
  desc: string | null
  created_at: string
}

export interface DbPlayerTier {
  id: string
  player_id: string
  gamemode: string
  tier: string
  created_at: string
}
