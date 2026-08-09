"use client"

let audioCtx: AudioContext | null = null

const getAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

export const isSoundEnabled = (): boolean => {
  if (typeof window === "undefined") return false
  return localStorage.getItem("sound_enabled") === "true"
}

export const setSoundEnabled = (enabled: boolean): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("sound_enabled", enabled ? "true" : "false")
}

export const playClickSound = (): void => {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = "sine"
    osc.frequency.setValueAtTime(460, t)
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.022)

    // Gentle soft attack and low volume envelope for smooth tap feel
    gain.gain.setValueAtTime(0.001, t)
    gain.gain.linearRampToValueAtTime(0.07, t + 0.004)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.022)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(t)
    osc.stop(t + 0.022)
  } catch {
    // Audio context error fallback
  }
}

export const playHoverSound = (): void => {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = "triangle"
    osc.frequency.setValueAtTime(1400, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.03)

    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.03)
  } catch {
    // Fallback
  }
}

export const playSuccessSound = (): void => {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gain = ctx.createGain()

    osc1.type = "sine"
    osc2.type = "sine"

    osc1.frequency.setValueAtTime(523.25, ctx.currentTime) // C5
    osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.06) // E5

    gain.gain.setValueAtTime(0.30, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)

    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(ctx.destination)

    osc1.start(ctx.currentTime)
    osc1.stop(ctx.currentTime + 0.1)

    osc2.start(ctx.currentTime + 0.06)
    osc2.stop(ctx.currentTime + 0.2)
  } catch {
    // Fallback
  }
}

export const playModalOpenSound = (): void => {
  if (!isSoundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = "sine"
    osc.frequency.setValueAtTime(250, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.1)

    gain.gain.setValueAtTime(0.35, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.1)
  } catch {
    // Fallback
  }
}

let lastWhooshTimestamp = 0

export const playWindWhooshSound = (intensity = 0.5): void => {
  if (!isSoundEnabled()) return

  const now = typeof performance !== "undefined" ? performance.now() : Date.now()
  if (now - lastWhooshTimestamp < 2800) {
    return // Prevent double whoosh during the same scroll gesture
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
    // Smooth gentle attack (no instant pop/blast)
    gain.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + duration * 0.35)
    // Smooth decay
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
