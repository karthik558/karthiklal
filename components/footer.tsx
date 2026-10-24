import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { PUBLIC_SOCIAL_LINKS } from "@/lib/static-data"

export default function Footer() {
  return <footer className="editorial-footer">
    <div className="footer-wordmark" aria-hidden="true"><span>KARTHIK</span></div>
    <div className="section-container">
    <div className="footer-columns"><div><p className="studio-label">WORK &amp; COLLABORATION</p><p className="footer-description">IT management, cybersecurity, and thoughtful digital experiences.</p><a href="mailto:contact@karthiklal.in" className="studio-text-link">contact@karthiklal.in <ArrowUpRight size={16} /></a></div><nav aria-label="Footer navigation"><p className="studio-label">EXPLORE</p>{[["Home","/"],["About","/#about"],["Projects","/projects"],["Services","/#services"],["Designs","/#portfolio-gallery"],["Blog","/blog"],["Stories","/stories"],["Contact","/contact"]].map(([label,href]) => <Link key={href} href={href}>{label}</Link>)}</nav><div><p className="studio-label">ELSEWHERE</p><div className="footer-socials">{PUBLIC_SOCIAL_LINKS.map(link => <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer">{link.name}<ArrowUpRight size={14} aria-hidden="true" /></a>)}</div></div></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Karthik Lal</span><nav aria-label="Legal"><Link href="/privacy-policy">Privacy</Link><Link href="/cookies">Cookies</Link><Link href="/terms">Terms</Link></nav></div>
  </div></footer>
}
