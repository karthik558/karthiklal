import { promises as fs } from "fs"
import path from "path"
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
    <div className="min-h-[100dvh] bg-background flex overflow-hidden font-mono antialiased text-foreground uppercase">
      
      {/* Dynamic Collapsible Sidebar */}
      <AdminSidebar models={models} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-[100dvh] overflow-hidden bg-background relative z-10">
        
        {/* Custom Top Header */}
        <header className="h-16 shrink-0 border-b-2 border-border bg-card px-6 md:px-10 flex items-center justify-between relative z-20">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-background bg-foreground px-3 py-1 border border-foreground">
              ADMIN CONTROL PANEL
            </span>
          </div>
          
          <div className="flex items-center gap-4 font-mono text-xs">
            {/* User Profile Badge */}
            <div className="flex items-center gap-3 border-2 border-border bg-background px-3.5 py-1.5 font-bold">
              <span className="text-muted-foreground hidden sm:inline">AUTHENTICATED USER:</span>
              <span className="text-foreground">KARTHIK LAL</span>
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 relative z-10">
          <div className="max-w-6xl mx-auto min-h-[calc(100vh-8rem)]">
            {children}
          </div>
          
          {/* Copyright Footer */}
          <footer className="mt-12 pt-6 border-t-2 border-border text-center pb-8 text-xs text-muted-foreground font-mono uppercase">
            <p>
              &copy; {new Date().getFullYear()} KARTHIK LAL // SECURE MANAGEMENT SYSTEM
            </p>
          </footer>
        </main>
      </div>
    </div>
  )
}

