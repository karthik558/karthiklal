"use client"

import React, { useState, useEffect } from "react"
import { Save, Plus, Trash2, ChevronDown, ChevronRight, Check } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"

interface JsonEditorProps {
  initialData: any
  onSave: (data: any) => Promise<void>
  modelName: string
}

// Recursive component to render object nodes
const JsonNode = ({ data, onChange, name, path = "" }: { data: any, onChange: (val: any) => void, name: string, path?: string }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  if (data === null || data === undefined) {
    return null
  }

  const type = typeof data

  if (type === "string") {
    const isLongText = data.length > 80 || name.toLowerCase().includes("description") || name.toLowerCase().includes("content")
    return (
      <div className="mb-4">
        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{name}</label>
        {isLongText ? (
          <textarea
            className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[100px]"
            value={data}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <input
            type="text"
            className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            value={data}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </div>
    )
  }

  if (type === "number") {
    return (
      <div className="mb-4">
        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{name}</label>
        <input
          type="number"
          className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          value={data}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    )
  }

  if (type === "boolean") {
    return (
      <div className="mb-4 flex items-center justify-between p-3 rounded-lg border border-border bg-background">
        <label className="text-sm font-semibold text-foreground capitalize">{name}</label>
        <button
          onClick={() => onChange(!data)}
          className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${data ? 'bg-primary' : 'bg-muted'}`}
        >
          <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${data ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
      </div>
    )
  }

  if (Array.isArray(data)) {
    return (
      <div className="mb-6 border border-border rounded-xl overflow-hidden bg-card/50">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2 font-semibold text-foreground capitalize">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            {name} <span className="text-xs text-muted-foreground font-normal">({data.length} items)</span>
          </div>
          
          <div 
            onClick={(e) => {
              e.stopPropagation()
              // Try to figure out the empty item structure based on the first element
              const template = data.length > 0 ? Array.isArray(data[0]) ? [] : typeof data[0] === 'object' ? Object.keys(data[0]).reduce((acc, key) => ({ ...acc, [key]: typeof data[0][key] === 'string' ? '' : typeof data[0][key] === 'number' ? 0 : typeof data[0][key] === 'boolean' ? false : null }), {}) : "" : ""
              onChange([...data, template])
              setIsExpanded(true)
            }}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 px-2 py-1 rounded bg-primary/10"
          >
            <Plus className="w-3 h-3" /> Add Item
          </div>
        </button>
        
        {isExpanded && (
          <div className="p-4 space-y-4">
            {data.length === 0 ? (
              <p className="text-sm text-muted-foreground italic text-center py-4">No items yet</p>
            ) : (
              data.map((item, index) => (
                <div key={`${path}-${index}`} className="relative pl-4 border-l-2 border-border/50 hover:border-primary/50 transition-colors pb-4 mb-4 border-b border-border/30 last:border-b-0 last:mb-0 last:pb-0">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-border/50 flex items-center justify-center text-[8px] font-bold text-muted-foreground">{index + 1}</div>
                  
                  <div className="flex justify-end mb-2">
                    <button 
                      onClick={() => {
                        const newData = [...data]
                        newData.splice(index, 1)
                        onChange(newData)
                      }}
                      className="text-destructive hover:bg-destructive/10 p-1.5 rounded transition-colors flex items-center gap-1 text-xs"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                  
                  <JsonNode 
                    name={`Item ${index + 1}`}
                    data={item} 
                    path={`${path}[${index}]`}
                    onChange={(newItem) => {
                      const newData = [...data]
                      newData[index] = newItem
                      onChange(newData)
                    }} 
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    )
  }

  if (typeof data === "object") {
    // If it's the root object, don't wrap it in a collapsible container unless specified
    const isRoot = path === ""
    
    const content = (
      <div className={`${isRoot ? '' : 'p-4'} space-y-2`}>
        {Object.keys(data).map((key) => (
          <JsonNode 
            key={`${path}-${key}`}
            name={key} 
            data={data[key]} 
            path={`${path}.${key}`}
            onChange={(newVal) => {
              onChange({ ...data, [key]: newVal })
            }} 
          />
        ))}
      </div>
    )

    if (isRoot) return content

    return (
      <div className="mb-4 border border-border rounded-xl overflow-hidden bg-card/30">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center gap-2 p-3 bg-muted/20 hover:bg-muted/40 transition-colors font-semibold text-foreground capitalize text-sm"
        >
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          {name}
        </button>
        {isExpanded && content}
      </div>
    )
  }

  return null
}

export default function JsonEditor({ initialData, onSave, modelName }: JsonEditorProps) {
  const [data, setData] = useState(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Update local state if initialData changes (e.g. from props)
  useEffect(() => {
    setData(initialData)
  }, [initialData])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    try {
      await onSave(data)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error("Save failed:", error)
      alert("Failed to save data. See console for details.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between bg-card p-6 rounded-2xl border border-border shadow-sm sticky top-0 z-10 backdrop-blur-md bg-card/80">
        <div>
          <h2 className="text-2xl font-bold capitalize text-foreground">{modelName.replace("-", " ")}</h2>
          <p className="text-sm text-muted-foreground mt-1">Visually edit the JSON structure below</p>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : saveSuccess ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm">
        <JsonNode 
          data={data} 
          onChange={(newData) => setData(newData)} 
          name="Root" 
          path="" 
        />
      </div>
    </div>
  )
}
