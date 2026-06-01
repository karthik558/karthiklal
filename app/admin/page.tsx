import { promises as fs } from "fs"
import path from "path"
import Link from "next/link"
import { Database, ArrowRight } from "lucide-react"
import { getModelIcon } from "@/lib/admin-utils"

export const metadata = {
  title: "Admin Dashboard",
}

export default async function AdminDashboardPage() {
  let models: string[] = []
  let stats: Record<string, { size: number; entries: number | string }> = {}

  try {
    const dataDir = path.join(process.cwd(), "public", "data")
    const files = await fs.readdir(dataDir)
    
    for (const file of files) {
      if (file.endsWith(".json")) {
        const modelName = file.replace(".json", "")
        models.push(modelName)
        
        const filePath = path.join(dataDir, file)
        const statsObj = await fs.stat(filePath)
        const content = await fs.readFile(filePath, "utf8")
        
        let entryCount: number | string = "Unknown"
        try {
          const parsed = JSON.parse(content)
          // Try to guess entry count if it's an object with an array, or an array
          if (Array.isArray(parsed)) {
            entryCount = parsed.length
          } else {
            // Find the first array property
            const firstArrayKey = Object.keys(parsed).find(key => Array.isArray(parsed[key]))
            if (firstArrayKey) {
              entryCount = parsed[firstArrayKey].length
            } else {
              entryCount = Object.keys(parsed).length // Count top-level keys
            }
          }
        } catch (e) {
          // ignore
        }

        stats[modelName] = {
          size: Math.round(statsObj.size / 1024), // KB
          entries: entryCount,
        }
      }
    }
  } catch (error) {
    console.error("Failed to read data directory:", error)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => {
          const Icon = getModelIcon(model)
          
          return (
            <Link href={`/admin/${model}`} key={model} className="block group">
              <div className="p-6 rounded-2xl border border-border bg-card hover:bg-card/80 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between">
                
                <div className="absolute -right-6 -top-6 text-primary/5 group-hover:text-primary/10 transition-colors transform group-hover:scale-110 duration-500">
                  <Icon className="w-32 h-32" />
                </div>

                <div className="relative z-10 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold capitalize text-foreground group-hover:text-primary transition-colors">
                    {model.replace("-", " ")}
                  </h3>
                </div>

                <div className="relative z-10 flex items-end justify-between border-t border-border/50 pt-5 mt-auto">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{stats[model]?.entries}</span> Items
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{stats[model]?.size}</span> KB
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-border group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all shadow-sm">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

