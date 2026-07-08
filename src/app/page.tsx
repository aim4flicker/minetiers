import Link from "next/link"

export default function Home() {
  return (
    <main className="w-full max-w-[1352px] mx-auto min-h-screen px-4">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-accent">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Minetiers
        </h1>
        <p className="text-muted-foreground text-lg max-w-md">
          View Minecraft&apos;s best combat players rankings across multiple gamemodes.
        </p>
        <div className="flex gap-4">
          <Link
            href="/rankings/overall"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-full hover:bg-accent/90 transition-colors"
          >
            View Rankings
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  )
}
