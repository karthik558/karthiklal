import type { ReactNode } from "react"
import EditorialHeading from "@/components/ui/editorial-heading"

export default function PageIntro({ label, title, accent, description, children }: {
  label: string
  title: string
  accent?: string
  description?: string
  children?: ReactNode
}) {
  return <header className="page-intro">
    <p className="studio-label">{label}</p>
    <div className="page-intro-layout">
      <EditorialHeading title={title} accent={accent} />
      {(description || children) && <div className="page-intro-aside">{description && <p>{description}</p>}{children}</div>}
    </div>
  </header>
}
