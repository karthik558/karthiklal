"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowUpRight, Mail } from "lucide-react"

export interface LegalNavItem {
  number: string
  label: string
  href: string
}

const reveal = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
}

export function LegalPage({
  documentNumber,
  title,
  outlinedTitle,
  description,
  lastUpdated,
  navItems,
  children,
}: {
  documentNumber: string
  title: string
  outlinedTitle: string
  description: string
  lastUpdated: string
  navItems: LegalNavItem[]
  children: ReactNode
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background pb-24 pt-32 sm:pt-36 lg:pt-40">
      <div className="pointer-events-none absolute inset-0 select-none">
        <div className="absolute inset-x-0 top-0 h-[720px] bg-[linear-gradient(to_right,hsl(var(--border)/0.22)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.18)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="bg-noise absolute inset-x-0 top-0 h-[720px] opacity-20" />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-foreground pb-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground sm:text-xs"
        >
          <span>Legal archive // {documentNumber}</span>
          <span className="flex items-center gap-2 text-foreground">
            <span className="h-2 w-2 bg-foreground" />
            Public document
          </span>
        </motion.div>

        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="border-b border-border py-12 sm:py-16 lg:py-20"
        >
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-muted-foreground sm:text-xs">
                Karthik Lal // Legal & trust
              </p>
              <h1 className="font-display text-[15vw] font-black uppercase leading-[0.78] tracking-[-0.075em] text-foreground sm:text-[6.5rem] lg:text-[8.2rem] xl:text-[9.5rem]">
                <span className="block">{title}</span>
                <span
                  className="block"
                  style={{
                    WebkitTextStroke: "clamp(1.5px, 0.15vw, 2.5px) hsl(var(--foreground))",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {outlinedTitle}
                </span>
              </h1>
            </div>

            <div className="lg:col-span-4 lg:pb-1">
              <p className="border-l-2 border-foreground pl-5 font-sans text-sm font-light leading-relaxed text-muted-foreground sm:pl-7 sm:text-base">
                {description}
              </p>
              <dl className="mt-8 grid grid-cols-2 border-l border-t border-border font-mono text-[10px] uppercase tracking-wider">
                <div className="border-b border-r border-border p-4">
                  <dt className="text-muted-foreground">Version</dt>
                  <dd className="mt-2 font-bold text-foreground">01.00</dd>
                </div>
                <div className="border-b border-r border-border p-4">
                  <dt className="text-muted-foreground">Updated</dt>
                  <dd className="mt-2 font-bold text-foreground">{lastUpdated}</dd>
                </div>
              </dl>
            </div>
          </div>
        </motion.header>

        <div className="grid gap-12 py-10 lg:grid-cols-12 lg:gap-16 lg:py-16">
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18, duration: 0.5 }}
            className="lg:col-span-3"
          >
            <div className="lg:sticky lg:top-28">
              <Link
                href="/"
                className="group mb-8 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-foreground hover:underline"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to home
              </Link>

              <div className="border-t-2 border-foreground">
                <div className="border-b border-border py-4 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                  Document index
                </div>
                <nav aria-label="On this page">
                  {navItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="group flex items-center justify-between gap-4 border-b border-border py-4 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <span><span className="mr-3 text-foreground">{item.number}</span>{item.label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </motion.aside>

          <motion.div
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden"
            animate="show"
            className="space-y-14 lg:col-span-9 lg:space-y-20"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export function LegalSection({
  number,
  id,
  title,
  intro,
  children,
}: {
  number: string
  id: string
  title: string
  intro?: string
  children: ReactNode
}) {
  return (
    <motion.section variants={reveal} transition={{ duration: 0.5 }} id={id} className="scroll-mt-32 border-t-2 border-foreground pt-5">
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-3">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{number} {"//"}</span>
        </div>
        <div className="md:col-span-9">
          <h2 className="font-display text-3xl font-black uppercase leading-none tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          {intro && <p className="mt-5 text-sm font-light leading-7 text-muted-foreground sm:text-base">{intro}</p>}
          <div className="mt-7">{children}</div>
        </div>
      </div>
    </motion.section>
  )
}

export function LegalGrid({ children, columns = 2 }: { children: ReactNode; columns?: 2 | 3 }) {
  return <div className={`grid border-l border-t border-border ${columns === 3 ? "md:grid-cols-3" : "sm:grid-cols-2"}`}>{children}</div>
}

export function LegalCard({ title, children, tag }: { title: string; children: ReactNode; tag?: string }) {
  return (
    <article className="border-b border-r border-border bg-card/60 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-lg font-black uppercase tracking-tight text-foreground sm:text-xl">{title}</h3>
        {tag && <span className="shrink-0 border border-foreground px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-foreground">{tag}</span>}
      </div>
      <div className="mt-3 text-sm font-light leading-6 text-muted-foreground">{children}</div>
    </article>
  )
}

export function LegalList({ items }: { items: Array<{ title?: string; text: string }> }) {
  return (
    <ul className="border-t border-border">
      {items.map((item, index) => (
        <li key={`${item.title ?? "item"}-${index}`} className="grid gap-2 border-b border-border py-4 sm:grid-cols-[2rem_1fr]">
          <span className="font-mono text-[10px] font-bold text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
          <div className="text-sm font-light leading-6 text-muted-foreground">
            {item.title && <strong className="mb-1 block font-display text-base font-black uppercase text-foreground">{item.title}</strong>}
            {item.text}
          </div>
        </li>
      ))}
    </ul>
  )
}

export function LegalContact({ subject }: { subject: string }) {
  return (
    <motion.section variants={reveal} transition={{ duration: 0.5 }} className="border-2 border-foreground bg-foreground p-6 text-background sm:p-8">
      <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-background/60">Direct contact // Legal</p>
          <h2 className="mt-3 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">Questions about {subject}?</h2>
          <p className="mt-3 max-w-xl text-sm font-light leading-6 text-background/70">Contact me if you need clarification about this document or want to exercise a related right.</p>
        </div>
        <a
          href="mailto:dev@karthiklal.in"
          className="group inline-flex h-[52px] shrink-0 items-center justify-center gap-2 border-2 border-background bg-background px-5 font-mono text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          <Mail className="h-4 w-4" />
          Email me
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </motion.section>
  )
}
