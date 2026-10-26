import { promises as fs } from "fs"
import path from "path"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import AdminSidebar from "@/components/admin/sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let models: string[] = []
  try {
    const dataDir = path.join(process.cwd(), "public", "data")
    const files = await fs.readdir(dataDir)
    models = files
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(".json", ""))
  } catch (error) {
    console.error("Failed to read data directory:", error)
  }

  return (
    <div className="min-h-[100dvh] bg-background flex overflow-hidden font-sans antialiased text-foreground">
      
      {/* Editorial Collapsible Sidebar */}
      <AdminSidebar models={models} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-[100dvh] overflow-hidden bg-background relative z-10">
        
        {/* Editorial Top Navigation Header */}
        <header className="h-16 shrink-0 border-b border-border/80 bg-card/80 backdrop-blur-md px-6 md:px-10 flex items-center justify-between relative z-20 font-mono text-xs uppercase">
          <div className="flex items-center gap-3">
            <span className="studio-label text-[10px] text-muted-foreground hidden sm:inline">
              STUDIO ARCHIVE
            </span>
            <span className="text-muted-foreground/40 hidden sm:inline">/</span>
            <span className="studio-label text-[10px] text-primary font-bold">
              CONTENT MANAGEMENT
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              target="_blank"
              className="studio-text-link hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              LIVE SITE <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            <div className="h-4 w-px bg-border/80 hidden sm:block" />

            {/* Authenticated User Badge */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 border border-border/80 bg-background/70 text-[10px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-muted-foreground hidden md:inline">OPERATOR:</span>
              <span className="font-bold text-foreground">KARTHIK LAL</span>
            </div>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main id="admin-main-scroll" className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10 relative z-10">
          <div className="max-w-7xl mx-auto min-h-[calc(100vh-10rem)]">
            {children}
          </div>
          
          {/* Editorial Footer */}
          <footer className="mt-16 pt-8 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 text-[10px] text-muted-foreground font-mono uppercase">
            <p>
              &copy; {new Date().getFullYear()} KARTHIK LAL &mdash; STUDIO MANAGEMENT SYSTEM
            </p>
            <p className="opacity-75">
              ALL DATA PERSISTED TO LOCAL JSON REPOSITORIES
            </p>
          </footer>
        </main>
      </div>
    </div>
  )
}
