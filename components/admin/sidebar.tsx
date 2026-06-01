"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getModelIcon } from "@/lib/admin-utils"

export default function AdminSidebar({ models }: { models: string[] }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside 
      className={cn(
        "relative flex flex-col h-screen border-r border-border bg-card/80 backdrop-blur-xl transition-all duration-500 ease-in-out shrink-0",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header / Logo */}
      <div className={cn("flex items-center justify-between p-6 border-b border-border/50", collapsed && "flex-col gap-4")}>
        <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "justify-start")}>
          <div className="relative w-8 h-8 shrink-0">
            <Image src="/logo-light.png" alt="Logo" fill className="dark:hidden object-contain" />
            <Image src="/logo-dark.png" alt="Logo" fill className="hidden dark:block object-contain" />
          </div>
        </div>
        
        {/* Collapse Toggle Button */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="w-6 h-6 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-full flex items-center justify-center transition-all z-50 shrink-0"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6 scrollbar-hide">
        <div className="px-4">
          {!collapsed && (
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
              collapsed && "justify-center"
            )}
          >
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Main Panel</span>}
          </Link>
        </div>

        <div className="px-4">
          {!collapsed && (
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
                      collapsed && "justify-center"
                    )}
                  >
                    <Icon className={cn("w-5 h-5 shrink-0 transition-colors", isActive ? "text-primary" : "group-hover:text-primary/70")} />
                    {!collapsed && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{model.replace("-", " ")}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-border/50 flex flex-col gap-2">
        <Link
          href="/"
          title="Back to Website"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all duration-300",
            collapsed && "justify-center"
          )}
        >
          <ArrowLeft className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="whitespace-nowrap overflow-hidden">Exit Admin</span>}
        </Link>
        <button
          onClick={async () => {
            await fetch('/api/admin/logout', { method: 'POST' })
            window.location.href = '/admin/login'
          }}
          title="Log Out"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive/80 hover:bg-destructive/10 hover:text-destructive transition-all duration-300 w-full text-left",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="whitespace-nowrap overflow-hidden">Log Out</span>}
        </button>
      </div>
    </aside>
  )
}
