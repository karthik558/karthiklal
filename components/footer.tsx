import Link from "next/link"
import Image from "next/image"
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
      <div className="section-container">
        <div className="footer-columns">
          <div className="footer-contact">
            <Link href="/" className="footer-logo inline-block mb-6 transition-opacity hover:opacity-85" aria-label="Karthik Lal Home">
              <Image
                src="/logo/logo.webp?v=3"
                alt="Karthik Lal"
                width={184}
                height={118}
                unoptimized
                className="w-28 sm:w-32 md:w-36 h-auto object-contain"
              />
            </Link>
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
      <div className="footer-wordmark-mask" aria-hidden="true">
        <div className="footer-wordmark">
          <div className="footer-marquee">
            <span>Karthik Lal<i>✳</i></span>
            <span>Karthik Lal<i>✳</i></span>
          </div>
        </div>
      </div>
    </footer>
  )
}
