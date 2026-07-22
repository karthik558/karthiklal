import { cn } from "@/lib/utils"

type FlowerDividerProps = {
  className?: string
}

export function FlowerDivider({ className }: FlowerDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative z-20 flex h-20 items-center justify-center w-full overflow-hidden", className)}
    >
      <div className="absolute w-full max-w-7xl mx-auto h-[1px] bg-border/60" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center px-4 bg-background text-foreground/40 font-mono text-xs tracking-widest uppercase">
        ❖ 0xKL ❖
      </div>
    </div>
  )
}

