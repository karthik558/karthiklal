"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Lock, User, ArrowRight, Loader2 } from "lucide-react"
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
        // Refresh router and redirect to admin dashboard
        router.push("/admin")
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || "Invalid credentials")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(800px_circle_at_15%_15%,hsl(var(--primary)/0.08),transparent_65%),radial-gradient(600px_circle_at_85%_85%,hsl(var(--accent)/0.06),transparent_65%)] pointer-events-none" />

      {/* Theme Toggle in top right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggleAnimated />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="relative overflow-hidden bg-card/65 backdrop-blur-xl border border-border/80 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-primary/5 group">
          {/* Neon Top Border Highlight */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(350px_circle_at_50%_0%,hsl(var(--primary)/0.06),transparent_50%)]" />

          {/* Logo */}
          <div className="flex justify-center mb-8 relative z-10">
            <div className="relative w-16 h-16 transform hover:scale-110 transition-transform duration-500">
              <Image src="/logo-light.png" alt="Logo" fill className="dark:hidden object-contain drop-shadow-md" priority />
              <Image src="/logo-dark.png" alt="Logo" fill className="hidden dark:block object-contain drop-shadow-[0_0_15px_rgba(214,72,63,0.4)]" priority />
            </div>
          </div>

          <div className="text-center mb-8 relative z-10">
            <h1 className="text-2xl font-bold font-display tracking-tight text-foreground mb-2">Welcome Back</h1>
            <p className="text-sm text-muted-foreground">Sign in to access your portfolio dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 relative z-10">
            <div className="space-y-1">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground/60 group-focus-within:text-primary transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-background/40 border border-border/70 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/60 transition-all text-foreground placeholder:text-muted-foreground/50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground/60 group-focus-within:text-primary transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-background/40 border border-border/70 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/60 transition-all text-foreground placeholder:text-muted-foreground/50"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-destructive text-sm font-medium text-center bg-destructive/10 py-2.5 rounded-lg border border-destructive/20"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] py-3.5 rounded-xl font-bold transition-all duration-300 disabled:opacity-70 disabled:pointer-events-none overflow-hidden group/btn"
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8 font-medium">
          &copy; {new Date().getFullYear()} Karthik Lal. Secure Area.
        </p>
      </motion.div>
    </div>
  )
}
