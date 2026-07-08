"use client"

import { useState } from "react"

export default function ServerInfo() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText("play.minetiers.com")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-fit flex gap-2 items-center animate-slideUp">
      <div className="size-12 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden">
        <svg width="30" height="30" viewBox="0 0 1080 1080" fill="currentColor" className="text-accent">
          <path d="M667.91 1000.52 549.18 558.88M536.97 546.67 91.62 424.23M549.18 546.67l329.67-333.38" className="stroke-current" fill="none" strokeWidth="112.67" strokeMiterlimit="10" />
          <path d="m711.29 957.14 245.97-245.97c26.84-26.84 37.32-65.96 27.5-102.63l-90.03-336c-9.82-36.67-38.46-65.3-75.13-75.13l-336-90.03c-36.67-9.82-75.79.66-102.63 27.5L135 380.85c-26.84 26.84-37.32 65.96-27.5 102.63l90.03 336c9.82 36.67 38.46 65.3 75.13 75.13l336 90.03c36.66 9.83 75.79-.65 102.63-27.5z" fill="none" stroke="currentColor" strokeWidth="112.67" strokeMiterlimit="10" />
          <path d="M805.48 629.12v-171c0-39.75-21.21-76.48-55.63-96.35l-148.09-85.5c-34.42-19.87-76.84-19.87-111.26 0l-148.09 85.5c-34.42 19.87-55.63 56.6-55.63 96.35v171c0 39.75 21.21 76.48 55.63 96.35l148.09 85.5c34.42 19.87 76.84 19.87 111.26 0l148.09-85.5c34.42-19.87 55.63-56.6 55.63-96.35" fill="#c889e6" />
        </svg>
      </div>
      <div>
        <h2 className="text-muted-foreground text-xs uppercase font-bold">Server IP</h2>
        <div className="flex items-center gap-1">
          <span className="group text-xs bg-secondary text-secondary-foreground font-semibold rounded-md py-1 px-1.5 flex gap-2 items-center justify-between cursor-default">
            play.minetiers.com
            <button
              onClick={copyToClipboard}
              className="opacity-20 group-hover:opacity-100 duration-200"
              title="Copy"
            >
              {copied ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                </svg>
              )}
            </button>
          </span>
          <a
            href="https://discord.gg/mcpvp"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-600/90 size-fit text-sm rounded-md flex p-1 text-blue-200 transition-colors"
          >
            <img src="/nav_icons/discord.svg" alt="Discord" width={16} height={16} className="opacity-80" />
          </a>
        </div>
      </div>
    </div>
  )
}