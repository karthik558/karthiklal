import Link from "next/link"
import { ArrowDownRight, BookOpenText, Code2, Palette } from "lucide-react"

const tracks = [
  {
    href: "#portfolio",
    number: "01",
    label: "Engineering",
    description: "Security tools, systems, and software built to solve operational problems.",
    icon: Code2,
  },
  {
    href: "#portfolio-gallery",
    number: "02",
    label: "Design",
    description: "Identity, campaigns, interfaces, and visual work shaped around a clear idea.",
    icon: Palette,
  },
  {
    href: "#journal",
    number: "03",
    label: "Writing",
    description: "Technical notes, field observations, and lessons from work in progress.",
    icon: BookOpenText,
  },
]

export default function ContentTracksSection() {
  return (
    <nav className="content-tracks" aria-label="Explore work by discipline">
      <div className="section-container">
        <p className="studio-label content-tracks-kicker">THREE PRACTICES / ONE BODY OF WORK</p>
        <div className="content-tracks-grid">
          {tracks.map(({ href, number, label, description, icon: Icon }) => (
            <Link key={href} href={href} className="content-track-card">
              <span className="content-track-number">{number}</span>
              <Icon aria-hidden="true" strokeWidth={1.4} />
              <span className="content-track-copy">
                <strong>{label}</strong>
                <span>{description}</span>
              </span>
              <ArrowDownRight aria-hidden="true" className="content-track-arrow" />
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
