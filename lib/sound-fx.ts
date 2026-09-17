"use client"

export type SoundProfileId = "muted" | "cyber" | "clean" | "retro"

export interface SoundProfileMeta {
  id: SoundProfileId
  label: string
  description: string
  accentColor: string
}

export const SOUND_PROFILES: Record<SoundProfileId, SoundProfileMeta> = {
  muted: {
    id: "muted",
    label: "Muted",
    description: "UI sound effects disabled",
    accentColor: "transparent",
  },
  cyber: {
    id: "cyber",
    label: "Cyber Mechanical",
    description: "Tactile clicks, telemetry sweeps & switch clacks",
    accentColor: "#10b981", // Emerald
  },
  clean: {
    id: "clean",
    label: "Editorial Clean",
    description: "Subdued acoustic taps & gentle harmonic chimes",
    accentColor: "#e4e4e7", // Zinc / monochrome
  },
  retro: {
    id: "retro",
    label: "Retro CRT 80s",
    description: "8-bit arcade blips & terminal arpeggios",
    accentColor: "#f59e0b", // Amber
  },
}

export const PROFILE_CYCLE: SoundProfileId[] = ["muted", "cyber", "clean", "retro"]

const SOUND_PROFILE_KEY = "portfolio_sound_profile"
const LEGACY_SOUND_KEY = "sound_enabled"
const SOUND_PROFILE_EVENT = "app:sound-profile-change"
const LEGACY_SOUND_EVENT = "app:sound-toggle"

let audioCtx: AudioContext | null = null

export const getAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

// ---------------------------------------------------------------------------
// State & Persistence
// ---------------------------------------------------------------------------

export const getSoundProfile = (): SoundProfileId => {
  if (typeof window === "undefined") return "muted"
  const saved = localStorage.getItem(SOUND_PROFILE_KEY) as SoundProfileId | null
  if (saved && saved in SOUND_PROFILES) {
    return saved
  }
  // Fallback to legacy key if present
  if (localStorage.getItem(LEGACY_SOUND_KEY) === "true") {
    return "cyber"
  }
  return "muted"
}

export const setSoundProfile = (profile: SoundProfileId): void => {
  if (typeof window === "undefined") return
  localStorage.setItem(SOUND_PROFILE_KEY, profile)
  localStorage.setItem(LEGACY_SOUND_KEY, profile !== "muted" ? "true" : "false")

  window.dispatchEvent(new CustomEvent(SOUND_PROFILE_EVENT, { detail: { profile } }))
  window.dispatchEvent(new CustomEvent(LEGACY_SOUND_EVENT, { detail: { enabled: profile !== "muted" } }))
}

export const cycleSoundProfile = (): SoundProfileId => {
  const current = getSoundProfile()
  const currentIndex = PROFILE_CYCLE.indexOf(current)
  const nextIndex = (currentIndex + 1) % PROFILE_CYCLE.length
  const nextProfile = PROFILE_CYCLE[nextIndex]
  setSoundProfile(nextProfile)
  return nextProfile
}

export const subscribeSoundProfileChange = (callback: () => void): (() => void) => {
  if (typeof window === "undefined") return () => {}
  window.addEventListener(SOUND_PROFILE_EVENT, callback)
  window.addEventListener("storage", callback)
  return () => {
    window.removeEventListener(SOUND_PROFILE_EVENT, callback)
    window.removeEventListener("storage", callback)
  }
}

// Backward-compatible helpers
export const isSoundEnabled = (): boolean => getSoundProfile() !== "muted"

export const setSoundEnabled = (enabled: boolean): void => {
  setSoundProfile(enabled ? "cyber" : "muted")
}

export const subscribeSoundChange = (callback: () => void): (() => void) => {
  return subscribeSoundProfileChange(callback)
}

// ---------------------------------------------------------------------------
// Procedural Sound Engines
// ---------------------------------------------------------------------------

interface SoundGenerators {
  click: (ctx: AudioContext) => void
  hover: (ctx: AudioContext) => void
  typing: (ctx: AudioContext, pitchOffset?: number) => void
  modal: (ctx: AudioContext) => void
  copy: (ctx: AudioContext) => void
  themeToggle: (ctx: AudioContext) => void
  activationCue: (ctx: AudioContext) => void
}

