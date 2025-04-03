import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

export interface TestimonialAuthor {
  name: string
  handle: string
  avatar: string
}

export interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  href?: string
}

export function TestimonialCard({ 
  author,
  text,
  href
}: TestimonialCardProps) {
  return (
    <div 
      className={cn(
        "group relative flex w-80 shrink-0 flex-col justify-between overflow-hidden rounded-xl border p-6",
        "bg-card text-card-foreground shadow-sm transition-all duration-300",
        "hover:border-primary/50 hover:shadow-md",
        href && "cursor-pointer"
      )}
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm/relaxed font-medium">
          {text}
        </p>
        
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
            <Image
              src={author.avatar}
              alt={author.name}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="flex flex-col">
            <p className="text-sm font-semibold">
              {author.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {author.handle}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}