import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { PUBLIC_SOCIAL_LINKS } from "@/lib/static-data"
import EditorialHeading from "@/components/ui/editorial-heading"

export default function Footer() {
  return <footer className="editorial-footer"><div className="section-container">
    <div className="footer-portrait-top">
      <div className="footer-portrait"><Image src="/user/about.jpg" alt="Portrait of Karthik Lal" fill sizes="(min-width: 700px) 240px, 140px" className="object-cover" /></div>
      <div className="footer-signature"><p className="studio-label">THE PERSON BEHIND THE WORK</p><EditorialHeading as="h2" title="Karthik Lal" accent="Always curious." /><p>Building, securing, and exploring the details that make a difference.</p><Link href="/contact" className="studio-text-link">GET IN TOUCH <ArrowUpRight size={18} /></Link></div>
      <span className="footer-mark" aria-hidden="true">✳</span>
    </div>
    <div className="footer-columns"><div><p className="studio-label">WORK &amp; COLLABORATION</p><p className="footer-description">IT management, cybersecurity, and thoughtful digital experiences.</p><a href="mailto:contact@karthiklal.in" className="studio-text-link">contact@karthiklal.in <ArrowUpRight size={16} /></a></div><nav aria-label="Footer navigation"><p className="studio-label">EXPLORE</p>{[["Home","/"],["About","/#about"],["Projects","/projects"],["Services","/#services"],["Designs","/#portfolio-gallery"],["Blog","/blog"],["Stories","/stories"],["Contact","/contact"]].map(([label,href]) => <Link key={href} href={href}>{label}</Link>)}</nav><div><p className="studio-label">ELSEWHERE</p><div className="footer-socials">{PUBLIC_SOCIAL_LINKS.map(link => <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer">{link.name}<ArrowUpRight size={14} aria-hidden="true" /></a>)}</div></div></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Karthik Lal</span><nav aria-label="Legal"><Link href="/privacy-policy">Privacy</Link><Link href="/cookies">Cookies</Link><Link href="/terms">Terms</Link></nav></div>
  </div></footer>
}
