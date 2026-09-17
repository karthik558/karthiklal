"use client"

import { useSyncExternalStore } from "react"
import { Volume2, Volume1, VolumeX, Tv } from "lucide-react"
import {
  getSoundProfile,
  setSoundProfile,
  cycleSoundProfile,
  playProfileActivationCue,
  subscribeSoundProfileChange,
  SOUND_PROFILES,
  type SoundProfileId,
} from "@/lib/sound-fx"

const subscribeToClient = () => () => undefined

export function SoundToggle() {
  const mounted = useSyncExternalStore(subscribeToClient, () => true, () => false)
  const profile = useSyncExternalStore(subscribeSoundProfileChange, getSoundProfile, () => "muted" as SoundProfileId)

  if (!mounted) {
    return <div className="w-9 h-9 border-2 border-border bg-card" aria-hidden="true" />
  }

  const handleDoubleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (profile !== "muted") {
      setSoundProfile("muted")
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Alt+Click to instantly mute
    if (event.altKey) {
      event.preventDefault()
      setSoundProfile("muted")
      return
    }

    const next = cycleSoundProfile()

    if (next !== "muted") {
      setTimeout(() => playProfileActivationCue(next), 40)
    }
  }

  const renderIcon = () => {
    switch (profile) {
      case "cyber":
        return <Volume2 className="h-4 w-4" />
      case "clean":
        return <Volume1 className="h-4 w-4" />
      case "retro":
        return <Tv className="h-4 w-4" />
      case "muted":
      default:
        return <VolumeX className="h-4 w-4" />
    }
  }

  const getThemeClasses = () => {
    switch (profile) {
      case "cyber":
        return "border-emerald-500/80 bg-card text-emerald-400 hover:border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.18)]"
      case "clean":
        return "border-foreground bg-foreground text-background shadow-sm hover:opacity-90"
      case "retro":
        return "border-amber-500/80 bg-card text-amber-400 hover:border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.18)]"
      case "muted":
      default:
        return "border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground"
    }
  }

  const activeMeta = SOUND_PROFILES[profile]

  return (
    <button
      type="button"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      data-sound-profile={profile}
      data-testid="sound-toggle-btn"
      className={`relative flex h-9 w-9 items-center justify-center border-2 transition-all duration-200 ${getThemeClasses()}`}
      title={`Sound FX: ${activeMeta.label} (Click to cycle, Alt+Click to mute)`}
      aria-label={`Sound effects profile: ${activeMeta.label}. Click to cycle.`}
    >
      {renderIcon()}
    </button>
  )
}
