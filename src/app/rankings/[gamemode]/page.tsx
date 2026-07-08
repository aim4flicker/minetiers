import { notFound, redirect } from "next/navigation"
import { GAMEMODES } from "@/lib/data"
import type { Gamemode } from "@/types"
import GamemodeTabs from "@/components/GamemodeTabs"
import RankingsTable from "@/components/RankingsTable"

interface Props {
  params: Promise<{ gamemode: string }>
}

export async function generateStaticParams() {
  return GAMEMODES.map((m) => ({ gamemode: m.key }))
}

export default async function RankingsPage({ params }: Props) {
  const { gamemode } = await params

  const isValid = GAMEMODES.some((m) => m.key === gamemode)
  if (!isValid) {
    redirect("/rankings/overall")
  }

  return (
    <main className="w-full max-w-[1352px] mx-auto min-h-screen px-4">
      <div className="w-full rounded-xl bg-card border border-border mt-8 rounded-tl-none p-6 pt-3 relative">
        <GamemodeTabs active={gamemode as Gamemode} />

        <div className="flex items-center gap-3 justify-end mb-4 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-accent">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-muted-foreground">Server IP</p>
              <div className="flex items-center gap-1">
                <span className="text-xs bg-secondary text-secondary-foreground font-semibold rounded-md px-2 py-1">
                  play.minetiers.com
                </span>
              </div>
            </div>
          </div>
        </div>

        <RankingsTable gamemode={gamemode as Gamemode} />
      </div>
    </main>
  )
}
