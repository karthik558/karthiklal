"use client"

import Link from "next/link"
import { ArrowLeft, RotateCcw, TriangleAlert } from "lucide-react"

type ErrorFallbackProps = {
  error: Error & { digest?: string }
  reset: () => void
  title?: string
}

export default function ErrorFallback({
  error,
  reset,
  title = "Something went wrong",
}: ErrorFallbackProps) {
  return (
    <div className="relative flex min-h-[82vh] items-center justify-center overflow-hidden bg-background px-4 py-28">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/.28)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/.22)_1px,transparent_1px)] bg-[size:56px_56px]" />
      <section className="relative w-full max-w-3xl border-2 border-foreground bg-card p-7 shadow-2xl md:p-12">
        <div className="mb-8 flex items-center justify-between border-b border-border pb-4 font-mono text-[10px] font-black uppercase tracking-[0.2em]">
          <span>System recovery</span>
          <span className="flex items-center gap-2 text-red-500"><TriangleAlert className="h-4 w-4" /> Exception isolated</span>
        </div>
        <h1 className="max-w-2xl font-display text-4xl font-black uppercase leading-[.95] text-foreground md:text-7xl">
          {title}.
        </h1>
        <p className="mt-6 max-w-xl text-sm font-light leading-relaxed text-muted-foreground md:text-base">
          The issue has been contained to this route. Your other session data is safe; retry the component or return to a stable entry point.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            Reference: {error.digest}
          </p>
        )}
        <div className="mt-9 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-12 items-center gap-2 border-2 border-foreground bg-foreground px-5 font-mono text-[10px] font-bold uppercase tracking-widest text-background hover:bg-background hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" /> Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center gap-2 border-2 border-border px-5 font-mono text-[10px] font-bold uppercase tracking-widest text-foreground hover:border-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Return home
          </Link>
        </div>
      </section>
    </div>
  )
}
