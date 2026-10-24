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
      <h2 className="section-title">{title}<br /><span className="studio-serif">{accent}</span></h2>
    </div>
  )
}