const CYBER_GENERATORS: SoundGenerators = {
  click: (ctx) => {
    const t = ctx.currentTime
    // Transient click
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = "square"
    osc1.frequency.setValueAtTime(1800, t)
    osc1.frequency.exponentialRampToValueAtTime(320, t + 0.016)
    gain1.gain.setValueAtTime(0.06, t)
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.016)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(t)
    osc1.stop(t + 0.016)

    // Body thump
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = "sine"
    osc2.frequency.setValueAtTime(140, t)
    osc2.frequency.exponentialRampToValueAtTime(50, t + 0.024)
    gain2.gain.setValueAtTime(0.09, t)
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.024)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(t)
    osc2.stop(t + 0.024)
  },

  hover: (ctx) => {
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "triangle"
    osc.frequency.setValueAtTime(1200, t)
    osc.frequency.exponentialRampToValueAtTime(2400, t + 0.022)
    gain.gain.setValueAtTime(0.03, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.022)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.022)
  },

  typing: (ctx, pitchOffset = 1.0) => {
    const t = ctx.currentTime
    const baseFreq = 2200 * pitchOffset
    const duration = 0.014

    // Filtered noise burst simulating mechanical switch bottom-out
    const bufferSize = Math.floor(ctx.sampleRate * duration)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = "bandpass"
    filter.frequency.setValueAtTime(baseFreq, t)
    filter.Q.setValueAtTime(3.2, t)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.055, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    noise.start(t)
    noise.stop(t + duration)

    // Subtle tactile tap
    const tap = ctx.createOscillator()
    const tapGain = ctx.createGain()
    tap.type = "triangle"
    tap.frequency.setValueAtTime(360 * pitchOffset, t)
    tap.frequency.exponentialRampToValueAtTime(120, t + 0.012)
    tapGain.gain.setValueAtTime(0.04, t)
    tapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.012)
    tap.connect(tapGain)
    tapGain.connect(ctx.destination)
    tap.start(t)
    tap.stop(t + 0.012)
  },

  modal: (ctx) => {
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "sine"
    osc.frequency.setValueAtTime(260, t)
    osc.frequency.exponentialRampToValueAtTime(840, t + 0.09)
    gain.gain.setValueAtTime(0.12, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.09)
  },

  copy: (ctx) => {
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "sine"
    osc.frequency.setValueAtTime(880, t)
    osc.frequency.setValueAtTime(1760, t + 0.035)
    gain.gain.setValueAtTime(0.07, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.08)
  },

  themeToggle: (ctx) => {
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "sawtooth"
    osc.frequency.setValueAtTime(180, t)
    osc.frequency.exponentialRampToValueAtTime(540, t + 0.07)

    const filter = ctx.createBiquadFilter()
    filter.type = "lowpass"
    filter.frequency.setValueAtTime(800, t)

    gain.gain.setValueAtTime(0.06, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.07)
  },

  activationCue: (ctx) => {
    const t = ctx.currentTime
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gain = ctx.createGain()

    osc1.type = "triangle"
    osc2.type = "sine"
    osc1.frequency.setValueAtTime(587.33, t) // D5
    osc2.frequency.setValueAtTime(880, t + 0.06) // A5

    gain.gain.setValueAtTime(0.12, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22)

    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(ctx.destination)

    osc1.start(t)
    osc1.stop(t + 0.08)
    osc2.start(t + 0.06)
    osc2.stop(t + 0.22)
  },
}

