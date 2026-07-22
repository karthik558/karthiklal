"use client"

import Link from "next/link"
import { ArrowUp, Github, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="relative bg-background border-t-2 border-foreground pt-16 pb-12 overflow-hidden">
      
      {/* Background Stroke Typography for Depth */}
      <div className="absolute inset-x-0 bottom-6 pointer-events-none select-none overflow-hidden text-center opacity-[0.07] z-0">
        <span
          className="font-display text-[18vw] font-black uppercase tracking-tighter text-transparent leading-none whitespace-nowrap block"
          style={{
            WebkitTextStroke: "2px hsl(var(--foreground))",
            WebkitTextFillColor: "transparent",
          }}
        >
          KARTHIK LAL
        </span>
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        
        {/* Minimal Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-border font-mono text-xs">
          
          {/* Brand Name */}
          <div className="md:col-span-5 space-y-2">
            <div className="font-display text-4xl font-black uppercase tracking-tighter text-foreground">
              KARTHIK LAL
            </div>
            <div className="text-muted-foreground uppercase tracking-widest text-[11px]">
              IT MANAGER & CYBERSECURITY SPECIALIST
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="font-bold uppercase tracking-widest text-foreground border-b border-border pb-2">
              NAVIGATION
            </div>
            <ul className="space-y-2 uppercase text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">00 // HOME</Link></li>
              <li><Link href="/#about" className="hover:text-foreground transition-colors">01 // ABOUT</Link></li>
              <li><Link href="/projects" className="hover:text-foreground transition-colors">02 // PROJECTS</Link></li>
              <li><Link href="/#services" className="hover:text-foreground transition-colors">03 // SERVICES</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">04 // CONTACT</Link></li>
            </ul>
          </div>

          {/* Connect & Socials */}
          <div className="md:col-span-4 space-y-3">
            <div className="font-bold uppercase tracking-widest text-foreground border-b border-border pb-2">
              CONNECT
            </div>
            <a
              href="mailto:dev@karthiklal.in"
              className="inline-block font-bold text-foreground hover:underline text-sm uppercase"
            >
              dev@karthiklal.in
            </a>

            <div className="flex flex-wrap gap-2 pt-2">
              {[
                { name: "GITHUB", href: "https://github.com/karthik558" },
                { name: "LINKEDIN", href: "https://linkedin.com/in/karthiklal" },
                { name: "X / TWITTER", href: "https://x.com/_karthiklal" },
                { name: "BEHANCE", href: "https://behance.net/karthiklal" },
              ].map((link) => (
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
        </div>
      </div>
    </footer>
  )
}


