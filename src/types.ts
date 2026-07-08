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

export interface Player {
  id: string
  name: string
  region: "NA" | "EU" | "ASIA" | "OCE" | "SA"
  tiers: Record<Gamemode, number>
}

export interface GamemodeInfo {
  key: Gamemode
  label: string
}
