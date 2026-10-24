import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { PUBLIC_SOCIAL_LINKS } from "@/lib/static-data"
import EditorialHeading from "@/components/ui/editorial-heading"

export default function Footer() {
  return <footer className="editorial-footer"><div className="section-container">
    <div className="footer-top"><div><p className="studio-label">THE NEXT CHAPTER</p><EditorialHeading as="h2" title="Have something in mind?" accent="Let’s talk." /></div><Link href="/contact" className="studio-text-link">START A CONVERSATION <ArrowUpRight size={18} /></Link></div>
    <div className="footer-columns"><div><p className="footer-name">Karthik Lal</p><p className="footer-description">IT management, cybersecurity, and thoughtful digital experiences.</p><a href="mailto:contact@karthiklal.in" className="studio-text-link">contact@karthiklal.in <ArrowUpRight size={16} /></a></div><nav aria-label="Footer navigation"><p className="studio-label">EXPLORE</p>{[["Home","/"],["About","/#about"],["Projects","/projects"],["Services","/#services"],["Designs","/#portfolio-gallery"],["Blog","/blog"],["Stories","/stories"],["Contact","/contact"]].map(([label,href]) => <Link key={href} href={href}>{label}</Link>)}</nav><div><p className="studio-label">ELSEWHERE</p><div className="footer-socials">{PUBLIC_SOCIAL_LINKS.map(link => <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer">{link.name}<ArrowUpRight size={14} aria-hidden="true" /></a>)}</div></div></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Karthik Lal</span><nav aria-label="Legal"><Link href="/privacy-policy">Privacy</Link><Link href="/cookies">Cookies</Link><Link href="/terms">Terms</Link></nav></div>
  </div></footer>
}
