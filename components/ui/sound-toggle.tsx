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

import { cn } from "@/lib/utils"

interface SoundToggleProps {
  size?: "default" | "sm"
  className?: string
}

export function SoundToggle({ size = "default", className }: SoundToggleProps = {}) {
  const mounted = useSyncExternalStore(subscribeToClient, () => true, () => false)
  const profile = useSyncExternalStore(subscribeSoundProfileChange, getSoundProfile, () => "muted" as SoundProfileId)

  const isSm = size === "sm"

  if (!mounted) {
    return (
      <div
        className={cn(
          isSm ? "w-[26px] h-[26px] border border-border/80 bg-card/60" : "w-9 h-9 border-2 border-border bg-card",
          className
        )}
        aria-hidden="true"
      />
    )
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
    const iconClass = isSm ? "h-3.5 w-3.5" : "h-4 w-4"
    switch (profile) {
      case "cyber":
        return <Volume2 className={iconClass} />
      case "clean":
        return <Volume1 className={iconClass} />
      case "retro":
        return <Tv className={iconClass} />
      case "muted":
      default:
        return <VolumeX className={iconClass} />
    }
  }

  const getThemeClasses = () => {
    switch (profile) {
      case "cyber":
        return isSm
          ? "border-emerald-500/80 bg-card text-emerald-400 hover:border-emerald-400"
          : "border-emerald-500/80 bg-card text-emerald-400 hover:border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.18)]"
      case "clean":
        return isSm
          ? "border-foreground bg-foreground text-background shadow-xs hover:opacity-90"
          : "border-foreground bg-foreground text-background shadow-sm hover:opacity-90"
      case "retro":
        return isSm
          ? "border-amber-500/80 bg-card text-amber-400 hover:border-amber-400"
          : "border-amber-500/80 bg-card text-amber-400 hover:border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.18)]"
      case "muted":
      default:
        return isSm
          ? "border-border/80 bg-background/50 text-muted-foreground hover:border-foreground hover:text-foreground hover:bg-card"
          : "border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground"
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
      className={cn(
        "relative flex items-center justify-center transition-all duration-200 cursor-pointer select-none",
        isSm ? "h-[26px] w-[26px] border border-border/80 shadow-2xs" : "h-9 w-9 border-2",
        getThemeClasses(),
        className
      )}
      title={`Sound FX: ${activeMeta.label} (Click to cycle, Alt+Click to mute)`}
      aria-label={`Sound effects profile: ${activeMeta.label}. Click to cycle.`}
    >
      {renderIcon()}
    </button>
  )
}
