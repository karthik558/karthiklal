"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, ArrowLeft, Terminal, LayoutGrid, Mail, Compass } from "lucide-react"

export default function NotFoundPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = "/"
    }
  }

  const navLinks = [
    { name: "Home", icon: Home, href: "/", color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Projects", icon: LayoutGrid, href: "/projects", color: "text-purple-500", bg: "bg-purple-500/10" },
    { name: "Blog", icon: Terminal, href: "/blog", color: "text-green-500", bg: "bg-green-500/10" },
    { name: "Contact", icon: Mail, href: "/contact", color: "text-orange-500", bg: "bg-orange-500/10" },
  ]

  return (
    <div className="relative min-h-[100dvh] bg-background flex flex-col items-center justify-center overflow-hidden selection:bg-primary/30">
      
      {/* Interactive Spotlight Background */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 600px at ${mousePosition.x}px ${mousePosition.y}px, hsl(var(--primary) / 0.05), transparent 80%)`,
        }}
      />

      {/* Massive Background 404 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.03, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-black tracking-tighter text-foreground whitespace-nowrap pointer-events-none z-0"
      >
        404
      </motion.div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-6 mx-auto text-center space-y-10">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border text-sm font-medium text-muted-foreground shadow-sm"
        >
          <Compass className="w-4 h-4 text-primary animate-pulse" />
          <span>Looks like you wandered off the map</span>
        </motion.div>

        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl font-black tracking-tight"
          >
            Page Not Found
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto"
          >
            The digital coordinates you entered don't exist in this universe. Let's get you back to familiar territory.
          </motion.p>
        </div>

        {/* Quick Links Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full pt-6"
        >
          {navLinks.map((link, idx) => {
            const Icon = link.icon
            return (
              <Link key={link.name} href={link.href} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                <div className="relative flex flex-col items-center justify-center gap-3 p-6 h-full rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 group-hover:-translate-y-1">
                  <div className={`p-3 rounded-xl ${link.bg} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className={`w-6 h-6 ${link.color}`} />
                  </div>
                  <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {link.name}
                  </span>
                </div>
              </Link>
            )
          })}
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="pt-8"
        >
          <button
            onClick={handleGoBack}
            className="group flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Go Back to Previous Page
          </button>
        </motion.div>

      </div>
    </div>
  )
}