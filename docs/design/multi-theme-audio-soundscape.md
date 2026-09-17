# Multi-Theme Procedural Audio Soundscape System

## 1. Understanding Summary
* **What**: A zero-dependency procedural audio soundscape system with three switchable acoustic profiles:
  * **Cyber Mechanical** (tactile transient clicks, telemetry sweeps, resonant clacks)
  * **Editorial Clean** (subdued acoustic woodblock taps, gentle sine resonances)
  * **Retro CRT 80s** (8-bit arcade blips, terminal pulses, ascending arpeggios)
* **Why**: To provide tactile, responsive micro-interactions that elevate visitor engagement and celebrate Karthik Lal's identity as a cybersecurity specialist and full-stack engineer.
* **Who**: Visitors, recruiters, and developers exploring the portfolio on desktop and laptop devices.
* **Triggers**: Clicks on interactive elements, throttled hover on navigation/cards, typing keydowns in search/inputs, modal toggling, copy-to-clipboard actions, and theme switching.
* **Constraints**:
  * 100% procedural Web Audio API synthesis (0 KB external audio files, 0 network latency).
  * Default muted on initial visit (opt-in via navbar button).
  * Strict rate-limiting and pitch randomization to prevent acoustic clutter or fatigue.
* **Explicit Non-Goals**:
  * Background looping soundtrack or music player.
  * Third-party audio frameworks (Howler.js, Tone.js, etc.).
  * Unmuted autoplay before direct user opt-in.

---

## 2. Assumptions
1. **State Persistence**: Active sound profile (`'muted' | 'cyber' | 'clean' | 'retro'`) persists in `localStorage` (`portfolio_sound_profile`) and synchronizes across browser tabs via `storage` events and React `useSyncExternalStore`.
2. **Cycle Flow**: The navbar button cycles sequentially: `Muted` ➔ `Cyber` ➔ `Clean` ➔ `Retro` ➔ `Muted`.
3. **Acoustic Feedback on Switch**: Activating a profile immediately plays its signature preview sound and displays a brief toast notification via Sonner.
4. **Keystroke Variation**: Typing sounds include subtle procedural pitch jitter (±4%) and a minimum 55ms cooldown to ensure natural tactile variation.
5. **Mobile Handling**: Touch devices (`hover: none`) bypass hover audio triggers. Audio gracefully suspends when the tab is hidden (`document.hidden`).

---

## 3. Decision Log

| # | Decision | Alternatives Considered | Rationale |
|---|----------|-------------------------|-----------|
| **1** | Multi-Theme Sound System (`Cyber`, `Clean`, `Retro`) | Single fixed cyber soundscape, or ambient music loop | Empowers visitors with aesthetic choice and highlights creative audio synthesis engineering. |
| **2** | Inline Navbar Cycle Button | Dropdown popover, floating dock, or modal | Zero UI clutter, fits cleanly beside the theme toggle in the main navigation. |
| **3** | Comprehensive Core Triggers (`click`, `hover`, `typing`, `modal`, `copy`, `theme`) | Click-only, or full sensory with scroll whoosh | Delivers rich tactile feedback without acoustic fatigue. |
| **4** | 100% Procedural Web Audio API | Pre-recorded audio sprite files (.mp3/.webm) | 0 KB bundle weight, 0 network latency, offline capability, precise mathematical control. |
| **5** | Default Muted on First Visit | Default enabled | Respects visitor preference and browser autoplay policies. |

---

## 4. Technical Architecture

### 4.1 State Engine (`lib/sound-fx.ts`)
```typescript
export type SoundProfileId = "muted" | "cyber" | "clean" | "retro"

export interface SoundProfileMeta {
  id: SoundProfileId
  label: string
  description: string
  icon: string
}

export interface SoundGenerators {
  click: (ctx: AudioContext) => void
  hover: (ctx: AudioContext) => void
  typing: (ctx: AudioContext, pitchOffset?: number) => void
  modal: (ctx: AudioContext) => void
  copy: (ctx: AudioContext) => void
  themeToggle: (ctx: AudioContext) => void
  activationCue: (ctx: AudioContext) => void
}
```

### 4.2 Sound Profile Definitions
1. **Cyber Mechanical**:
   * *Click*: Dual-pulse transient (1800Hz, 15ms) + sub-mechanical thump (140Hz, 30ms).
   * *Hover*: Triangle wave sweep 1200Hz ➔ 2400Hz over 25ms (-18dB).
   * *Typing*: 8ms filtered white noise burst (2400Hz bandpass, Q=3.0) with ±4% pitch jitter.
   * *Modal/Copy*: Dual-tone octave leap (523Hz ➔ 1046Hz).
   * *Theme*: Resonant low-end sweep (180Hz ➔ 540Hz).
2. **Editorial Clean**:
   * *Click*: Damped sine wave woodblock tap (460Hz ➔ 220Hz over 22ms).
   * *Hover*: Muted sine resonance (880Hz, 18ms decay).
   * *Typing*: Soft filtered thump (300Hz round tap).
   * *Modal/Copy/Theme*: Harmonic dual bell chime (C5 + E5).
3. **Retro CRT 80s**:
   * *Click*: Pure square wave step (880Hz ➔ 440Hz, 20ms).
   * *Hover*: 8-bit telemetry blip (1760Hz, 12ms).
   * *Typing*: CRT terminal pulse with sharp cutoff.
   * *Modal/Copy/Theme*: Ascending 3-step arpeggio (C5 ➔ E5 ➔ G5).

### 4.3 UI Controller (`components/ui/sound-toggle.tsx`)
* Seamless replacement in the navigation bar.
* Responsive iconography and indicator color reflecting the active profile:
  * `muted`: `VolumeX` (neutral)
  * `cyber`: `Volume2` (green indicator dot)
  * `clean`: `Volume1` (monochrome dot)
  * `retro`: `Tv` / `Radio` (amber indicator dot)
* Alt-click / double-click instantly resets to `muted`.
* Fires Sonner toast on profile change with sound name and description.

### 4.4 Global Interaction Interceptors (`components/client-enhancements.tsx`)
* **Click**: Intercepts interactive links and buttons.
* **Typing**: Listens to `keydown` on input/textarea with 55ms throttle and procedural pitch jitter.
* **Hover**: Rate-limited `pointerover` (90ms threshold) on desktop (`hover: hover`).
* **Clipboard**: Captures `copy` events.
* **Lifecycle**: Resumes `AudioContext` on gesture, pauses on tab blur (`document.hidden`).

---

## 5. Verification Plan
* **Type Safety**: Verify zero TypeScript errors with `npm run typecheck`.
* **Linting & SSR**: Verify no hydration mismatches or ESLint errors with `npm run lint`.
* **Smoke Testing**: Validate profile cycling and error-free execution with `npm run test:smoke`.
* **Audio Context Audit**: Validate zero memory leaks (all oscillators stop and disconnect properly).
