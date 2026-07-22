"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Lock, User, ArrowRight, Loader2, ShieldCheck } from "lucide-react"
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
    } catch (err) {
      setError("AN ERROR OCCURRED. PLEASE RETRY.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative font-mono text-xs uppercase">
      {/* Background Stark Grid Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-70 pointer-events-none" />
      </div>

      {/* Theme Toggle in top right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggleAnimated />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="border-2 border-foreground bg-card p-8 sm:p-10 shadow-2xl space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-3 border-b-2 border-border pb-6">
            <div className="inline-flex items-center gap-2 border border-border bg-background px-3 py-1 font-bold text-[10px] uppercase">
              <ShieldCheck className="w-3.5 h-3.5" /> RESTRICTED ACCESS
            </div>

            <h1 className="font-display text-3xl font-black uppercase tracking-tight text-foreground">
              ADMINISTRATOR
            </h1>
            <p className="text-muted-foreground text-xs">
              SECURE PORTAL AUTHENTICATION
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block uppercase tracking-wider text-muted-foreground mb-2">USERNAME</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-background border-2 border-border pl-10 pr-4 py-3 text-foreground focus:outline-none focus:border-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block uppercase tracking-wider text-muted-foreground mb-2">PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border-2 border-border pl-10 pr-4 py-3 text-foreground focus:outline-none focus:border-foreground"
                />
              </div>
            </div>

            {error && (
              <div className="text-destructive font-bold text-center border border-destructive/40 bg-destructive/10 p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-foreground text-background font-bold uppercase tracking-wider border border-foreground hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? "AUTHENTICATING..." : "SIGN IN TO DASHBOARD"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-muted-foreground mt-6 uppercase tracking-widest font-mono">
          © {new Date().getFullYear()} KARTHIK LAL // SECURE ADMIN PORTAL
        </p>
      </motion.div>
    </main>
  )
}