const CLEAN_GENERATORS: SoundGenerators = {
  click: (ctx) => {
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "sine"
    osc.frequency.setValueAtTime(460, t)
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.022)

    // Soft attack to avoid clicks
    gain.gain.setValueAtTime(0.001, t)
    gain.gain.linearRampToValueAtTime(0.07, t + 0.003)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.022)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.022)
  },

  hover: (ctx) => {
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "sine"
    osc.frequency.setValueAtTime(880, t)

    gain.gain.setValueAtTime(0.001, t)
    gain.gain.linearRampToValueAtTime(0.022, t + 0.002)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.018)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.018)
  },

  typing: (ctx, pitchOffset = 1.0) => {
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "sine"
    osc.frequency.setValueAtTime(320 * pitchOffset, t)
    osc.frequency.exponentialRampToValueAtTime(140 * pitchOffset, t + 0.018)

    gain.gain.setValueAtTime(0.001, t)
    gain.gain.linearRampToValueAtTime(0.045, t + 0.002)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.018)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.018)
  },

  modal: (ctx) => {
    const t = ctx.currentTime
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gain = ctx.createGain()

    osc1.type = "sine"
    osc2.type = "sine"
    osc1.frequency.setValueAtTime(523.25, t) // C5
    osc2.frequency.setValueAtTime(659.25, t) // E5

    gain.gain.setValueAtTime(0.001, t)
    gain.gain.linearRampToValueAtTime(0.08, t + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16)

    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(ctx.destination)

    osc1.start(t)
    osc1.stop(t + 0.16)
    osc2.start(t)
    osc2.stop(t + 0.16)
  },

  copy: (ctx) => {
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "sine"
    osc.frequency.setValueAtTime(784, t) // G5
    osc.frequency.exponentialRampToValueAtTime(1046.5, t + 0.04) // C6

    gain.gain.setValueAtTime(0.001, t)
    gain.gain.linearRampToValueAtTime(0.06, t + 0.004)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.08)
  },

  themeToggle: (ctx) => {
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "sine"
    osc.frequency.setValueAtTime(440, t)
    osc.frequency.exponentialRampToValueAtTime(330, t + 0.08)

    gain.gain.setValueAtTime(0.001, t)
    gain.gain.linearRampToValueAtTime(0.05, t + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.08)
  },

  activationCue: (ctx) => {
    const t = ctx.currentTime
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gain = ctx.createGain()

    osc1.type = "sine"
    osc2.type = "sine"
    osc1.frequency.setValueAtTime(523.25, t) // C5
    osc2.frequency.setValueAtTime(783.99, t + 0.05) // G5

    gain.gain.setValueAtTime(0.001, t)
    gain.gain.linearRampToValueAtTime(0.09, t + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25)

    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(ctx.destination)

    osc1.start(t)
    osc1.stop(t + 0.25)
    osc2.start(t + 0.05)
    osc2.stop(t + 0.25)
  },
}

const RETRO_GENERATORS: SoundGenerators = {
  click: (ctx) => {
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "square"
    osc.frequency.setValueAtTime(880, t)
    osc.frequency.setValueAtTime(440, t + 0.01)

    gain.gain.setValueAtTime(0.05, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.02)
  },

  hover: (ctx) => {
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "square"
    osc.frequency.setValueAtTime(1760, t)

    gain.gain.setValueAtTime(0.025, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.012)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.012)
  },

  typing: (ctx, pitchOffset = 1.0) => {
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "square"
    osc.frequency.setValueAtTime(520 * pitchOffset, t)
    osc.frequency.setValueAtTime(260 * pitchOffset, t + 0.007)

    gain.gain.setValueAtTime(0.038, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.014)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.014)
  },

  modal: (ctx) => {
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "square"
    osc.frequency.setValueAtTime(523.25, t) // C5
    osc.frequency.setValueAtTime(659.25, t + 0.03) // E5
    osc.frequency.setValueAtTime(783.99, t + 0.06) // G5

    gain.gain.setValueAtTime(0.06, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.12)
  },

  copy: (ctx) => {
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "square"
    osc.frequency.setValueAtTime(987.77, t) // B5
    osc.frequency.setValueAtTime(1318.51, t + 0.025) // E6

    gain.gain.setValueAtTime(0.05, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.07)
  },

  themeToggle: (ctx) => {
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "square"
    osc.frequency.setValueAtTime(659.25, t)
    osc.frequency.setValueAtTime(440, t + 0.03)
    osc.frequency.setValueAtTime(220, t + 0.06)

    gain.gain.setValueAtTime(0.05, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.09)
  },

  activationCue: (ctx) => {
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "square"
    osc.frequency.setValueAtTime(523.25, t) // C5
    osc.frequency.setValueAtTime(783.99, t + 0.04) // G5
    osc.frequency.setValueAtTime(1046.5, t + 0.08) // C6

    gain.gain.setValueAtTime(0.07, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.22)
  },
}

