"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getModelIcon } from "@/lib/admin-utils"
import { ThemeToggleAnimated } from "@/components/theme-toggle-animated"

const modelGroups = [
  {
    kicker: "01 / PORTFOLIO WORK",
    models: ["projects", "featured-designs", "stories", "blogs"]
  },
  {
    kicker: "02 / EXPERTISE & EXPERIENCE",
    models: ["services", "skills", "experiences", "certifications"]
  },
  {
    kicker: "03 / IDENTITY & COMMUNITY",
    models: ["profile", "socials", "testimonials"]
  }
]

export default function AdminSidebar({ models }: { models: string[] }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const closeFrame = requestAnimationFrame(() => setMobileOpen(false))
    return () => cancelAnimationFrame(closeFrame)
  }, [pathname])

  // Collect any models not in the predefined groups
  const knownModels = new Set(modelGroups.flatMap(g => g.models))
  const extraModels = models.filter(m => !knownModels.has(m))

  return (
    <>
      {/* Mobile Trigger Floating Button */}
      <button 
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 px-4 py-3 border border-border/80 bg-card/95 text-foreground font-mono text-[11px] font-bold uppercase tracking-wider shadow-xl backdrop-blur-md flex items-center gap-2"
        aria-label="Open Admin Menu"
      >
        <Menu className="w-4 h-4 text-primary" />
        <span>MENU</span>
      </button>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity" 
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Shell */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col h-[100dvh] border-r border-border/80 bg-card/90 dark:bg-card/80 backdrop-blur-md transition-all duration-300 font-mono text-xs uppercase shrink-0 md:relative md:translate-x-0 select-none",
          mobileOpen ? "translate-x-0 w-72 shadow-2xl" : "-translate-x-full md:w-64",
          !mobileOpen && collapsed && "md:w-20"
        )}
      >
        {/* Monogram / Header Bar */}
        <div className={cn(
          "flex items-center justify-between p-4 sm:p-5 border-b border-border/80 min-h-[64px]",
          !mobileOpen && collapsed && "md:flex-col md:gap-3 md:justify-center md:p-3"
        )}>
          <Link 
            href="/admin" 
            className={cn("flex items-center gap-2 group", !mobileOpen && collapsed && "md:justify-center")}
            title="Karthik Lal CMS Dashboard"
          >
            <div className="nav-monogram">
              KL <span>/ ADMIN</span>
            </div>
            {(!collapsed || mobileOpen) && (
              <span className="studio-label text-[9px] text-primary border border-primary/30 px-1.5 py-0.5 bg-primary/5">
                CMS
              </span>
            )}
          </Link>
          
          {/* Desktop Collapse Button */}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 border border-border/80 bg-background/60 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors shrink-0"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>

          {/* Mobile Close Button */}
          <button 
            onClick={() => setMobileOpen(false)}
            className="md:hidden flex p-1.5 border border-border text-muted-foreground hover:text-foreground shrink-0"
            aria-label="Close Admin Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-5 flex flex-col gap-6 px-3">
          
          {/* Main Dashboard Link */}
          <div>
            <Link
              href="/admin"
              title="Dashboard Overview"
              className={cn(
                "nav-item flex items-center gap-2.5 px-3 py-2 border transition-all text-[11px] font-bold tracking-wider",
                pathname === "/admin" 
                  ? "bg-foreground text-background border-foreground shadow-xs" 
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-background/80 hover:border-border/80",
                (!mobileOpen && collapsed) && "md:justify-center md:px-2"
              )}
            >
              <LayoutDashboard className="w-3.5 h-3.5 shrink-0 text-primary" />
              {(!collapsed || mobileOpen) && <span>DASHBOARD</span>}
            </Link>
          </div>

          {/* Grouped Model Navigation */}
          {modelGroups.map((group) => {
            const availableModels = group.models.filter(m => models.includes(m))
            if (availableModels.length === 0) return null

            return (
              <div key={group.kicker} className="space-y-1">
                {(!collapsed || mobileOpen) && (
                  <p className="studio-label text-[9px] px-2.5 mb-2 text-muted-foreground/90 font-mono tracking-widest">
                    {group.kicker}
                  </p>
                )}
                <ul className="space-y-1">
                  {availableModels.map((model, idx) => {
                    const Icon = getModelIcon(model)
                    const isActive = pathname === `/admin/${model}`
                    const indexStr = String(idx + 1).padStart(2, "0")

                    return (
                      <li key={model}>
                        <Link
                          href={`/admin/${model}`}
                          title={model.replace("-", " ")}
                          className={cn(
                            "nav-item flex items-center gap-2.5 px-3 py-2 border transition-all text-[11px] font-medium tracking-wider",
                            isActive 
                              ? "bg-foreground text-background border-foreground shadow-xs font-bold" 
                              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-background/80 hover:border-border/80",
                            (!mobileOpen && collapsed) && "md:justify-center md:px-2"
                          )}
                        >
                          {(!collapsed || mobileOpen) ? (
                            <span className="text-[9px] font-mono opacity-60 w-4">{indexStr}</span>
                          ) : null}
                          <Icon className={cn("w-3.5 h-3.5 shrink-0", isActive ? "text-background" : "text-primary")} />
                          {(!collapsed || mobileOpen) && (
                            <span className="truncate">{model.replace("-", " ")}</span>
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}

          {/* Extra Models (if any dynamic ones exist) */}
          {extraModels.length > 0 && (
            <div className="space-y-1">
              {(!collapsed || mobileOpen) && (
                <p className="studio-label text-[9px] px-2.5 mb-2 text-muted-foreground/90 font-mono tracking-widest">
                  OTHER MODULES
                </p>
              )}
              <ul className="space-y-1">
                {extraModels.map((model) => {
                  const Icon = getModelIcon(model)
                  const isActive = pathname === `/admin/${model}`

                  return (
                    <li key={model}>
                      <Link
                        href={`/admin/${model}`}
                        title={model.replace("-", " ")}
                        className={cn(
                          "nav-item flex items-center gap-2.5 px-3 py-2 border transition-all text-[11px] font-medium tracking-wider",
                          isActive 
                            ? "bg-foreground text-background border-foreground shadow-xs font-bold" 
                            : "border-transparent text-muted-foreground hover:text-foreground hover:bg-background/80 hover:border-border/80",
                          (!mobileOpen && collapsed) && "md:justify-center md:px-2"
                        )}
                      >
                        <Icon className={cn("w-3.5 h-3.5 shrink-0", isActive ? "text-background" : "text-primary")} />
                        {(!collapsed || mobileOpen) && (
                          <span className="truncate">{model.replace("-", " ")}</span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

        </div>

        {/* Footer / Controls */}
        <div className="p-3 border-t border-border/80 flex flex-col gap-2 bg-card/60">
          <div className={cn("flex items-center", (!mobileOpen && collapsed) ? "justify-center" : "justify-between px-2")}>
            {(!collapsed || mobileOpen) && (
              <span className="studio-label text-[9px]">THEME</span>
            )}
            <ThemeToggleAnimated />
          </div>
          
          <Link
            href="/"
            title="View Live Portfolio Site"
            className={cn(
              "flex items-center gap-2 px-3 py-2 border border-border/70 bg-background/60 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors text-[10px] font-bold tracking-wider",
              (!mobileOpen && collapsed) && "md:justify-center md:px-2"
            )}
          >
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0 text-primary" />
            {(!collapsed || mobileOpen) && <span>VIEW LIVE SITE</span>}
          </Link>
          
          <button
            onClick={async () => {
              await fetch('/api/admin/logout', { method: 'POST' })
              window.location.href = '/admin/login'
            }}
            title="Log Out"
            className={cn(
              "flex items-center gap-2 px-3 py-2 border border-border/70 bg-background/60 text-muted-foreground hover:text-destructive hover:border-destructive/60 transition-colors text-[10px] font-bold tracking-wider w-full text-left",
              (!mobileOpen && collapsed) && "md:justify-center md:px-2"
            )}
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            {(!collapsed || mobileOpen) && <span>SIGN OUT</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
