"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Save, 
  Trash2, 
  X, 
  Check, 
  Image as ImageIcon, 
  Plus, 
  ChevronUp, 
  ChevronDown, 
  GripVertical,
  Edit3,
  Search,
  ArrowUp,
  ChevronsUp
} from "lucide-react"
import { cn } from "@/lib/utils"

interface VisualEditorProps {
  initialData: EditorData
  onSave: (data: EditorData) => Promise<void>
  modelName: string
}

type EditorRecord = Record<string, unknown>
export type EditorData = EditorRecord | EditorRecord[]

// ----------------------------------------------------------------------
// Smart Editorial Input Fields
// ----------------------------------------------------------------------

const ImageInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => {
  return (
    <div className="space-y-2 font-mono text-xs uppercase">
      <div className="flex items-center justify-between">
        <label className="studio-label text-[10px] text-muted-foreground font-bold">
          {label.replace(/([A-Z])/g, ' $1').trim()}
        </label>
        {value && (
          <span className="text-[9px] text-primary lowercase truncate max-w-[200px]">
            {value}
          </span>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-32 aspect-[16/10] border border-border/80 bg-background flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
          {value ? (
            <Image 
              src={value.startsWith('http') ? value : (value.startsWith('/') ? value : `/${value}`)} 
              alt="Preview" 
              fill 
              className="object-cover" 
              unoptimized 
            />
          ) : (
            <ImageIcon className="w-5 h-5 text-muted-foreground/60" />
          )}
        </div>
        <div className="flex-1 w-full space-y-1">
          <input
            type="text"
            className="w-full bg-background border border-border/80 px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-mono"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/project/my-image.webp or https://..."
          />
          <p className="text-[9px] text-muted-foreground/75 normal-case font-sans">
            Recommended: 16:10 or 16:9 WebP images (1586×992 or 1920×1200) under 200 KB.
          </p>
        </div>
      </div>
    </div>
  )
}

const TextareaInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="space-y-2 font-mono text-xs uppercase">
    <label className="studio-label text-[10px] text-muted-foreground font-bold">
      {label.replace(/([A-Z])/g, ' $1').trim()}
    </label>
    <textarea
      className="w-full bg-background border border-border/80 p-3.5 text-xs text-foreground font-sans normal-case focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all min-h-[110px] leading-relaxed"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
    />
  </div>
)

const TextInput = ({ 
  label, 
  value, 
  onChange, 
  type = "text", 
  options = [] 
}: { 
  label: string
  value: string | number
  onChange: (v: string | number) => void
  type?: string
  options?: string[] 
}) => {
  const listId = options.length > 0 ? `${label.replace(/\s+/g, '-')}-options` : undefined
  return (
    <div className="space-y-2 font-mono text-xs uppercase">
      <label className="studio-label text-[10px] text-muted-foreground font-bold">
        {label.replace(/([A-Z])/g, ' $1').trim()}
      </label>
      <input
        type={type}
        list={listId}
        className="w-full bg-background border border-border/80 px-3.5 py-2.5 text-xs text-foreground font-sans normal-case focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
        value={value}
        onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
      />
      {options.length > 0 && (
        <datalist id={listId}>
          {options.map((opt, i) => (
            <option key={i} value={opt} />
          ))}
        </datalist>
      )}
    </div>
  )
}

const ToggleInput = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between p-3.5 border border-border/80 bg-background/60 font-mono text-xs uppercase">
    <div>
      <label className="font-bold text-foreground cursor-pointer block text-xs" onClick={() => onChange(!value)}>
        {label.replace(/([A-Z])/g, ' $1').trim()}
      </label>
      <span className="text-[10px] text-muted-foreground">
        {value ? "Active on public showcase" : "Hidden from featured displays"}
      </span>
    </div>
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cn(
        "px-4 py-1.5 border text-xs font-mono font-bold uppercase transition-all tracking-wider",
        value 
          ? "bg-primary text-primary-foreground border-primary shadow-xs" 
          : "bg-muted/40 text-muted-foreground border-border/80 hover:border-foreground"
      )}
    >
      {value ? "ENABLED" : "DISABLED"}
    </button>
  </div>
)

