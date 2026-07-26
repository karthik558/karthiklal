type EvidenceProject = {
  id: number
  title: string
  description: string
  category: string
  link?: string
  github?: string
  technologies: string[]
}

export type ProjectEvidence = {
  challenge: string
  response: string
  outcome: string
  facts: { value: string; label: string; detail: string }[]
  notes: { signal: string; decision: string; rationale: string }[]
}

const projectFacts: Record<number, ProjectEvidence["facts"]> = {
  1: [
    { value: "5", label: "Core technologies", detail: "React, TypeScript, Tailwind, Vite, and JavaScript" },
    { value: "PUBLIC", label: "Source access", detail: "Repository available on GitHub" },
    { value: "AI", label: "Analysis workflow", detail: "Repository and coding-habit analysis" },
  ],
  2: [
    { value: "10 DAYS", label: "Program structure", detail: "A guided Agnividya learning journey" },
    { value: "7", label: "Core technologies", detail: "Typed UI, hosted data, and edge delivery" },
    { value: "LIVE", label: "Production status", detail: "Public experience deployed at deviproject.org" },
  ],
  6: [
    { value: "QR", label: "Primary workflow", detail: "Physical asset registration, labeling, and audits" },
    { value: "MULTI", label: "Operational scope", detail: "Properties, departments, ownership, and accountability" },
    { value: "LIVE", label: "Production status", detail: "Public platform deployed at samsproject.in" },
  ],
  7: [
    { value: "70+", label: "Device profiles", detail: "User-agent and touch-point profiles" },
    { value: "PER-SITE", label: "Rule model", detail: "Independent behavior for selected websites" },
    { value: "FIREFOX", label: "Distribution", detail: "Published browser add-on" },
  ],
  9: [
    { value: "RUST", label: "Runtime", detail: "Lightweight network-monitoring foundation" },
    { value: "LIVE", label: "Telemetry", detail: "Health, logs, and failure visibility" },
    { value: "4", label: "Core technologies", detail: "Rust, React, TypeScript, and Vite" },
  ],
  10: [
    { value: "AES-256", label: "Encryption", detail: "AES-256-GCM authenticated file encryption" },
    { value: "KDF", label: "Key handling", detail: "Password-based key derivation" },
    { value: "RUST", label: "Implementation", detail: "Security-focused systems language" },
  ],
  12: [
    { value: "3", label: "Core operations", detail: "Filter, search, and export log data" },
    { value: "PYTHON", label: "Implementation", detail: "Cross-purpose analysis utility" },
    { value: "PUBLIC", label: "Source access", detail: "Repository available on GitHub" },
  ],
}

function technologyNotes(project: EvidenceProject): ProjectEvidence["notes"] {
  const stack = new Set(project.technologies.map((technology) => technology.toLowerCase()))
  const notes: ProjectEvidence["notes"] = []

  if (stack.has("typescript")) {
    notes.push({
      signal: "Complex interface state",
      decision: "Typed application boundary",
      rationale: "TypeScript makes data contracts and interaction states explicit as the product grows.",
    })
  }
  if (stack.has("supabase")) {
    notes.push({
      signal: "Persistent product data",
      decision: "Managed backend services",
      rationale: "Supabase supports data-driven workflows without introducing a separate infrastructure layer.",
    })
  }
  if (stack.has("cloudflare")) {
    notes.push({
      signal: "Distributed audience",
      decision: "Edge-oriented delivery",
      rationale: "Cloudflare is part of the deployed stack for resilient delivery and network-level control.",
    })
  }
  if (stack.has("rust")) {
    notes.push({
      signal: "Security or systems workload",
      decision: "Memory-safe systems implementation",
      rationale: "Rust aligns performance-sensitive behavior with strong compile-time safety guarantees.",
    })
  }
  if (stack.has("python")) {
    notes.push({
      signal: "Automation-heavy workflow",
      decision: "Focused scripting utility",
      rationale: "Python keeps parsing, analysis, and operational automation direct and maintainable.",
    })
  }
  if (/extension/i.test(project.category)) {
    notes.push({
      signal: "Browser-native workflow",
      decision: "Extension-first delivery",
      rationale: "The capability stays close to the browsing context where it is needed.",
    })
  }

  const fallbacks: ProjectEvidence["notes"] = [
    {
      signal: "Multiple viewport contexts",
      decision: "Responsive component system",
      rationale: "Interface behavior is defined at component level for consistent mobile and desktop use.",
    },
    {
      signal: "Public-facing product",
      decision: "Progressive interaction model",
      rationale: "Core content remains understandable before enhanced motion and client behavior are applied.",
    },
    {
      signal: "Long-term maintainability",
      decision: "Reusable visual primitives",
      rationale: "Shared spacing, typography, and state patterns prevent visual drift.",
    },
  ]

  return [...notes, ...fallbacks].slice(0, 3)
}

export function getProjectEvidence(project: EvidenceProject): ProjectEvidence {
  const facts =
    projectFacts[project.id] ??
    [
      {
        value: String(project.technologies.length).padStart(2, "0"),
        label: "Core technologies",
        detail: project.technologies.join(", "),
      },
      {
        value: project.link ? "LIVE" : "BUILD",
        label: "Delivery state",
        detail: project.link ? "A public project destination is available" : "Source-led project documentation",
      },
      {
        value: project.github ? "PUBLIC" : project.category.toUpperCase(),
        label: project.github ? "Source access" : "Project discipline",
        detail: project.github ? "Repository access is linked from this case study" : project.category,
      },
    ]

  return {
    challenge: `Create a dependable ${project.category.toLowerCase()} experience around the need described by the project: ${project.description}`,
    response: `A focused implementation using ${project.technologies.join(", ")} keeps the product's core behavior legible, responsive, and maintainable.`,
    outcome: project.link
      ? "The work is available as a live or published experience, with its delivery path linked directly from this case study."
      : "The completed implementation is documented through its source repository and technical stack.",
    facts,
    notes: technologyNotes(project),
  }
}
