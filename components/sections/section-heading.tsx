import EditorialHeading from "@/components/ui/editorial-heading"

interface SectionHeadingProps {
  number: string
  label: string
  title: string
  accent: string
}

export default function SectionHeading({ number, label, title, accent }: SectionHeadingProps) {
  return (
    <div className="section-heading-copy">
      <p className="studio-label section-heading-label">{number} / {label}</p>
      <EditorialHeading as="h2" title={title} accent={accent} />
    </div>
  )
}
