import { cn } from "@/lib/utils"

type FlowerDividerProps = {
  className?: string
}

export function FlowerDivider({ className }: FlowerDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative z-20 flex h-24 items-center justify-center w-full overflow-hidden opacity-80", className)}
    >
      <div className="absolute w-full max-w-5xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-foreground/15 dark:via-primary/30 to-transparent" />
      <div className="absolute w-1/2 max-w-xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-foreground/25 dark:via-primary/60 to-transparent blur-[1px]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-[2px] bg-foreground/30 dark:bg-primary rounded-full dark:shadow-[0_0_12px_2px_hsl(var(--primary)/0.7)]" />
    </div>
  )
}
