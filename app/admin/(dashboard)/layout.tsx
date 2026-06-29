import { promises as fs } from "fs"
import path from "path"
import AdminSidebar from "@/components/admin/sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch available models by scanning the public/data directory
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
      {/* Background Noise and Gradients */}
      <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none z-0" />
      
      {/* Dynamic Collapsible Sidebar */}
      <AdminSidebar models={models} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-[100dvh] overflow-hidden bg-muted/5 relative z-10">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(1000px_circle_at_top_right,hsl(var(--primary)/0.06),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(800px_circle_at_bottom_left,hsl(var(--accent)/0.04),transparent_60%)] pointer-events-none" />
        
        {/* Custom Top Header */}
        <header className="h-16 shrink-0 border-b border-border/50 bg-background/40 backdrop-blur-md px-6 md:px-10 flex items-center justify-between relative z-20">
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
              Admin Panel
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* User Profile Badge */}
            <div className="flex items-center gap-3 bg-card/60 border border-border/80 rounded-full pl-3 pr-1 py-1 text-sm font-medium shadow-sm">
              <span className="text-xs text-muted-foreground mr-1 hidden sm:inline">Logged in as</span>
              <span className="text-sm font-semibold pr-1">Karthik Lal</span>
              <div className="relative w-7 h-7 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs uppercase shadow-inner">
                KL
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 relative z-10 scrollbar-hide">
          <div className="max-w-6xl mx-auto min-h-[calc(100vh-8rem)]">
            {children}
          </div>
          
          {/* Copyright Footer */}
          <footer className="mt-12 pt-6 border-t border-border/50 text-center pb-8">
            <p className="text-sm font-medium text-muted-foreground">
              &copy; {new Date().getFullYear()} Karthik Lal. All rights reserved.
            </p>
          </footer>
        </main>
      </div>
    </div>
  )
}
