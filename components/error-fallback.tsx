"use client"

import Link from "next/link"

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
    <main className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-24">
      <section className="w-full max-w-2xl border-2 border-foreground bg-card p-8 md:p-12">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          SYSTEM RECOVERY
        </p>
        <h1 className="font-display text-4xl font-black uppercase text-foreground md:text-6xl">
          {title}
        </h1>
        <p className="mt-5 text-muted-foreground">
          This part of the site could not be loaded. You can retry safely or return home.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            Reference: {error.digest}
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="border-2 border-foreground bg-foreground px-5 py-3 font-mono text-xs font-bold uppercase text-background"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border-2 border-border px-5 py-3 font-mono text-xs font-bold uppercase text-foreground"
          >
            Return home
          </Link>
        </div>
      </section>
    </main>
  )
}