const GENERATORS: Record<Exclude<SoundProfileId, "muted">, SoundGenerators> = {
  cyber: CYBER_GENERATORS,
  clean: CLEAN_GENERATORS,
  retro: RETRO_GENERATORS,
}

// ---------------------------------------------------------------------------
// Public Audio Triggers
// ---------------------------------------------------------------------------

export const playProfileClickSound = (): void => {
  const profile = getSoundProfile()
  if (profile === "muted") return
  const ctx = getAudioContext()
  if (!ctx) return
  try {
    GENERATORS[profile].click(ctx)
  } catch {
    // Audio node error fallback
  }
}

export const playProfileHoverSound = (): void => {
  const profile = getSoundProfile()
  if (profile === "muted") return
  const ctx = getAudioContext()
  if (!ctx) return
  try {
    GENERATORS[profile].hover(ctx)
  } catch {
    // Audio node error fallback
  }
}

export const playProfileTypingSound = (pitchOffset = 1.0): void => {
  const profile = getSoundProfile()
  if (profile === "muted") return
  const ctx = getAudioContext()
  if (!ctx) return
  try {
    GENERATORS[profile].typing(ctx, pitchOffset)
  } catch {
    // Audio node error fallback
  }
}

export const playProfileModalSound = (): void => {
  const profile = getSoundProfile()
  if (profile === "muted") return
  const ctx = getAudioContext()
  if (!ctx) return
  try {
    GENERATORS[profile].modal(ctx)
  } catch {
    // Audio node error fallback
  }
}

export const playProfileCopySound = (): void => {
  const profile = getSoundProfile()
  if (profile === "muted") return
  const ctx = getAudioContext()
  if (!ctx) return
  try {
    GENERATORS[profile].copy(ctx)
  } catch {
    // Audio node error fallback
  }
}

export const playProfileThemeToggleSound = (): void => {
  const profile = getSoundProfile()
  if (profile === "muted") return
  const ctx = getAudioContext()
  if (!ctx) return
  try {
    GENERATORS[profile].themeToggle(ctx)
  } catch {
    // Audio node error fallback
  }
}

export const playProfileActivationCue = (targetProfile?: SoundProfileId): void => {
  const profile = targetProfile || getSoundProfile()
  if (profile === "muted") return
  const ctx = getAudioContext()
  if (!ctx) return
  try {
    GENERATORS[profile].activationCue(ctx)
  } catch {
    // Audio node error fallback
  }
}

// Backward-compatible delegates
export const playClickSound = (): void => playProfileClickSound()
export const playHoverSound = (): void => playProfileHoverSound()
export const playSuccessSound = (): void => playProfileActivationCue()
export const playModalOpenSound = (): void => playProfileModalSound()

let lastWhooshTimestamp = 0

export const playWindWhooshSound = (intensity = 0.5): void => {
  if (!isSoundEnabled()) return

  const now = typeof performance !== "undefined" ? performance.now() : Date.now()
  if (now - lastWhooshTimestamp < 2800) {
    return
  }
  lastWhooshTimestamp = now

  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const clampedIntensity = Math.max(0.1, Math.min(1, intensity))
    const duration = 0.35 + clampedIntensity * 0.25
    const targetGain = 0.06 + clampedIntensity * 0.22

    const bufferSize = Math.floor(ctx.sampleRate * duration)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = "bandpass"
    filter.Q.setValueAtTime(2.5, ctx.currentTime)

    const startFreq = 180 + clampedIntensity * 120
    const peakFreq = 600 + clampedIntensity * 1200
    const endFreq = 200 + clampedIntensity * 100

    filter.frequency.setValueAtTime(startFreq, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(peakFreq, ctx.currentTime + duration * 0.4)
    filter.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.001, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + duration * 0.35)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    noise.start(ctx.currentTime)
    noise.stop(ctx.currentTime + duration)
  } catch {
    // Fallback
  }
}
