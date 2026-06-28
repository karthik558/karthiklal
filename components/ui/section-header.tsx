import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type SectionHeaderAlign = "left" | "center" | "responsive"

export function SectionHeader({
  eyebrow,
  title,
  highlight,
  description,
  align = "center",
  className,
}: {
  eyebrow: string
  title: string
  highlight: string
  description?: string
  align?: SectionHeaderAlign
  className?: string
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        align === "left" && "text-left",
        align === "responsive" && "mx-auto text-center md:mx-0 md:text-left",
        className
      )}
    >
      <Badge
        variant="outline"
        className="mb-6 rounded-full border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
      >
        {eyebrow}
      </Badge>
      <h2 className="font-display text-4xl font-bold leading-[1.15] tracking-tight md:text-5xl lg:text-6xl">
        {title} <span className="text-gradient">{highlight}</span>
      </h2>
      {description && <p className="mt-5 text-base leading-7 text-muted-foreground md:text-lg">{description}</p>}
    </div>
  )
}
