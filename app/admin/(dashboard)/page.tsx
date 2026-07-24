import { promises as fs } from "fs"
import path from "path"
import DashboardClient from "@/components/admin/dashboard-client"

export const metadata = {
  title: "Admin Dashboard",
}

export default async function AdminDashboardPage() {
  const models: string[] = []
  const stats: Record<string, { size: number; entries: number | string }> = {}

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
        } catch {
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

  return <DashboardClient models={models} stats={stats} />
}
