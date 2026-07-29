"use client"

import Link from "next/link"
import Image from "next/image"
import { PUBLIC_SOCIAL_LINKS } from "@/lib/static-data"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-background border-t-2 border-foreground pt-16 pb-12 overflow-hidden">

      {/* Background Typography for Depth - Identical to Hero Section Design */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-15 dark:opacity-20">
        <div className="flex flex-nowrap items-center justify-center whitespace-nowrap font-display text-[15vw] sm:text-[17vw] md:text-[20vw] font-black uppercase tracking-tighter leading-none select-none">
          <span className="text-foreground">KARTHIK</span>
          <span className="inline-block w-[0.25em]" />
          <span
            style={{
              WebkitTextStroke: "2.5px hsl(var(--foreground))",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            LAL
          </span>
        </div>
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6">

        {/* Minimal Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-border font-mono text-xs">

          {/* Brand Name & Logo */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3.5">
              <Link href="/" className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 block transition-transform duration-300 hover:scale-105" aria-label="Home">
                <Image
                  src="/logo-dark.png?v=3"
                  alt="Karthik Lal Logo"
                  width={64}
                  height={64}
                  className="h-full w-full object-contain theme-logo-dark"
                  unoptimized
                />
                <Image
                  src="/logo-light.png?v=3"
                  alt="Karthik Lal Logo"
                  width={64}
                  height={64}
                  className="h-full w-full object-contain theme-logo-light"
                  unoptimized
                />
              </Link>
              <div>
                <div className="font-display text-3xl font-black uppercase tracking-tighter text-foreground leading-none">
                  KARTHIK LAL
                </div>
                <div className="text-muted-foreground uppercase tracking-widest text-[10px] mt-1">
                  IT MANAGER & CYBERSECURITY SPECIALIST
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="font-bold uppercase tracking-widest text-foreground border-b border-border pb-2">
              NAVIGATION
            </div>
            <ul className="space-y-2 uppercase text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">HOME</Link></li>
              <li><Link href="/#about" className="hover:text-foreground transition-colors">ABOUT</Link></li>
              <li><Link href="/projects" className="hover:text-foreground transition-colors">PROJECTS</Link></li>
              <li><Link href="/#services" className="hover:text-foreground transition-colors">SERVICES</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">CONTACT</Link></li>
            </ul>
          </div>

          {/* Connect & Socials */}
          <div className="md:col-span-4 space-y-3">
            <div className="font-bold uppercase tracking-widest text-foreground border-b border-border pb-2">
              CONNECT
            </div>
            <a
              href="mailto:contact@karthiklal.in"
              className="inline-block font-bold text-foreground hover:underline text-sm uppercase"
            >
              contact@karthiklal.in
            </a>

            <div className="flex flex-wrap gap-2 pt-2">
              {PUBLIC_SOCIAL_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 border border-border bg-card text-foreground hover:border-foreground transition-colors uppercase text-[10px] font-bold"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-muted-foreground uppercase">
          <div>
            © {currentYear} KARTHIK LAL // ALL RIGHTS RESERVED
          </div>
          <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link href="/privacy-policy" className="transition-colors hover:text-foreground">Privacy</Link>
            <Link href="/cookies" className="transition-colors hover:text-foreground">Cookies</Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">Terms</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
