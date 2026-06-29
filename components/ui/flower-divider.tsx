import { cn } from "@/lib/utils"

type FlowerDividerProps = {
  className?: string
}

export function FlowerDivider({ className }: FlowerDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative z-20 flex h-12 items-center justify-center bg-background", className)}
    >
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-border/40" />
      <div className="relative mx-5 flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background shadow-sm">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m6 18 6-6-6-6" />
          <path d="m13 18 6-6-6-6" />
        </svg>
      </div>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-border/40" />
    </div>
  )
}
