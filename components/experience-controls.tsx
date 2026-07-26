"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Accessibility, Gauge, MousePointer2, SlidersHorizontal, X } from "lucide-react"

type Preferences = {
  reducedMotion: boolean
  lowBandwidth: boolean
  highContrast: boolean
  customCursor: boolean
  calmAnimations: boolean
}

const STORAGE_KEY = "portfolio-experience-preferences"
const defaultPreferences: Preferences = {
  reducedMotion: false,
  lowBandwidth: false,
  highContrast: false,
  customCursor: true,
  calmAnimations: false,
}

function applyPreferences(preferences: Preferences) {
  const root = document.documentElement
  root.dataset.motion = preferences.reducedMotion ? "reduced" : "full"
  root.dataset.bandwidth = preferences.lowBandwidth ? "low" : "full"
  root.dataset.contrast = preferences.highContrast ? "high" : "standard"
  root.dataset.cursor = preferences.customCursor ? "custom" : "native"
  root.dataset.animationIntensity = preferences.calmAnimations ? "calm" : "full"
  window.dispatchEvent(new CustomEvent("portfolio-preferences", { detail: preferences }))
}

export default function ExperienceControls() {
  const [open, setOpen] = useState(false)
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences)

  useEffect(() => {
    let next = defaultPreferences
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) next = { ...defaultPreferences, ...JSON.parse(saved) }
      else if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        next = { ...next, reducedMotion: true, calmAnimations: true }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
    const frame = window.requestAnimationFrame(() => {
      setPreferences(next)
      applyPreferences(next)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [open])

  const update = (key: keyof Preferences) => {
    setPreferences((current) => {
      const next = { ...current, [key]: !current[key] }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      applyPreferences(next)
      return next
    })
  }

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY)
    setPreferences(defaultPreferences)
    applyPreferences(defaultPreferences)
  }

  const controls = [
    { key: "reducedMotion" as const, label: "Reduced motion", description: "Stops non-essential movement", icon: Accessibility },
    { key: "lowBandwidth" as const, label: "Low bandwidth", description: "Uses static media where possible", icon: Gauge },
    { key: "highContrast" as const, label: "High contrast", description: "Strengthens text and borders", icon: SlidersHorizontal },
    { key: "customCursor" as const, label: "Custom cursor", description: "Uses the portfolio SVG cursor", icon: MousePointer2 },
    { key: "calmAnimations" as const, label: "Calm interactions", description: "Removes depth and hover travel", icon: Accessibility },
  ]

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-4 z-[9998] inline-flex h-11 items-center gap-2 border-2 border-border bg-background px-3 font-mono text-[9px] font-black uppercase tracking-widest text-foreground shadow-xl transition-colors hover:border-foreground sm:bottom-6 sm:left-6"
        aria-label="Open experience controls"
        aria-expanded={open}
      >
        <SlidersHorizontal className="h-4 w-4" />
        <span className="hidden sm:inline">Experience</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close experience controls"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[10020] cursor-default bg-black/45 backdrop-blur-sm"
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Experience controls"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.22 }}
              className="fixed bottom-4 left-4 top-4 z-[10021] flex w-[calc(100%-2rem)] max-w-sm flex-col border-2 border-foreground bg-background p-5 shadow-2xl sm:bottom-6 sm:left-6 sm:top-auto sm:w-full sm:p-6"
            >
              <div className="flex items-start justify-between border-b-2 border-foreground pb-5">
                <div>
                  <div className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-muted-foreground">Interface preferences</div>
                  <h2 className="mt-2 font-display text-3xl font-black uppercase">Your experience</h2>
                </div>
                <button type="button" onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center border border-border hover:border-foreground" aria-label="Close settings" autoFocus>
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                {controls.map(({ key, label, description, icon: Icon }) => (
                  <button key={key} type="button" onClick={() => update(key)} aria-pressed={preferences[key]} className="flex w-full items-center gap-4 border-b border-border py-4 text-left">
                    <span className={`grid h-10 w-10 shrink-0 place-items-center border ${preferences[key] ? "border-foreground bg-foreground text-background" : "border-border bg-card"}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-[10px] font-black uppercase tracking-widest">{label}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">{description}</span>
                    </span>
                    <span className={`relative h-6 w-11 shrink-0 border transition-colors ${preferences[key] ? "border-foreground bg-foreground" : "border-border bg-muted"}`}>
                      <span className={`absolute top-1 h-3.5 w-3.5 bg-background transition-transform ${preferences[key] ? "translate-x-6" : "translate-x-1"}`} />
                    </span>
                  </button>
                ))}
              </div>

              <button type="button" onClick={reset} className="mt-4 min-h-11 border border-border font-mono text-[9px] font-black uppercase tracking-widest hover:border-foreground hover:bg-foreground hover:text-background">
                Reset experience
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
