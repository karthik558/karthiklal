import SectionHeading from "@/components/sections/section-heading"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import data from "@/public/data/blogs.json"
export default function JournalSection() {
  const posts = [...data.blogs].sort((a,b) => Date.parse(b.date)-Date.parse(a.date)).slice(0,3)
  return <section className="section-shell journal-preview" id="journal"><div className="section-container"><div className="section-heading-row"><div>
            <SectionHeading number="10" label="WRITING &amp; NOTES" title="Thinking in" accent="public." /></div><Link className="studio-text-link" href="/blog">EXPLORE THE JOURNAL <ArrowUpRight size={18}/></Link></div><div className="journal-grid">{posts.map(post => <Link key={post.id} href={`/blog/${post.id}`} className="journal-card"><div className="journal-card-image group/img"><Image src={post.image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover grayscale contrast-125 transition-all duration-500 group-hover/img:grayscale-0 group-hover/img:contrast-100 group-hover/img:scale-105"/></div><p className="studio-label">{post.category} / {post.readTime}</p><h3>{post.title}</h3><span className="studio-text-link">READ THE STORY <ArrowUpRight size={16}/></span></Link>)}</div></div></section>
}
