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

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      {/* Mobile Toggle Button (Visible only on small screens) */}
      <button 
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform"
      >
        <Menu className="w-6 h-6" />
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
          "fixed inset-y-0 left-0 z-50 flex flex-col h-[100dvh] border-r border-border bg-card/95 backdrop-blur-xl transition-all duration-300 ease-in-out shrink-0 md:relative md:translate-x-0",
          mobileOpen ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full md:w-64",
          !mobileOpen && collapsed && "md:w-20"
        )}
      >
        {/* Header / Logo */}
        <div className={cn("flex items-center justify-between p-6 border-b border-border/50", !mobileOpen && collapsed && "md:flex-col md:gap-4")}>
          <div className={cn("flex items-center gap-3", !mobileOpen && collapsed ? "md:justify-center" : "justify-start")}>
            <div className="relative w-8 h-8 shrink-0">
              <Image src="/logo-light.png" alt="Logo" fill className="dark:hidden object-contain" />
              <Image src="/logo-dark.png" alt="Logo" fill className="hidden dark:block object-contain" />
            </div>
          </div>
          
          {/* Desktop Collapse Toggle */}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex w-6 h-6 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-full items-center justify-center transition-all shrink-0"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Toggle */}
          <button 
            onClick={() => setMobileOpen(false)}
            className="md:hidden flex w-8 h-8 bg-muted text-muted-foreground hover:text-foreground rounded-full items-center justify-center transition-all shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6 scrollbar-hide">
          <div className="px-4">
            {(!collapsed || mobileOpen) && (
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 px-2">
                Overview
              </p>
            )}
            <Link
              href="/admin"
              title="Main Panel"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm group",
                pathname === "/admin" 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                  : "text-muted-foreground hover:bg-primary/10 hover:text-foreground",
                (!mobileOpen && collapsed) && "md:justify-center"
              )}
            >
              <LayoutDashboard className="w-5 h-5 shrink-0" />
              {(!collapsed || mobileOpen) && <span>Main Panel</span>}
            </Link>
          </div>

          <div className="px-4">
            {(!collapsed || mobileOpen) && (
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 px-2">
                Content Models
              </p>
            )}
            <ul className="space-y-1">
              {models.map((model) => {
                const Icon = getModelIcon(model)
                const isActive = pathname === `/admin/${model}`
                return (
                  <li key={model}>
                    <Link
                      href={`/admin/${model}`}
                      title={model.replace("-", " ")}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-sm capitalize group",
                        isActive 
                          ? "bg-primary/15 text-primary font-semibold" 
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                        (!mobileOpen && collapsed) && "md:justify-center"
                      )}
                    >
                      <Icon className={cn("w-5 h-5 shrink-0 transition-colors", isActive ? "text-primary" : "group-hover:text-primary/70")} />
                      {(!collapsed || mobileOpen) && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{model.replace("-", " ")}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-border/50 flex flex-col gap-2">
          <div className={cn("flex mb-2", (!mobileOpen && collapsed) ? "justify-center" : "justify-start px-2")}>
            <ThemeToggleAnimated />
          </div>
          
          <Link
            href="/"
            title="Back to Website"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all duration-300",
              (!mobileOpen && collapsed) && "md:justify-center"
            )}
          >
            <ArrowLeft className="w-5 h-5 shrink-0" />
            {(!collapsed || mobileOpen) && <span className="whitespace-nowrap overflow-hidden">Exit Admin</span>}
          </Link>
          <button
            onClick={async () => {
              await fetch('/api/admin/logout', { method: 'POST' })
              window.location.href = '/admin/login'
            }}
            title="Log Out"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive/80 hover:bg-destructive/10 hover:text-destructive transition-all duration-300 w-full text-left",
              (!mobileOpen && collapsed) && "md:justify-center"
            )}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {(!collapsed || mobileOpen) && <span className="whitespace-nowrap overflow-hidden">Log Out</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
