import EditorialHeading from "@/components/ui/editorial-heading"

export default function SectionHeading({ title, accent }: { title: string; accent: string }) {
  return <div className="section-heading-copy"><EditorialHeading as="h2" title={title} accent={accent} /></div>
}
