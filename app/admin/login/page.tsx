"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Lock, User, ArrowRight, ShieldCheck, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ThemeToggleAnimated } from "@/components/theme-toggle-animated"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (res.ok) {
        router.push("/admin")
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || "INVALID CREDENTIALS")
      }
    } catch {
      setError("AN ERROR OCCURRED. PLEASE RETRY.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative font-mono text-xs uppercase selection:bg-primary selection:text-white">
      {/* Background Subtle Paper Grid Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40 pointer-events-none" />
      </div>

      {/* Top Bar Actions */}
      <div className="absolute top-6 left-6 right-6 z-50 flex items-center justify-between">
        <Link 
          href="/" 
          className="studio-text-link flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> BACK TO PORTFOLIO
        </Link>
        <ThemeToggleAnimated />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="paper-sheet border border-border/80 bg-card/90 dark:bg-card/80 backdrop-blur-md p-8 sm:p-10 shadow-xl space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-3 border-b border-border/70 pb-6">
            <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-2.5 py-1 text-primary font-bold text-[9px] uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" /> RESTRICTED ACCESS // CMS
            </div>

            <h1 className="editorial-heading text-3xl font-bold uppercase tracking-tight text-foreground">
              Sign In to <span className="studio-serif font-normal italic text-primary">curate.</span>
            </h1>
            <p className="text-muted-foreground text-xs normal-case font-sans">
              Enter your authentication credentials to access the portfolio CMS.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="studio-label text-[10px] text-muted-foreground font-bold">USERNAME</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-background/80 border border-border/80 pl-10 pr-4 py-2.5 text-foreground font-sans text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="studio-label text-[10px] text-muted-foreground font-bold">PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background/80 border border-border/80 pl-10 pr-4 py-2.5 text-foreground font-sans text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="text-destructive font-mono text-[11px] font-bold text-center border border-destructive/30 bg-destructive/10 p-2.5">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-foreground text-background font-mono text-xs font-bold uppercase tracking-wider hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 shadow-xs mt-2 disabled:opacity-50"
            >
              {isLoading ? "AUTHENTICATING..." : "SIGN IN TO DASHBOARD"} 
              <ArrowRight className="w-3.5 h-3.5 text-primary" />
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/80 mt-6 tracking-widest font-mono uppercase">
          &copy; {new Date().getFullYear()} KARTHIK LAL &mdash; STUDIO MANAGEMENT PORTAL
        </p>
      </motion.div>
    </main>
  )
}
