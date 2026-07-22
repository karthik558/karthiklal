"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowUpRight, Home, Mail, MoveUpRight } from "lucide-react"

const directoryLinks = [
  { index: "01", label: "Home", description: "Back to the beginning", href: "/" },
  { index: "02", label: "Projects", description: "Browse selected work", href: "/projects" },
  { index: "03", label: "Blog", description: "Read notes and ideas", href: "/blog" },
  { index: "04", label: "Contact", description: "Start a conversation", href: "/contact" },
]

export default function NotFoundPage() {
  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back()
      return
    }

    window.location.assign("/")
  }

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-background pb-16 pt-32 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40">
      <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.26)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.22)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
        <div className="bg-noise absolute inset-0 opacity-25" />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex items-center justify-between gap-3 border-b-2 border-foreground pb-4 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground sm:text-xs sm:tracking-[0.24em]"
        >
          <span>Error directory // 404</span>
          <span className="flex items-center gap-2 text-foreground">
            <span className="h-2 w-2 animate-pulse bg-foreground" />
            Route unavailable
          </span>
        </motion.div>

        <div className="grid gap-10 border-b border-border py-10 lg:grid-cols-12 lg:items-end lg:gap-8 lg:py-14">
          <div className="lg:col-span-8">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.5 }}
              className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground"
            >
              This address leads nowhere
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[28vw] font-black uppercase leading-[0.72] tracking-[-0.09em] text-foreground sm:text-[24vw] lg:text-[15rem] xl:text-[17rem]"
              aria-label="Error 404"
            >
              <span>4</span>
              <span
                className="inline-block"
                style={{
                  WebkitTextStroke: "clamp(1.5px, 0.2vw, 3px) hsl(var(--foreground))",
                  WebkitTextFillColor: "transparent",
                }}
              >
                0
              </span>
              <span>4</span>
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.55 }}
            className="lg:col-span-4 lg:pb-1"
          >
            <div className="border-l-2 border-foreground pl-5 sm:pl-7">
              <h2 className="font-display text-3xl font-black uppercase leading-none tracking-tight text-foreground sm:text-4xl">
                Page not found.
              </h2>
              <p className="mt-5 max-w-md font-sans text-sm font-light leading-relaxed text-muted-foreground sm:text-base">
                The page may have moved, the link may be outdated, or the address may be mistyped. Choose a destination below and keep exploring.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link
                href="/"
                className="group inline-flex h-[52px] items-center justify-center gap-2 border-2 border-foreground bg-foreground px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-background transition-colors hover:bg-background hover:text-foreground"
              >
                <Home className="h-4 w-4" />
                Return home
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <button
                type="button"
                onClick={handleGoBack}
                className="group inline-flex h-[52px] items-center justify-center gap-2 border-2 border-border bg-card px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Go back
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.55 }}
          className="pt-8"
        >
          <div className="mb-4 flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground sm:text-xs">
            <span>Available destinations</span>
            <span>04 routes</span>
          </div>

          <div className="grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-4">
            {directoryLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative min-h-32 border-b border-r border-border bg-card/70 p-5 transition-colors duration-300 hover:bg-foreground sm:min-h-36"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[10px] font-bold text-muted-foreground transition-colors group-hover:text-background/60">
                    {item.index} //
                  </span>
                  <MoveUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-background" />
                </div>
                <div className="mt-7">
                  <h3 className="font-display text-xl font-black uppercase tracking-tight text-foreground transition-colors group-hover:text-background sm:text-2xl">
                    {item.label}
                  </h3>
                  <p className="mt-1 font-sans text-xs text-muted-foreground transition-colors group-hover:text-background/65">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>Karthik Lal // Portfolio system</span>
            <a
              href="mailto:dev@karthiklal.in"
              className="inline-flex items-center gap-2 font-bold text-foreground hover:underline"
            >
              <Mail className="h-3.5 w-3.5" />
              Report a broken link
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
