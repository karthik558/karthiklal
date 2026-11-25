"use client"

import PageIntro from "@/components/ui/page-intro"
import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"

export interface LegalNavItem {
  number: string
  label: string
  href: string
}

export function LegalPage({
  title,
  outlinedTitle,
  lastUpdated,
  navItems,
  children,
}: {
  title: string
  outlinedTitle: string
  lastUpdated: string
  navItems: LegalNavItem[]
  children: ReactNode
}) {
  return (
    <div className="page-shell">
      <div className="section-container">
        <Link href="/" className="studio-text-link page-back">
          <ArrowLeft size={15} aria-hidden="true" /> BACK TO HOME
        </Link>

        <PageIntro title={title} accent={outlinedTitle} />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-28 space-y-6">
              <div className="border-t border-border pt-4">
                <p className="studio-label mb-3">DOCUMENT DETAILS</p>
                <dl className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <dt className="registry-kicker">VERSION</dt>
                    <dd className="mt-1 font-medium text-foreground">01.00</dd>
                  </div>
                  <div>
                    <dt className="registry-kicker">UPDATED</dt>
                    <dd className="mt-1 font-medium text-foreground">{lastUpdated}</dd>
                  </div>
                </dl>
              </div>

              <div className="border-t border-border pt-4">
                <p className="studio-label mb-3">ON THIS PAGE</p>
                <nav aria-label="On this page" className="divide-y divide-border border-y border-border">
                  {navItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="group flex min-h-11 items-center justify-between gap-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <span>
                        <span className="mr-3 font-mono text-xs text-primary">{item.number}</span>
                        {item.label}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          <div className="space-y-14 lg:col-span-9 lg:space-y-16">
            {children}
          </div>
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
    <section id={id} className="scroll-mt-32 border-t border-border pt-8 first:border-t-0 first:pt-0">
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-2">
          <span className="font-mono text-xs text-primary">{number}</span>
        </div>
        <div className="md:col-span-10">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h2>
          {intro && <p className="mt-3 text-base leading-7 text-muted-foreground">{intro}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </section>
  )
}

export function LegalGrid({ children, columns = 2 }: { children: ReactNode; columns?: 2 | 3 }) {
  return (
    <div className={`grid gap-4 ${columns === 3 ? "md:grid-cols-3" : "sm:grid-cols-2"}`}>
      {children}
    </div>
  )
}

export function LegalCard({ title, children, tag }: { title: string; children: ReactNode; tag?: string }) {
  return (
    <article className="border border-border bg-card/60 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-lg font-semibold tracking-tight text-foreground sm:text-xl">{title}</h3>
        {tag && <span className="registry-kicker shrink-0 text-primary">{tag}</span>}
      </div>
      <div className="mt-2.5 text-sm leading-6 text-muted-foreground">{children}</div>
    </article>
  )
}

export function LegalList({ items }: { items: Array<{ title?: string; text: string }> }) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {items.map((item, index) => (
        <li key={`${item.title ?? "item"}-${index}`} className="grid gap-2 py-4 sm:grid-cols-[2.25rem_1fr]">
          <span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>
          <div className="text-sm leading-6 text-muted-foreground">
            {item.title && <strong className="mb-1 block font-display text-base font-semibold text-foreground">{item.title}</strong>}
            {item.text}
          </div>
        </li>
      ))}
    </ul>
  )
}

export function LegalContact({ subject }: { subject: string }) {
  return (
    <div className="page-endnote">
      <div>
        <p>Questions about {subject}?</p>
        <span className="mt-2 block text-sm text-muted-foreground">
          Contact me if you need clarification about this document or want to exercise a related right.
        </span>
      </div>
      <a href="mailto:contact@karthiklal.in" className="studio-text-link shrink-0">
        EMAIL ME <ArrowUpRight size={16} aria-hidden="true" />
      </a>
    </div>
  )
}
