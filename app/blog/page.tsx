"use client"
import EditorialHeading from "@/components/ui/editorial-heading"
import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Search, X } from "lucide-react"
import data from "@/public/data/blogs.json"
const posts = [...data.blogs].sort((a,b) => Date.parse(b.date)-Date.parse(a.date))
const categories = ["All", ...new Set(posts.map(p => p.category))]
const date = (value: string) => new Date(value).toLocaleDateString("en-US", {month:"short",day:"numeric",year:"numeric",timeZone:"UTC"})
export default function BlogPage() {
  const [query,setQuery] = useState("")
  const [category,setCategory] = useState("All")
  const filtered = useMemo(() => posts.filter(p => (category === "All" || p.category === category) && `${p.title} ${p.excerpt} ${p.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase().trim())), [query,category])
  const filtering = query.trim() !== "" || category !== "All"
  const featured = posts.find(p => p.featured) || posts[0]
  const visible = filtering ? filtered : filtered.filter(p => p.id !== featured?.id)
  return <div className="studio-journal section-container">
    <header className="journal-masthead"><p className="studio-label">THE JOURNAL / BY KARTHIK LAL</p><EditorialHeading title="Notes from" accent="the workbench." /><div><p>Things I build. Problems I untangle.<br />Field notes on security, software, and the craft of making.</p><span className="studio-label">{posts.length} ARTICLES & COUNTING</span></div></header>
    {!filtering && featured && <Link href={`/blog/${featured.id}`} className="journal-feature"><div className="journal-feature-image"><Image src={featured.image} alt="" fill priority sizes="(min-width: 900px) 60vw, 100vw" className="object-cover"/></div><div className="journal-feature-copy"><p className="studio-label">EDITOR’S PICK / {featured.category}</p><h2>{featured.title}</h2><p>{featured.excerpt}</p><div className="studio-label">{date(featured.date)} · {featured.readTime}</div><span className="studio-text-link">READ ARTICLE <ArrowUpRight size={20}/></span></div></Link>}
    <section aria-label="Browse articles" className="journal-browse"><div className="journal-toolbar"><h2>All dispatches<span> / {posts.length.toString().padStart(2,"0")}</span></h2><div className="journal-search"><Search size={18} aria-hidden="true"/><input aria-label="Search articles or tags" placeholder="Search articles or tags" value={query} onChange={e => setQuery(e.target.value)}/>{query && <button aria-label="Clear search" onClick={() => setQuery("")}><X size={16}/></button>}</div></div><div className="journal-filters">{categories.map(c => <button key={c} aria-pressed={category===c} onClick={() => setCategory(c)}>{c}</button>)}</div>
    <p role="status" className="studio-label journal-results">{filtered.length} {filtered.length===1 ? "article" : "articles"}{filtering ? " found" : " in the journal"}</p>
    <div className="journal-grid">{visible.map(post => <article key={post.id} className="journal-card"><Link href={`/blog/${post.id}`} className="journal-card-image" aria-label={`Read ${post.title}`}><Image src={post.image} alt="" fill sizes="(min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw" className="object-cover"/></Link><p className="studio-label">{post.category} · {post.readTime}</p><h3><Link href={`/blog/${post.id}`}>{post.title}</Link></h3><p className="journal-excerpt">{post.excerpt}</p><Link href={`/blog/${post.id}`} className="journal-card-bottom"><time dateTime={post.date}>{date(post.date)}</time><ArrowUpRight size={20}/><span className="sr-only">Read {post.title}</span></Link></article>)}</div>
    {filtered.length===0 && <div className="journal-empty"><h2>No notes on that. Yet.</h2><p>Try another topic or clear your filters to explore the journal.</p><button className="studio-text-link" onClick={() => {setQuery("");setCategory("All")}}>RESET FILTERS <ArrowUpRight size={18}/></button></div>}
    </section><div className="journal-endnote"><span aria-hidden="true">✳</span><p>Always learning.<br /><em>Occasionally writing it down.</em></p><Link href="/contact" className="studio-text-link">LET’S EXCHANGE IDEAS <ArrowUpRight size={18}/></Link></div>
  </div>
}
