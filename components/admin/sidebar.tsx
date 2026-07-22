"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getModelIcon } from "@/lib/admin-utils"
import { ThemeToggleAnimated } from "@/components/theme-toggle-animated"

export default function AdminSidebar({ models }: { models: string[] }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 p-4 border-2 border-foreground bg-foreground text-background font-mono text-xs font-bold uppercase shadow-2xl flex items-center gap-2"
      >
        <Menu className="w-5 h-5" />
        <span>MENU</span>
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40" 
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col h-[100dvh] border-r-2 border-border bg-card transition-all duration-300 font-mono text-xs uppercase shrink-0 md:relative md:translate-x-0",
          mobileOpen ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full md:w-64",
          !mobileOpen && collapsed && "md:w-20"
        )}
      >
        {/* Header / Logo */}
        <div className={cn("flex items-center justify-between p-5 border-b-2 border-border", !mobileOpen && collapsed && "md:flex-col md:gap-4")}>
          <div className={cn("flex items-center gap-3", !mobileOpen && collapsed ? "md:justify-center" : "justify-start")}>
            <div className="relative h-7 w-7 shrink-0">
              <Image src="/logo-light.png" alt="Logo" fill className="dark:hidden object-contain" priority />
              <Image src="/logo-dark.png" alt="Logo" fill className="hidden dark:block object-contain" priority />
            </div>
            {(!collapsed || mobileOpen) && (
              <span className="font-display font-black text-sm tracking-tight text-foreground">
                ADMIN CONTROL
              </span>
            )}
          </div>
          
          {/* Desktop Collapse Toggle */}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 border border-border bg-background text-foreground hover:bg-foreground hover:text-background transition-colors shrink-0"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Toggle */}
          <button 
            onClick={() => setMobileOpen(false)}
            className="md:hidden flex p-1.5 border border-foreground bg-foreground text-background font-bold shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6 font-mono text-xs uppercase">
          <div className="px-4">
            {(!collapsed || mobileOpen) && (
              <p className="font-bold text-muted-foreground tracking-widest mb-3 px-2 text-[10px]">
                PANEL OVERVIEW
              </p>
            )}
            <Link
              href="/admin"
              title="Main Panel"
              className={cn(
                "flex items-center gap-3 px-3.5 py-3 border transition-all font-bold tracking-wider",
                pathname === "/admin" 
                  ? "border-foreground bg-foreground text-background" 
                  : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground",
                (!mobileOpen && collapsed) && "md:justify-center"
              )}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              {(!collapsed || mobileOpen) && <span>MAIN DASHBOARD</span>}
            </Link>
          </div>

          <div className="px-4">
            {(!collapsed || mobileOpen) && (
              <p className="font-bold text-muted-foreground tracking-widest mb-3 px-2 text-[10px]">
                CONTENT MODULES
              </p>
            )}
            <ul className="space-y-1.5">
              {models.map((model) => {
                const Icon = getModelIcon(model)
                const isActive = pathname === `/admin/${model}`
                return (
                  <li key={model}>
                    <Link
                      href={`/admin/${model}`}
                      title={model.replace("-", " ")}
                      className={cn(
                        "flex items-center gap-3 px-3.5 py-2.5 border transition-all font-bold tracking-wider uppercase",
                        isActive 
                          ? "border-foreground bg-foreground text-background" 
                          : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground",
                        (!mobileOpen && collapsed) && "md:justify-center"
                      )}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {(!collapsed || mobileOpen) && <span className="truncate">{model.replace("-", " ")}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Footer / Logout */}
        <div className="p-4 border-t-2 border-border flex flex-col gap-2 font-mono text-xs uppercase">
          <div className={cn("flex mb-2", (!mobileOpen && collapsed) ? "justify-center" : "justify-start")}>
            <ThemeToggleAnimated />
          </div>
          
          <Link
            href="/"
            title="Exit Admin"
            className={cn(
              "flex items-center gap-3 px-3.5 py-2.5 border border-border bg-background text-foreground font-bold hover:border-foreground transition-colors",
              (!mobileOpen && collapsed) && "md:justify-center"
            )}
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            {(!collapsed || mobileOpen) && <span>EXIT ADMIN</span>}
          </Link>
          
          <button
            onClick={async () => {
              await fetch('/api/admin/logout', { method: 'POST' })
              window.location.href = '/admin/login'
            }}
            title="Log Out"
            className={cn(
              "flex items-center gap-3 px-3.5 py-2.5 border border-destructive/50 bg-destructive/10 text-destructive font-bold hover:bg-destructive hover:text-destructive-foreground transition-colors w-full text-left",
              (!mobileOpen && collapsed) && "md:justify-center"
            )}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {(!collapsed || mobileOpen) && <span>LOG OUT</span>}
          </button>
        </div>
      </aside>
    </>
  )
}

