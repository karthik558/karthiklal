import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { PUBLIC_SOCIAL_LINKS } from "@/lib/static-data"

const footerLinks = [
  ["Home", "/"], ["About", "/#about"], ["Projects", "/projects"],
  ["Services", "/#services"], ["Designs", "/#portfolio-gallery"],
  ["Blog", "/blog"], ["Stories", "/stories"], ["Contact", "/contact"],
] as const

export default function Footer() {
  return (
    <footer className="editorial-footer">
      <svg className="footer-wordmark" viewBox="0 0 1000 320" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <text x="-8" y="320" textLength="1016" lengthAdjust="spacingAndGlyphs">KARTHIK</text>
      </svg>
      <div className="section-container">
        <div className="footer-columns">
          <div className="footer-contact">
            <p className="studio-label">WORK &amp; COLLABORATION</p>
            <a href="mailto:contact@karthiklal.in" className="footer-email">
              <span>contact@karthiklal.in</span><ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
          <nav aria-label="Footer navigation">
            <p className="studio-label">EXPLORE</p>
            <div className="footer-links">
              {footerLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
            </div>
          </nav>
          <div>
            <p className="studio-label">ELSEWHERE</p>
            <div className="footer-socials">
              {PUBLIC_SOCIAL_LINKS.map(link => (
                <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer">
                  <span>{link.name}</span><ArrowUpRight size={14} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Karthik Lal</span>
          <nav aria-label="Legal">
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/cookies">Cookies</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
