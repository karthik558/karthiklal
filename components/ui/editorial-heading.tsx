interface EditorialHeadingProps {
  title: string
  accent?: string
  as?: "h1" | "h2"
}

export default function EditorialHeading({ title, accent, as: Tag = "h1" }: EditorialHeadingProps) {
  return <Tag className={`editorial-heading ${Tag === "h2" ? "section-title" : "page-title"}`}>
    {title}{accent && <><br /><span className="studio-serif">{accent}</span></>}
  </Tag>
}