const TagsInput = ({ 
  label, 
  value, 
  onChange, 
  options = [] 
}: { 
  label: string
  value: string[]
  onChange: (v: string[]) => void
  options?: string[] 
}) => {
  const [inputValue, setInputValue] = useState("")
  const listId = options.length > 0 ? `${label.replace(/\s+/g, '-')}-tags-options` : undefined
  
  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()])
      }
      setInputValue("")
    }
  }

  return (
    <div className="space-y-2 font-mono text-xs uppercase">
      <div className="flex items-center justify-between">
        <label className="studio-label text-[10px] text-muted-foreground font-bold">
          {label.replace(/([A-Z])/g, ' $1').trim()}
        </label>
        <span className="text-[9px] text-muted-foreground/70">Press Enter to add</span>
      </div>
      <div className="p-3 bg-background border border-border/80 flex flex-wrap gap-1.5 items-center min-h-[44px]">
        {value.map((tag, i) => (
          <span 
            key={i} 
            className="inline-flex items-center gap-1.5 bg-foreground text-background font-mono text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider"
          >
            {tag}
            <button 
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))} 
              className="hover:text-primary transition-colors"
              aria-label={`Remove ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          list={listId}
          className="flex-1 bg-transparent min-w-[140px] text-xs focus:outline-none text-foreground uppercase placeholder:text-muted-foreground/60 font-mono"
          placeholder="TYPE TECHNOLOGY & ENTER..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={addTag}
        />
        {options.length > 0 && (
          <datalist id={listId}>
            {options.map((opt, i) => (
              <option key={i} value={opt} />
            ))}
          </datalist>
        )}
      </div>
    </div>
  )
}

// ----------------------------------------------------------------------
// Dynamic Object Form Renderer
// ----------------------------------------------------------------------

const DynamicForm = ({ 
  data, 
  onChange, 
  optionsMap = {} 
}: { 
  data: EditorRecord
  onChange: (data: EditorRecord) => void
  optionsMap?: Record<string, string[]> 
}) => {
  return (
    <div className="space-y-6">
      {Object.entries(data).map(([key, value]) => {
        // Skip IDs usually as they are auto-managed
        if (key === 'id' && typeof value === 'number') {
          return null
        }

        const type = typeof value
        const isImage = key.toLowerCase().match(/image|logo|avatar|photo/)
        const isLongText = key.toLowerCase().match(/description|content|summary|bio|text|challenge|solution/)

        if (Array.isArray(value)) {
          if (value.length === 0 || typeof value[0] === 'string') {
            return (
              <TagsInput 
                key={key} 
                label={key} 
                value={value as string[]} 
                onChange={(v) => onChange({ ...data, [key]: v })} 
                options={optionsMap[key]} 
              />
            )
          }
          return (
            <div key={key} className="text-muted-foreground text-xs italic font-mono">
              Complex array structure in {key} editing handled via JSON source.
            </div>
          )
        }

        if (type === 'boolean') {
          return (
            <ToggleInput 
              key={key} 
              label={key} 
              value={value as boolean} 
              onChange={(v) => onChange({ ...data, [key]: v })} 
            />
          )
        }

        if (type === 'number') {
          return (
            <TextInput 
              key={key} 
              label={key} 
              value={value as number} 
              type="number" 
              onChange={(v) => onChange({ ...data, [key]: v })} 
            />
          )
        }

        if (type === 'string') {
          if (isImage) {
            return (
              <ImageInput 
                key={key} 
                label={key} 
                value={value as string} 
                onChange={(v) => onChange({ ...data, [key]: v })} 
              />
            )
          }
          if (isLongText) {
            return (
              <TextareaInput 
                key={key} 
                label={key} 
                value={value as string} 
                onChange={(v) => onChange({ ...data, [key]: v })} 
              />
            )
          }
          return (
            <TextInput 
              key={key} 
              label={key} 
              value={value as string} 
              onChange={(v) => onChange({ ...data, [key]: v })} 
              options={optionsMap[key]} 
            />
          )
        }

        return null
      })}
    </div>
  )
}

// ----------------------------------------------------------------------
// Main Visual Editor Component (With Drag & Drop + Auto JSON Persist)
// ----------------------------------------------------------------------

export default function VisualEditor({ initialData, onSave, modelName }: VisualEditorProps) {
  const [data, setData] = useState<EditorData>(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Drawer state for record editing
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [drawerData, setDrawerData] = useState<EditorRecord | null>(null)

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  // Search filter
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const syncFrame = requestAnimationFrame(() => setData(initialData))
    return () => cancelAnimationFrame(syncFrame)
  }, [initialData])

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
    setToastMessage(msg)
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null)
    }, 2800)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    try {
      await onSave(data)
      setSaveSuccess(true)
      showToast("✓ All changes saved to JSON")
      setTimeout(() => setSaveSuccess(false), 2500)
    } catch (error) {
      console.error("Save failed:", error)
      alert("Failed to save data. Check server logs.")
    } finally {
      setIsSaving(false)
    }
  }

  // Detect if data is an array or an object wrapping a single array
  const isDirectArray = Array.isArray(data)
  let wrapperKey: string | null = null
  let arrayData: EditorRecord[] | null = null
  
  if (isDirectArray) {
    arrayData = data
  } else if (data && typeof data === 'object') {
    const keys = Object.keys(data)
    if (keys.length === 1 && Array.isArray(data[keys[0]])) {
      wrapperKey = keys[0]
      arrayData = data[keys[0]] as EditorRecord[]
    }
  }

  const isArrayModel = arrayData !== null

  // ----------------------------------------------------------------------
  // Reordering & Auto-Save Functionality
  // ----------------------------------------------------------------------

  const reorderAndPersist = async (newItems: EditorRecord[], reason: string) => {
    // Automatically reassign sequential IDs if objects have numeric ids (e.g. project.id = 1..24)
    if (newItems.length > 0 && typeof newItems[0].id === 'number') {
      newItems.forEach((item, idx) => {
        item.id = idx + 1
      })
    }

    const payload = wrapperKey ? { [wrapperKey]: newItems } : newItems
    setData(payload)

    setIsSaving(true)
    try {
      await onSave(payload)
      showToast(reason)
    } catch (err) {
      console.error("Auto-save failed:", err)
      showToast("⚠️ Order updated locally; error writing to file")
    } finally {
      setIsSaving(false)
    }
  }

  // Window & container auto-scroll during drag
  useEffect(() => {
    if (draggedIndex === null) return

    const handleWindowDragOver = (e: DragEvent) => {
      const scrollEl = document.getElementById("admin-main-scroll") || document.scrollingElement || document.documentElement
      if (!scrollEl) return

      const threshold = 130
      const clientY = e.clientY
      const viewportHeight = window.innerHeight

      if (clientY < threshold) {
        // Dragging near top: auto-scroll up
        const intensity = Math.max(8, Math.min(28, Math.round((threshold - clientY) / 3)))
        scrollEl.scrollTop -= intensity
      } else if (clientY > viewportHeight - threshold) {
        // Dragging near bottom: auto-scroll down
        const intensity = Math.max(8, Math.min(28, Math.round((clientY - (viewportHeight - threshold)) / 3)))
        scrollEl.scrollTop += intensity
      }
    }

    window.addEventListener("dragover", handleWindowDragOver)
    return () => {
      window.removeEventListener("dragover", handleWindowDragOver)
    }
  }, [draggedIndex])

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", String(index))
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (dragOverIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === targetIndex || !arrayData) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const sourceIndex = draggedIndex
    const newItems = [...arrayData]
    const [moved] = newItems.splice(sourceIndex, 1)
    newItems.splice(targetIndex, 0, moved)

    setDraggedIndex(null)
    setDragOverIndex(null)

    await reorderAndPersist(newItems, `✓ Moved item from #${sourceIndex + 1} to #${targetIndex + 1} & saved to JSON`)
  }

  // Single-step nudge up / down buttons
  const nudgeItem = async (fromIndex: number, direction: 'up' | 'down') => {
    if (!arrayData) return
    const targetIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1
    if (targetIndex < 0 || targetIndex >= arrayData.length) return

    const newItems = [...arrayData]
    const [moved] = newItems.splice(fromIndex, 1)
    newItems.splice(targetIndex, 0, moved)

    await reorderAndPersist(newItems, `✓ Moved item to position #${targetIndex + 1} & saved to JSON`)
  }

  // Move directly to top position (#01)
  const moveToTop = async (fromIndex: number) => {
    if (!arrayData || fromIndex <= 0) return
    const itemTitle = String(arrayData[fromIndex].title || arrayData[fromIndex].name || `Item ${fromIndex + 1}`)
    const newItems = [...arrayData]
    const [moved] = newItems.splice(fromIndex, 1)
    newItems.unshift(moved)
    await reorderAndPersist(newItems, `✓ Moved "${itemTitle}" to first position (#01) & saved to JSON`)
  }

  // Drawer handlers
  const openDrawer = (index: number) => {
    setEditingIndex(index)
    setDrawerData(arrayData ? { ...arrayData[index] } : null)
  }

  const openNewDrawer = () => {
    setEditingIndex(-1)
    const template: EditorRecord = arrayData && arrayData.length > 0
      ? Object.keys(arrayData[0]).reduce((acc, key) => ({ 
          ...acc, 
          [key]: typeof arrayData![0][key] === 'string' ? '' : typeof arrayData![0][key] === 'number' ? 0 : typeof arrayData![0][key] === 'boolean' ? false : Array.isArray(arrayData![0][key]) ? [] : null 
        }), {} as EditorRecord)
      : {}
    
    if (arrayData && arrayData.length > 0 && typeof arrayData[0].id === 'number') {
      const maxId = Math.max(...arrayData.map((item) => typeof item.id === "number" ? item.id : 0))
      template['id'] = maxId + 1
    }
    
    setDrawerData(template)
  }

  const saveDrawer = async () => {
    if (!arrayData || !drawerData) return
    const newItems = [...arrayData]
    if (editingIndex === -1) {
      newItems.unshift(drawerData)
    } else if (editingIndex !== null) {
      newItems[editingIndex] = drawerData
    }
    
    setEditingIndex(null)
    setDrawerData(null)

    await reorderAndPersist(newItems, "✓ Record saved & JSON updated")
  }

  const deleteItem = async (index: number) => {
    if (!arrayData) return
    const itemTitle = String(arrayData[index].title || arrayData[index].name || `Item ${index + 1}`)
    if (confirm(`Are you sure you want to delete "${itemTitle}"? This will update the JSON file immediately.`)) {
      const newItems = [...arrayData]
      newItems.splice(index, 1)
      await reorderAndPersist(newItems, `✓ Deleted "${itemTitle}" & saved to JSON`)
    }
  }

  // Options map for autocompletion
  const optionsMap: Record<string, string[]> = {}
  if (arrayData) {
    optionsMap['category'] = Array.from(new Set(
      arrayData
        .map((item) => item.category)
        .filter((category): category is string => typeof category === "string")
    ))
    optionsMap['technologies'] = Array.from(new Set(
      arrayData.flatMap((item) =>
        Array.isArray(item.technologies)
          ? item.technologies.filter((technology): technology is string => typeof technology === "string")
          : []
      )
    ))
  }

  // Filtered array items for search
  const filteredArrayData = arrayData?.filter((item) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    const title = String(item.title || item.name || item.company || "").toLowerCase()
    const category = String(item.category || item.role || "").toLowerCase()
    const description = String(item.description || item.excerpt || "").toLowerCase()
    const tech = Array.isArray(item.technologies) ? item.technologies.join(" ").toLowerCase() : ""
    return title.includes(q) || category.includes(q) || description.includes(q) || tech.includes(q)
  })

  return (
    <div className="space-y-8 pb-20 relative">
      
      {/* Floating Auto-Save Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-foreground text-background font-mono text-xs font-bold uppercase tracking-wider shadow-2xl border border-primary/40 backdrop-blur-md"
          >
            <Check className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editorial Header Panel (Compact & Non-Sticky to avoid obscuring drop targets) */}
      <div className="border border-border/80 bg-card/90 dark:bg-card/80 backdrop-blur-md p-4 sm:p-5 shadow-xs relative z-10 mb-5 space-y-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5 border-b border-border/70 pb-3.5">
          <div>
            <div className="studio-label text-[10px] text-primary font-mono tracking-widest mb-1 flex items-center gap-2">
              <span>EDITORIAL ARCHIVE</span>
              <span className="opacity-40">/</span>
              <span>{modelName.toUpperCase()}</span>
            </div>
            <h1 className="editorial-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground uppercase">
              {modelName.replace("-", " ")} <span className="studio-serif font-normal italic text-primary">collection.</span>
            </h1>
            {isArrayModel && (
              <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
                {arrayData?.length} {arrayData?.length === 1 ? 'record' : 'records'} · Drag any card or use controls to reorder
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            {isArrayModel && (
              <button
                type="button"
                onClick={openNewDrawer}
                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 border border-border/80 bg-background/80 hover:bg-card hover:border-foreground text-foreground px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all"
              >
                <Plus className="w-3.5 h-3.5 text-primary" />
                ADD RECORD
              </button>
            )}
            
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-foreground text-background hover:bg-foreground/90 font-mono text-xs font-bold uppercase tracking-wider px-4 py-2 transition-all disabled:opacity-50 shadow-xs"
            >
              {isSaving ? (
                <span>SAVING...</span>
              ) : saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> SAVED
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" /> SAVE CHANGES
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar for Array Models */}
        {isArrayModel && arrayData && arrayData.length > 3 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-0.5">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search collection by title, tag, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background/70 border border-border/80 pl-8 pr-8 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors"
              />
              {searchQuery && (
                <button 
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {searchQuery && (
              <p className="studio-label text-[10px] text-muted-foreground">
                Showing {filteredArrayData?.length} of {arrayData.length} records · Clear search to drag & reorder all
              </p>
            )}
          </div>
        )}
      </div>

      {/* Dedicated Top Drop Target Zone (Position #01) */}
      {isArrayModel && draggedIndex !== null && !searchQuery && (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            e.dataTransfer.dropEffect = "move"
            if (dragOverIndex !== -1) setDragOverIndex(-1)
          }}
          onDragLeave={() => {
            if (dragOverIndex === -1) setDragOverIndex(null)
          }}
          onDrop={(e) => handleDrop(e, 0)}
          className={cn(
            "mb-4 border-2 border-dashed p-4 flex items-center justify-center gap-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
            dragOverIndex === -1
              ? "border-primary bg-primary/15 text-primary scale-[1.01] shadow-lg ring-2 ring-primary/40"
              : "border-primary/60 bg-primary/5 text-primary hover:bg-primary/10"
          )}
        >
          <ArrowUp className="w-4 h-4 animate-bounce text-primary" />
          <span>DROP HERE TO PLACE AT FIRST POSITION (#01)</span>
        </div>
      )}

      {/* Main Content Area */}
      {isArrayModel ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredArrayData?.map((item) => {
              // Find the true index in original arrayData for accurate reordering
              const originalIndex = arrayData ? arrayData.indexOf(item) : 0
              const isFirst = originalIndex === 0
              const isLast = arrayData ? originalIndex === arrayData.length - 1 : false

              const title = [item.title, item.name, item.company, item.platform]
                .find((value): value is string => typeof value === "string") ?? `Item ${originalIndex + 1}`
              const image = [item.image, item.logo, item.avatar]
                .find((value): value is string => typeof value === "string")
              const technologies = Array.isArray(item.technologies)
                ? item.technologies.filter((value): value is string => typeof value === "string")
                : []
              const subtitle = [item.category, item.role, item.position]
                .find((value): value is string => typeof value === "string") ?? technologies.slice(0, 3).join(" / ")
              
              const itemKey = typeof item.id === "string" || typeof item.id === "number"
                ? String(item.id)
                : String(originalIndex)

              const isDraggingThis = draggedIndex === originalIndex
              const isDragOverThis = dragOverIndex === originalIndex && draggedIndex !== originalIndex

              return (
                <div
                  key={itemKey}
                  draggable={!searchQuery}
                  onDragStart={(e) => handleDragStart(e, originalIndex)}
                  onDragOver={(e) => handleDragOver(e, originalIndex)}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => handleDrop(e, originalIndex)}
                  className={cn(
                    "border bg-card/70 backdrop-blur-sm transition-all duration-200 flex flex-col justify-between group overflow-hidden relative",
                    isDraggingThis && "opacity-35 scale-95 border-primary/50 shadow-none",
                    isDragOverThis 
                      ? "border-primary ring-2 ring-primary/40 bg-primary/5 scale-[1.02] shadow-xl" 
                      : "border-border/80 hover:border-primary/60 hover:shadow-md",
                    !searchQuery ? "cursor-grab active:cursor-grabbing" : ""
                  )}
                >
                  {/* Card Top Utility Bar: Drag Handle & Index */}
                  <div className="px-3.5 py-2 border-b border-border/70 flex items-center justify-between bg-card/90 text-muted-foreground font-mono text-[10px]">
                    <div className="flex items-center gap-1.5" title={searchQuery ? "Clear search to reorder" : "Drag to move to any position"}>
                      <GripVertical className={cn(
                        "w-3.5 h-3.5 text-muted-foreground/70 transition-colors",
                        !searchQuery && "group-hover:text-primary"
                      )} />
                      <span className="font-bold text-foreground">
                        #{String(originalIndex + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {!isFirst && !searchQuery && (
                        <button
                          type="button"
                          onClick={() => moveToTop(originalIndex)}
                          className="text-[9px] font-bold text-muted-foreground hover:text-primary transition-colors border border-border/60 px-1.5 py-0.5 bg-background/50 flex items-center gap-0.5"
                          title="Move directly to first position (#01)"
                        >
                          <ChevronsUp className="w-3 h-3 text-primary" />
                          <span>TOP</span>
                        </button>
                      )}

                      {typeof item.category === "string" && (
                        <span className="studio-label text-[9px] text-primary truncate max-w-[120px]">
                          {String(item.category)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Preview Area (Editorial 16:10 Ratio) */}
                  <div className="relative aspect-[16/10] bg-muted/30 overflow-hidden shrink-0 border-b border-border/70">
                    {image ? (
                      <Image 
                        src={image.startsWith('http') ? image : (image.startsWith('/') ? image : `/${image}`)} 
                        alt={title} 
                        fill 
                        className="object-cover transition-all duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 font-display font-black text-2xl uppercase">
                        {title.charAt(0)}
                      </div>
                    )}
                    
                    {/* Hover Quick Edit Action Overlay */}
                    <div className="absolute inset-0 bg-background/85 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-3 z-10 backdrop-blur-xs">
                      <button 
                        type="button"
                        onClick={() => openDrawer(originalIndex)}
                        className="px-3.5 py-2 bg-foreground text-background font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm hover:bg-foreground/90 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-primary" />
                        EDIT
                      </button>
                      {!isFirst && !searchQuery && (
                        <button 
                          type="button"
                          onClick={() => moveToTop(originalIndex)}
                          className="px-3 py-2 border border-border/80 bg-card text-foreground font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1 shadow-sm hover:border-primary hover:text-primary transition-colors"
                          title="Move to first position (#01)"
                        >
                          <ChevronsUp className="w-3.5 h-3.5 text-primary" />
                          TOP
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Information Area */}
                  <div className="p-4 flex flex-col justify-between flex-1 space-y-2">
                    <div>
                      <h3 className="font-display font-bold text-foreground text-base tracking-tight truncate uppercase" title={title}>
                        {title}
                      </h3>
                      {subtitle && (
                        <p className="font-mono text-[10px] text-muted-foreground truncate uppercase mt-0.5">
                          {subtitle}
                        </p>
                      )}
                    </div>

                    {/* Card Actions: Single-step arrows + Move to top + Edit + Delete */}
                    <div className="pt-2 border-t border-border/60 flex items-center justify-between text-muted-foreground font-mono text-xs">
                      {/* Step Up / Down Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => nudgeItem(originalIndex, 'up')}
                          disabled={isFirst}
                          className="p-1.5 border border-border/70 bg-background/60 text-muted-foreground hover:text-foreground hover:border-foreground disabled:opacity-25 disabled:pointer-events-none transition-colors"
                          title="Move up 1 position"
                          aria-label="Move up 1 position"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => nudgeItem(originalIndex, 'down')}
                          disabled={isLast}
                          className="p-1.5 border border-border/70 bg-background/60 text-muted-foreground hover:text-foreground hover:border-foreground disabled:opacity-25 disabled:pointer-events-none transition-colors"
                          title="Move down 1 position"
                          aria-label="Move down 1 position"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        {!isFirst && !searchQuery && (
                          <button
                            type="button"
                            onClick={() => moveToTop(originalIndex)}
                            className="px-1.5 py-1 text-[10px] border border-border/70 bg-background/60 text-muted-foreground hover:text-primary hover:border-primary transition-colors flex items-center gap-0.5"
                            title="Move directly to first position (#01)"
                            aria-label="Move to top"
                          >
                            <ChevronsUp className="w-3 h-3 text-primary" />
                            <span>#1</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          type="button"
                          onClick={() => openDrawer(originalIndex)}
                          className="text-[10px] font-bold text-foreground hover:text-primary transition-colors tracking-wider flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3 text-primary" /> EDIT
                        </button>
                        <span className="opacity-30">|</span>
                        <button 
                          type="button"
                          onClick={() => deleteItem(originalIndex)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          title="Delete record"
                          aria-label={`Delete ${title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </AnimatePresence>

          {/* Empty Records State */}
          {filteredArrayData?.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border/80 bg-card/60 p-8 text-center font-mono text-xs uppercase">
              <Plus className="w-8 h-8 mb-3 text-primary" />
              <p className="font-display font-bold text-xl text-foreground">
                {searchQuery ? "NO MATCHING RECORDS FOUND" : "NO RECORDS CREATED"}
              </p>
              <p className="text-muted-foreground text-[11px] mt-1 normal-case font-sans">
                {searchQuery 
                  ? "Try clearing your search query to see all items in this collection." 
                  : "Click 'Add Record' above to initialize new content in this JSON model."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-4 py-2 border border-border bg-background text-foreground hover:border-foreground transition-all text-xs font-bold font-mono uppercase"
                >
                  CLEAR SEARCH
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Object: Full Page Form View */
        <div className="border border-border/80 bg-card/80 backdrop-blur-md p-6 sm:p-10 max-w-4xl mx-auto space-y-6 shadow-xs">
          <DynamicForm data={data as EditorRecord} onChange={setData} optionsMap={optionsMap} />
        </div>
      )}

      {/* Slide-out Drawer for Editing Array Item */}
      <AnimatePresence>
        {editingIndex !== null && drawerData && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingIndex(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 right-0 w-full max-w-xl bg-card border-l border-border/80 shadow-2xl z-50 flex flex-col h-[100dvh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-border/80 shrink-0 bg-card/90">
                <div>
                  <span className="studio-label text-[10px] text-primary">
                    {editingIndex === -1 ? 'NEW RECORD' : `RECORD #${editingIndex + 1}`}
                  </span>
                  <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
                    {editingIndex === -1 ? 'Add New Record' : 'Edit Record'}
                  </h3>
                </div>
                <button 
                  onClick={() => setEditingIndex(null)}
                  className="p-2 border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                  aria-label="Close drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <DynamicForm data={drawerData} onChange={setDrawerData} optionsMap={optionsMap} />
              </div>
              
              <div className="p-5 border-t border-border/80 shrink-0 bg-background/80 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditingIndex(null)}
                  className="flex-1 border border-border/80 bg-card px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-foreground transition-all"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={saveDrawer}
                  className="flex-[2] bg-foreground text-background py-3 px-4 font-mono text-xs font-bold uppercase tracking-wider hover:bg-foreground/90 transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <Check className="w-3.5 h-3.5 text-primary" />
                  APPLY & SAVE TO JSON
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  )
}
