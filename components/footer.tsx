import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { PUBLIC_SOCIAL_LINKS } from "@/lib/static-data"

const footerLinks = [
  ["Home", "/"], ["About", "/#about"], ["Projects", "/projects"],
  ["Services", "/#services"],
  ["Blog", "/#journal"], ["Stories", "/stories"], ["Contact", "/contact"],
] as const

export default function Footer() {
  return (
    <footer className="editorial-footer">
      <div className="footer-panel">
        <div className="section-container">
          <div className="footer-columns">
            <div className="footer-contact">
              <Link href="/" className="contact-signature" aria-label="Karthik Lal home" />
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
        <div className="footer-wordmark-mask" aria-hidden="true">
          <div className="footer-wordmark">
            <div className="footer-marquee">
              {Array.from({ length: 8 }, (_, index) => (
                <span key={index}>Karthik Lal<i>✳</i></span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
