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
    <div className="min-h-screen bg-background flex">
      {/* Dynamic Collapsible Sidebar */}
      <AdminSidebar models={models} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-muted/10 relative">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(var(--primary-rgb),0.05),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(var(--primary-rgb),0.05),transparent_50%)] pointer-events-none" />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-10 relative z-10 scrollbar-hide">
          <div className="max-w-6xl mx-auto min-h-[calc(100vh-8rem)]">
            {children}
          </div>
          
          {/* Copyright Footer */}
          <footer className="mt-12 pt-6 border-t border-border/50 text-center pb-8">
            <p className="text-sm font-medium text-muted-foreground">
              &copy; 2026 Karthik Lal. All rights reserved.
            </p>
          </footer>
        </main>
      </div>
    </div>
  )
}

