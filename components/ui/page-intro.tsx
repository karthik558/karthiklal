import EditorialHeading from "@/components/ui/editorial-heading"

export default function PageIntro({ title, accent }: { title: string; accent?: string }) {
  return <header className="page-intro"><EditorialHeading title={title} accent={accent} /></header>
}
