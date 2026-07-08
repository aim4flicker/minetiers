import { redirect } from "next/navigation"
import { GAMEMODES, getPlayers } from "@/lib/data"
import type { Gamemode } from "@/types"
import GamemodeTabs from "@/components/GamemodeTabs"
import RankingsTable from "@/components/RankingsTable"
import ServerInfo from "@/components/ServerInfo"

interface Props {
  params: Promise<{ gamemode: string }>
}

export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  return GAMEMODES.map((m) => ({ gamemode: m.key }))
}

export default async function RankingsPage({ params }: Props) {
  const { gamemode } = await params

  const isValid = GAMEMODES.some((m) => m.key === gamemode)
  if (!isValid) {
    redirect("/rankings/overall")
  }

  const players = await getPlayers()

  return (
    <main className="w-full max-w-[1352px] min-h-screen mx-auto px-4">
      <div className="w-full h-fit rounded-xl bg-card border-2 border-border mt-28 rounded-tl-none p-8 pt-2 relative">
        <GamemodeTabs active={gamemode as Gamemode} />

        <div className="flex items-center gap-4 justify-end mb-4">
          <button className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm font-medium rounded-md h-9 px-3 py-2 transition-colors">
            <svg width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
            </svg>
            Information
          </button>

          <ServerInfo />
        </div>

        <RankingsTable gamemode={gamemode as Gamemode} initialPlayers={players} />
      </div>
    </main>
  )
}
