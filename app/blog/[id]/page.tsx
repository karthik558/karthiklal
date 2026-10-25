import PageIntro from "@/components/ui/page-intro"
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ShareButton } from "@/components/blog/share-button"
import blogsData from "@/public/data/blogs.json"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: ContentBlock[]
  author: string
  date: string
  category: string
  tags: string[]
  image: string
  readTime: string
  featured: boolean
  repository?: string
}

interface ContentBlock {
  type: 'paragraph' | 'heading' | 'image' | 'code' | 'list' | 'quote'
  text?: string
  level?: number
  src?: string
  alt?: string
  caption?: string
  language?: string
  code?: string
  items?: string[]
}

const blogs = blogsData.blogs as BlogPost[]

export const dynamicParams = false

export function generateStaticParams() {
  return blogs.map((blog) => ({ id: blog.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const post = blogs.find(post => post.id === id)
  return post ? { title: post.title, description: post.excerpt, openGraph: { title: post.title, description: post.excerpt, type: "article", images: [post.image] } } : {}
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const blog = blogs.find((candidate) => candidate.id === id)

  const renderContentBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p key={index} className="text-muted-foreground leading-relaxed mb-6">
            {block.text}
          </p>
        )

      case 'heading':
        const headingClasses = {
          1: "text-3xl md:text-4xl font-bold mb-6 mt-8",
          2: "text-2xl md:text-3xl font-bold mb-4 mt-8",
          3: "text-xl md:text-2xl font-semibold mb-4 mt-6",
          4: "text-lg md:text-xl font-semibold mb-3 mt-6"
        }
        const className = headingClasses[block.level as keyof typeof headingClasses] || headingClasses[2]

        if (block.level === 1) {
          return <h2 id={`section-${index}`} key={index} className={className}>{block.text}</h2>
        } else if (block.level === 3) {
          return <h3 id={`section-${index}`} key={index} className={className}>{block.text}</h3>
        } else if (block.level === 4) {
          return <h4 id={`section-${index}`} key={index} className={className}>{block.text}</h4>
        } else {
          return <h2 id={`section-${index}`} key={index} className={className}>{block.text}</h2>
        }

      case 'image':
        return (
          <div key={index} className="my-8">
            <div className="relative rounded-lg overflow-hidden shadow-lg group/contentimg">
              <Image
                src={block.src || '/placeholder.svg'}
                alt={block.alt || ''}
                width={800}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
            {block.caption && (
              <p className="text-sm text-muted-foreground text-center mt-2 italic">
                {block.caption}
              </p>
            )}
          </div>
        )

      case 'code':
        return (
          <div key={index} className="my-6">
            <pre className="bg-muted rounded-lg p-4 overflow-x-auto">
              <code className={`language-${block.language || 'text'} text-sm`}>
                {block.code}
              </code>
            </pre>
          </div>
        )

      case 'list':
        return (
          <ul key={index} className="list-disc list-inside space-y-2 mb-6 text-muted-foreground">
            {block.items?.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        )

      case 'quote':
        return (
          <blockquote key={index} className="article-pullquote">
            <p className="text-foreground italic text-base">&ldquo;{block.text}&rdquo;</p>
          </blockquote>
        )

      default:
        return null
    }
  }

  if (!blog) notFound()
  const headings = blog.content.map((block,index) => ({...block,index})).filter(block => block.type === "heading")
  const related = blogs.filter(post => post.id !== blog.id).sort((a,b) => Number(b.category === blog.category)-Number(a.category === blog.category) || Date.parse(b.date)-Date.parse(a.date)).slice(0,2)

  return <div className="article-page page-shell"><div className="section-container">
    <Link href="/blog" className="studio-text-link page-back"><ArrowLeft size={15} /> BACK TO ALL ARTICLES</Link>
    <article>
      <PageIntro label={`THE JOURNAL / ${blog.category}`} title={blog.title} description={blog.excerpt} />
      <div className="article-meta"><span>{blog.author}</span><time dateTime={blog.date}>{new Date(blog.date).toLocaleDateString('en-US', { year:'numeric',month:'short',day:'numeric',timeZone:'UTC' })}</time><span>{blog.readTime}</span>{blog.repository && <a href={blog.repository} target="_blank" rel="noopener noreferrer" className="studio-text-link"><Github size={15} /> View source repository</a>}</div>
      <div className="article-cover"><Image src={blog.image} alt={blog.title} fill sizes="(min-width:1280px) 1200px, 100vw" className="object-cover" priority /></div>
      <div className="article-reading-layout">
        <aside className="article-contents"><p className="studio-label">IN THIS ARTICLE</p><nav aria-label="Table of contents">{headings.map(block => <a key={block.index} href={`#section-${block.index}`}>{block.text}</a>)}</nav><p className="studio-label">WRITTEN BY<br />{blog.author}</p></aside>
        <div className="article-prose"><div className="article-body">{blog.content.map((block,index) => renderContentBlock(block,index))}</div><div className="article-tags">{blog.tags.map(tag => <span key={tag}>#{tag}</span>)}</div></div>
      </div>
      <footer className="article-share"><ShareButton title={blog.title} excerpt={blog.excerpt} /><Link href="/blog" className="studio-text-link">VIEW ALL ARTICLES <ArrowUpRight size={16} /></Link></footer>
    </article>
    <section className="article-related"><p className="studio-label">KEEP EXPLORING</p><h2>Another rabbit hole.</h2><div>{related.map(post => <Link key={post.id} href={`/blog/${post.id}`}><span className="studio-label">{post.category} / {post.readTime}</span><h3>{post.title} ↗</h3></Link>)}</div></section>
  </div></div>
}
