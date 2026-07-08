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
}

export interface GamemodeInfo {
  key: Gamemode
  label: string
}
