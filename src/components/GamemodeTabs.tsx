import Link from "next/link"
import { GAMEMODES } from "@/lib/data"
import type { Gamemode } from "@/types"

interface GamemodeTabsProps {
  active: Gamemode
}

export default function GamemodeTabs({ active }: GamemodeTabsProps) {
  const iconMap: Record<string, string> = {
    overall: "/tier_icons/overall.svg",
    vanilla: "/tier_icons/vanilla.svg",
    uhc: "/tier_icons/uhc.svg",
    pot: "/tier_icons/pot.svg",
    nethop: "/tier_icons/nethop.svg",
    smp: "/tier_icons/smp.svg",
    sword: "/tier_icons/sword.svg",
    axe: "/tier_icons/axe.svg",
    mace: "/tier_icons/mace.svg",
    ltm: "/tier_icons/2v2.svg",
  }

  return (
    <section className="w-full flex gap-1 absolute top-auto bottom-full left-0 overflow-x-auto overflow-y-hidden">
      {GAMEMODES.map((mode) => {
        const isActive = mode.key === active
        return (
          <Link
            key={mode.key}
            href={`/rankings/${mode.key}`}
            style={{ transform: "translateY(50px)" }}
            className={`w-28 h-fit duration-100 text-nowrap relative flex flex-col items-center justify-end rounded-t-3xl border-2 border-b-none border-border px-8 pt-1 transition-all ${
              isActive
                ? "bg-accent/50 text-foreground"
                : "text-muted-foreground/40 hover:bg-accent/50 hover:text-accent-foreground active:bg-accent/20"
            }`}
          >
            <img src={iconMap[mode.key]} alt="" width={30} height={30} className="opacity-80" />
            <strong className="capitalize text-sm">{mode.label}</strong>
            {isActive && (
              <span className="w-full h-0.5 bg-white block absolute bottom-0 left-0" />
            )}
          </Link>
        )
      })}
    </section>
  )
}