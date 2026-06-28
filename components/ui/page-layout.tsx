"use client"

import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Search, X } from "lucide-react"

export function PageShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative min-h-screen overflow-hidden bg-background pt-24 pb-28 selection:bg-primary/30", className)}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[440px] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,hsl(var(--primary)/0.08),hsl(var(--background))_72%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.10),transparent_30%),radial-gradient(circle_at_80%_0%,hsl(var(--accent)/0.08),transparent_28%)]" />
        <div className="bg-noise absolute inset-0 opacity-30" />
      </div>
      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6">{children}</div>
    </div>
  )
}

export function PageHero({
  eyebrow,
  title,
  gradientText,
  description,
}: {
  eyebrow: string
  title: string
  gradientText: string
  description: string
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="mx-auto mb-10 flex max-w-3xl flex-col items-center pt-8 text-center md:mb-12"
    >
      <Badge variant="outline" className="mb-5 rounded-full border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        {eyebrow}
      </Badge>
      <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
        {title} <span className="text-gradient">{gradientText}</span>
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">{description}</p>
    </motion.header>
  )
}

export function PageToolbar({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.1 }}
      className={cn(
        "mb-10 flex flex-col gap-4 rounded-lg border border-border/70 bg-card/70 p-3 shadow-sm backdrop-blur md:mb-12 lg:flex-row lg:items-center lg:justify-between",
        className
      )}
    >
      {children}
    </motion.div>
  )
}

export function SearchField({
  value,
  onChange,
  onClear,
  placeholder,
  className,
}: {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  placeholder: string
  className?: string
}) {
  return (
    <div className={cn("relative w-full lg:max-w-sm", className)}>
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-md border-border/80 bg-background/80 pl-10 pr-10 shadow-none focus-visible:ring-1"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export function FilterPills({
  items,
  activeItem,
  onSelect,
  layoutId,
  className,
}: {
  items: string[]
  activeItem: string
  onSelect: (item: string) => void
  layoutId: string
  className?: string
}) {
  return (
    <div className={cn("no-scrollbar flex w-full overflow-x-auto rounded-md border border-border/70 bg-background/60 p-1 lg:w-auto", className)}>
      <div className="flex min-w-max items-center gap-1">
        {items.map((item) => {
          const isActive = activeItem === item
          return (
            <button
              key={item}
              type="button"
              onClick={() => onSelect(item)}
              className={cn(
                "relative rounded-md px-4 py-2 text-sm font-medium transition-colors",
                isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId={layoutId}
                  className="absolute inset-0 rounded-md bg-primary"
                  transition={{ type: "spring", stiffness: 480, damping: 34 }}
                />
              )}
              <span className="relative z-10">{item}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string
  description: string
  actionLabel: string
  onAction: () => void
}) {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      className="rounded-lg border border-border/70 bg-card/70 px-6 py-20 text-center shadow-sm"
    >
      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Search className="h-6 w-6" />
      </div>
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">{description}</p>
      <button type="button" onClick={onAction} className="mt-6 font-medium text-primary transition hover:text-primary/80">
        {actionLabel}
      </button>
    </motion.div>
  )
}
