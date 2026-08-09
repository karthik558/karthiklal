"use client"

import { useEffect, useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { isSoundEnabled, setSoundEnabled, playSuccessSound } from "@/lib/sound-fx"

export function SoundToggle() {
  const [enabled, setEnabled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setEnabled(isSoundEnabled())
  }, [])

  if (!mounted) {
    return <div className="w-9 h-9 border-2 border-border bg-card" />
  }

  const toggleSound = () => {
    const next = !enabled
    setEnabled(next)
    setSoundEnabled(next)
    if (next) {
      setTimeout(() => playSuccessSound(), 50)
    }
  }

  return (
    <button
      type="button"
      onClick={toggleSound}
      className={`relative flex h-9 w-9 items-center justify-center border-2 transition-colors ${
        enabled
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground"
      }`}
      title={enabled ? "Mute UI Sound FX" : "Enable Cyber UI Sound FX"}
      aria-label={enabled ? "Mute sound effects" : "Enable sound effects"}
    >
      {enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
    </button>
  )
}
