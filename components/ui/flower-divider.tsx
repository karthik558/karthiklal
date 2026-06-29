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
          viewBox="0 0 48 48"
          className="h-6 w-6 text-primary"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24 5.5C28.2 11.3 28.2 15.6 24 21.4C19.8 15.6 19.8 11.3 24 5.5Z"
            fill="currentColor"
            fillOpacity="0.18"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M42.5 24C36.7 28.2 32.4 28.2 26.6 24C32.4 19.8 36.7 19.8 42.5 24Z"
            fill="currentColor"
            fillOpacity="0.18"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M24 42.5C19.8 36.7 19.8 32.4 24 26.6C28.2 32.4 28.2 36.7 24 42.5Z"
            fill="currentColor"
            fillOpacity="0.18"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M5.5 24C11.3 19.8 15.6 19.8 21.4 24C15.6 28.2 11.3 28.2 5.5 24Z"
            fill="currentColor"
            fillOpacity="0.18"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <circle cx="24" cy="24" r="4.2" fill="currentColor" />
        </svg>
      </div>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-border/40" />
    </div>
  )
}
