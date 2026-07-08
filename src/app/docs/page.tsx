import Link from "next/link"

export default function DocsPage() {
  return (
    <main className="w-full max-w-[1352px] mx-auto min-h-screen px-4">
      <div className="w-full rounded-xl bg-card border border-border mt-8 p-8">
        <h1 className="text-3xl font-bold mb-6">API Documentation</h1>
        <p className="text-muted-foreground mb-8">
          Minetiers provides a public API to access player ranking data programmatically.
        </p>

        <section className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-3">Base URL</h2>
            <pre className="bg-secondary/50 rounded-lg p-4 text-sm overflow-x-auto">
              <code className="text-accent">https://minetiers.vercel.app/api</code>
            </pre>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Endpoints</h2>

            <div className="space-y-4">
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-green-500/20 text-green-400">GET</span>
                  <code className="text-sm font-mono">/api/players</code>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Returns all players with their rankings across all gamemodes.
                </p>
                <pre className="bg-secondary/50 rounded-lg p-3 text-xs overflow-x-auto">
                  <code>{`{
  "players": [
    {
      "id": "1",
      "name": "Aim4Flicker",
      "region": "EU",
      "tiers": {
        "overall": 1,
        "vanilla": 1,
        "uhc": 2,
        "pot": 1,
        "nethop": 1,
        "smp": 3,
        "sword": 1,
        "axe": 2,
        "mace": 1,
        "ltm": 1
      }
    }
  ]
}`}</code>
                </pre>
              </div>

              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-green-500/20 text-green-400">GET</span>
                  <code className="text-sm font-mono">/api/players/:id</code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Returns a single player by ID.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Rankings Page</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Browse live rankings for each gamemode:
            </p>
            <ul className="space-y-1 text-sm">
              {["overall", "vanilla", "uhc", "pot", "nethop", "smp", "sword", "axe", "mace", "ltm"].map((mode) => (
                <li key={mode}>
                  <Link
                    href={`/rankings/${mode}`}
                    className="text-accent hover:underline"
                  >
                    /rankings/{mode}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  )
}
