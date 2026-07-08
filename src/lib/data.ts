import type { Player, GamemodeInfo } from "@/types"

export const GAMEMODES: GamemodeInfo[] = [
  { key: "overall", label: "Overall" },
  { key: "vanilla", label: "Vanilla" },
  { key: "uhc", label: "UHC" },
  { key: "pot", label: "Pot" },
  { key: "nethop", label: "NethOP" },
  { key: "smp", label: "SMP" },
  { key: "sword", label: "Sword" },
  { key: "axe", label: "Axe" },
  { key: "mace", label: "Mace" },
  { key: "ltm", label: "LTMs" },
]

export const players: Player[] = [
  {
    id: "1",
    name: "Aim4Flicker",
    region: "EU",
    tiers: {
      overall: 1, vanilla: 1, uhc: 2, pot: 1, nethop: 1,
      smp: 3, sword: 1, axe: 2, mace: 1, ltm: 1,
    },
  },
  {
    id: "2",
    name: "Dream",
    region: "NA",
    tiers: {
      overall: 2, vanilla: 3, uhc: 1, pot: 4, nethop: 5,
      smp: 1, sword: 2, axe: 1, mace: 3, ltm: 2,
    },
  },
  {
    id: "3",
    name: "Technoblade",
    region: "NA",
    tiers: {
      overall: 3, vanilla: 2, uhc: 3, pot: 2, nethop: 3,
      smp: 2, sword: 3, axe: 3, mace: 2, ltm: 3,
    },
  },
  {
    id: "4",
    name: "Fruitberries",
    region: "NA",
    tiers: {
      overall: 4, vanilla: 4, uhc: 4, pot: 3, nethop: 2,
      smp: 4, sword: 4, axe: 4, mace: 4, ltm: 4,
    },
  },
  {
    id: "5",
    name: "Clowmii",
    region: "EU",
    tiers: {
      overall: 5, vanilla: 5, uhc: 5, pot: 5, nethop: 4,
      smp: 5, sword: 5, axe: 5, mace: 5, ltm: 5,
    },
  },
  {
    id: "6",
    name: "xSapnap",
    region: "NA",
    tiers: {
      overall: 6, vanilla: 6, uhc: 6, pot: 6, nethop: 6,
      smp: 6, sword: 6, axe: 6, mace: 6, ltm: 6,
    },
  },
  {
    id: "7",
    name: "Purpled",
    region: "NA",
    tiers: {
      overall: 7, vanilla: 7, uhc: 7, pot: 7, nethop: 7,
      smp: 7, sword: 7, axe: 7, mace: 7, ltm: 7,
    },
  },
  {
    id: "8",
    name: "Illumina",
    region: "OCE",
    tiers: {
      overall: 8, vanilla: 8, uhc: 8, pot: 8, nethop: 8,
      smp: 8, sword: 8, axe: 8, mace: 8, ltm: 8,
    },
  },
  {
    id: "9",
    name: "PeteZahHutt",
    region: "NA",
    tiers: {
      overall: 9, vanilla: 9, uhc: 9, pot: 9, nethop: 9,
      smp: 9, sword: 9, axe: 9, mace: 9, ltm: 9,
    },
  },
  {
    id: "10",
    name: "TapL",
    region: "NA",
    tiers: {
      overall: 10, vanilla: 10, uhc: 10, pot: 10, nethop: 10,
      smp: 10, sword: 10, axe: 10, mace: 10, ltm: 10,
    },
  },
  {
    id: "11",
    name: "Bitzel",
    region: "EU",
    tiers: {
      overall: 11, vanilla: 11, uhc: 11, pot: 11, nethop: 11,
      smp: 11, sword: 11, axe: 11, mace: 11, ltm: 11,
    },
  },
  {
    id: "12",
    name: "Vikkstar123",
    region: "EU",
    tiers: {
      overall: 12, vanilla: 12, uhc: 12, pot: 12, nethop: 12,
      smp: 12, sword: 12, axe: 12, mace: 12, ltm: 12,
    },
  },
]
