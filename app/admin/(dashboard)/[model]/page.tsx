"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import VisualEditor, { type EditorData } from "@/components/admin/visual-editor"

export default function AdminModelPage() {
  const params = useParams()
  const router = useRouter()
  const model = params.model as string

  const [data, setData] = useState<EditorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!model) return

    const fetchData = async () => {
      try {
        // Add a timestamp to bypass fetch caching in development
        const res = await fetch(`/api/admin/data/${model}?t=${Date.now()}`, {
          cache: "no-store",
        })
        if (!res.ok) {
          throw new Error("Failed to fetch data")
        }
        const json = await res.json()
        setData(json)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [model])

  const handleSave = async (updatedData: EditorData) => {
    const res = await fetch(`/api/admin/data/${model}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })

    if (!res.ok) {
      throw new Error("Failed to save data")
    }

    // Refresh the local router cache so that navigating back to the main site shows updated data
    router.refresh()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-destructive/10 text-destructive rounded-xl border border-destructive/20">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <VisualEditor 
        initialData={data ?? {}}
        onSave={handleSave} 
        modelName={model} 
      />
    </div>
  )
}
