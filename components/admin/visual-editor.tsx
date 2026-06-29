"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Save, Plus, Trash2, X, Check, Image as ImageIcon, PlusCircle } from "lucide-react"

interface VisualEditorProps {
  initialData: any
  onSave: (data: any) => Promise<void>
  modelName: string
}

// ----------------------------------------------------------------------
// Smart Input Fields
// ----------------------------------------------------------------------

const ImageInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label.replace(/([A-Z])/g, ' $1').trim()}</label>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-background/40 border border-border/80 border-dashed flex items-center justify-center shrink-0 shadow-inner">
          {value ? (
            <Image src={value.startsWith('http') ? value : (value.startsWith('/') ? value : `/${value}`)} alt="Preview" fill className="object-cover" unoptimized />
          ) : (
            <ImageIcon className="w-6 h-6 text-muted-foreground/45" />
          )}
        </div>
        <div className="flex-1 w-full">
          <input
            type="text"
            className="w-full bg-background/40 border border-border/70 rounded-xl p-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all text-foreground placeholder:text-muted-foreground/40"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/image-path.jpg or https://..."
          />
        </div>
      </div>
    </div>
  )
}

const TextareaInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label.replace(/([A-Z])/g, ' $1').trim()}</label>
    <textarea
      className="w-full bg-background/40 border border-border/70 rounded-xl p-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all text-foreground placeholder:text-muted-foreground/40 min-h-[120px]"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
)

const TextInput = ({ label, value, onChange, type = "text", options = [] }: { label: string; value: string | number; onChange: (v: any) => void; type?: string; options?: string[] }) => {
  const listId = options.length > 0 ? `${label.replace(/\s+/g, '-')}-options` : undefined;
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label.replace(/([A-Z])/g, ' $1').trim()}</label>
      <input
        type={type}
        list={listId}
        className="w-full bg-background/40 border border-border/70 rounded-xl p-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all text-foreground placeholder:text-muted-foreground/40"
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
  <div className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-card/45 backdrop-blur-sm shadow-sm transition-all hover:bg-card/75">
    <label className="text-sm font-semibold text-foreground capitalize cursor-pointer" onClick={() => onChange(!value)}>
      {label.replace(/([A-Z])/g, ' $1').trim()}
    </label>
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-300 ${value ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-muted-foreground/20'}`}
    >
      <div className={`absolute top-1 bottom-1 w-4 rounded-full bg-white transition-transform duration-300 ${value ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  </div>
)

const TagsInput = ({ label, value, onChange, options = [] }: { label: string; value: string[]; onChange: (v: string[]) => void; options?: string[] }) => {
  const [inputValue, setInputValue] = useState("")
  const listId = options.length > 0 ? `${label.replace(/\s+/g, '-')}-tags-options` : undefined;
  
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
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label.replace(/([A-Z])/g, ' $1').trim()}</label>
      <div className="p-2.5 bg-background/40 border border-border/70 rounded-xl flex flex-wrap gap-2 items-center focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
        {value.map((tag, i) => (
          <span key={i} className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-2.5 py-1 rounded-lg">
            {tag}
            <button onClick={() => onChange(value.filter((_, idx) => idx !== i))} className="hover:text-destructive transition-colors">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          list={listId}
          className="flex-1 bg-transparent min-w-[120px] text-sm focus:outline-none text-foreground placeholder:text-muted-foreground/40"
          placeholder="Type and press Enter to add..."
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

const DynamicForm = ({ data, onChange, optionsMap = {} }: { data: any; onChange: (data: any) => void; optionsMap?: Record<string, string[]> }) => {
  if (!data || typeof data !== 'object') return null

  return (
    <div className="space-y-6">
      {Object.entries(data).map(([key, value]) => {
        // Skip IDs usually
        if (key === 'id' && typeof value === 'number') {
          return null; 
        }

        const type = typeof value
        const isImage = key.toLowerCase().match(/image|logo|avatar|icon|photo/)
        const isLongText = key.toLowerCase().match(/description|content|summary|bio|text/)

        if (Array.isArray(value)) {
          // Arrays of strings -> Tags Input
          if (value.length === 0 || typeof value[0] === 'string') {
            return <TagsInput key={key} label={key} value={value} onChange={(v) => onChange({ ...data, [key]: v })} options={optionsMap[key]} />
          }
          // Arrays of objects could be handled here recursively, but for standard models this is rare.
          return <div key={key} className="text-muted-foreground text-sm italic">Complex array editing not supported inline.</div>
        }

        if (type === 'boolean') {
          return <ToggleInput key={key} label={key} value={value as boolean} onChange={(v) => onChange({ ...data, [key]: v })} />
        }

        if (type === 'number') {
          return <TextInput key={key} label={key} value={value as number} type="number" onChange={(v) => onChange({ ...data, [key]: v })} />
        }

        if (type === 'string') {
          if (isImage) {
            return <ImageInput key={key} label={key} value={value as string} onChange={(v) => onChange({ ...data, [key]: v })} />
          }
          if (isLongText) {
            return <TextareaInput key={key} label={key} value={value as string} onChange={(v) => onChange({ ...data, [key]: v })} />
          }
          return <TextInput key={key} label={key} value={value as string} onChange={(v) => onChange({ ...data, [key]: v })} options={optionsMap[key]} />
        }

        return null
      })}
    </div>
  )
}


// ----------------------------------------------------------------------
// Main Visual Editor Component
// ----------------------------------------------------------------------

export default function VisualEditor({ initialData, onSave, modelName }: VisualEditorProps) {
  const [data, setData] = useState(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Drawer state for array editing
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [drawerData, setDrawerData] = useState<any>(null)

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

  // Detect if data is an array or an object wrapping a single array
  const isDirectArray = Array.isArray(data)
  let wrapperKey: string | null = null
  let arrayData: any[] | null = null
  
  if (isDirectArray) {
    arrayData = data
  } else if (data && typeof data === 'object') {
    const keys = Object.keys(data)
    if (keys.length === 1 && Array.isArray(data[keys[0]])) {
      wrapperKey = keys[0]
      arrayData = data[keys[0]]
    }
  }

  const isArrayModel = arrayData !== null

  const openDrawer = (index: number) => {
    setEditingIndex(index)
    setDrawerData(arrayData ? { ...arrayData[index] } : null)
  }

  const openNewDrawer = () => {
    setEditingIndex(-1) // -1 means new item
    // Create an empty template based on the first item
    const template: Record<string, any> = arrayData && arrayData.length > 0 
      ? Object.keys(arrayData[0]).reduce((acc, key) => ({ 
          ...acc, 
          [key]: typeof arrayData![0][key] === 'string' ? '' : typeof arrayData![0][key] === 'number' ? 0 : typeof arrayData![0][key] === 'boolean' ? false : Array.isArray(arrayData![0][key]) ? [] : null 
        }), {} as Record<string, any>) 
      : {}
    
    // Auto-increment ID if it exists
    if (arrayData && arrayData.length > 0 && typeof arrayData[0].id === 'number') {
      const maxId = Math.max(...arrayData.map((item: any) => item.id || 0))
      template['id'] = maxId + 1
    }
    
    setDrawerData(template)
  }

  const saveDrawer = () => {
    if (!arrayData) return
    const newData = [...arrayData]
    if (editingIndex === -1) {
      newData.unshift(drawerData)
    } else if (editingIndex !== null) {
      newData[editingIndex] = drawerData
    }
    
    // Automatically reassign sequential IDs if objects have numeric ids
    if (newData.length > 0 && typeof newData[0].id === 'number') {
      newData.forEach((item, idx) => {
        item.id = idx + 1
      })
    }

    setData(wrapperKey ? { [wrapperKey]: newData } : newData)
    setEditingIndex(null)
    setDrawerData(null)
  }

  const deleteItem = (index: number) => {
    if (!arrayData) return
    if (confirm("Are you sure you want to delete this item?")) {
      const newData = [...arrayData]
      newData.splice(index, 1)

      // Automatically reassign sequential IDs if objects have numeric ids
      if (newData.length > 0 && typeof newData[0].id === 'number') {
        newData.forEach((item, idx) => {
          item.id = idx + 1
        })
      }

      setData(wrapperKey ? { [wrapperKey]: newData } : newData)
    }
  }

  // Compute autocomplete options based on existing arrayData
  const optionsMap: Record<string, string[]> = {}
  if (arrayData) {
    optionsMap['category'] = Array.from(new Set(arrayData.map((item: any) => item.category).filter(Boolean))) as string[]
    optionsMap['technologies'] = Array.from(new Set(arrayData.flatMap((item: any) => item.technologies || []).filter(Boolean))) as string[]
  }

  return (
    <div className="space-y-8 pb-20 relative">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-card/65 p-5 sm:p-6 rounded-2xl border border-border/80 shadow-sm sticky top-0 z-20 backdrop-blur-md gap-4 overflow-hidden">
        {/* Neon Bottom border line */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div>
          <h2 className="text-2xl font-display font-extrabold capitalize text-foreground">{modelName.replace("-", " ")}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Visually manage your live website data entries</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto relative z-10">
          {isArrayModel && (
            <button
              onClick={openNewDrawer}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-secondary text-secondary-foreground border border-border/60 px-5 py-2.5 rounded-full font-bold hover:bg-secondary/80 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-primary" />
              Add New
            </button>
          )}
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:pointer-events-none relative overflow-hidden group/save"
          >
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover/save:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
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
      </div>

      {/* Array: Grid View */}
      {isArrayModel ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {arrayData?.map((item: any, idx: number) => {
              // Try to find the best display properties
              const title = item.title || item.name || item.company || item.platform || `Item ${idx + 1}`
              const image = item.image || item.logo || item.avatar || item.icon
              const subtitle = item.category || item.role || item.position || (item.technologies && item.technologies.join(', '))
              
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={item.id || idx}
                  className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/65 p-0 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:bg-card hover:shadow-[0_18px_42px_rgba(var(--primary-rgb),0.08)] group flex flex-col h-full"
                >
                  {/* Card Glowing Line */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent z-10" />

                  {/* Thumbnail area */}
                  <div className="relative h-44 bg-muted/40 border-b border-border/50 flex items-center justify-center p-4 overflow-hidden shrink-0">
                    {image ? (
                      <Image 
                        src={image.startsWith('http') ? image : (image.startsWith('/') ? image : `/${image}`)} 
                        alt={title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-display font-bold uppercase shadow-inner">
                        {title.charAt(0)}
                      </div>
                    )}
                    
                    {/* Action Overlay */}
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 z-20">
                      <button 
                        onClick={() => openDrawer(idx)}
                        className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteItem(idx)}
                        className="bg-destructive text-destructive-foreground p-2.5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-md"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Info area */}
                  <div className="p-5 flex flex-col flex-1 relative z-10 bg-card/40">
                    <h3 className="font-display font-bold text-foreground text-base line-clamp-1 group-hover:text-primary transition-colors">{title}</h3>
                    {subtitle && (
                      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{subtitle}</p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {arrayData?.length === 0 && (
            <div className="col-span-full py-24 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border/70 rounded-2xl bg-card/20 backdrop-blur-sm">
              <PlusCircle className="w-12 h-12 mb-4 text-primary/40" />
              <p className="font-display font-bold text-lg text-foreground">No entries yet</p>
              <p className="text-sm mt-1">Click 'Add New' to create your first content item.</p>
            </div>
          )}
        </div>
      ) : (
        /* Object: Full Page Form View */
        <div className="bg-card/65 p-6 md:p-8 rounded-2xl border border-border/75 shadow-sm backdrop-blur max-w-4xl mx-auto relative overflow-hidden">
          {/* Neon Top highlight */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
          <DynamicForm data={data} onChange={setData} optionsMap={optionsMap} />
        </div>
      )}

      {/* Slide-out Drawer for editing Array items */}
      <AnimatePresence>
        {editingIndex !== null && drawerData && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingIndex(null)}
              className="fixed inset-0 bg-background/60 backdrop-blur-md z-40"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-card/90 backdrop-blur-2xl border-l border-border/80 shadow-2xl z-50 flex flex-col h-[100dvh]"
            >
              {/* Neon Line border */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent z-10" />

              <div className="flex items-center justify-between p-6 border-b border-border/50 shrink-0 relative z-10">
                <h3 className="text-xl font-display font-bold text-foreground capitalize">
                  {editingIndex === -1 ? 'Add New Item' : 'Edit Item'}
                </h3>
                <button 
                  onClick={() => setEditingIndex(null)}
                  className="w-8 h-8 rounded-full bg-muted/65 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/90 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide relative z-10">
                <DynamicForm data={drawerData} onChange={setDrawerData} optionsMap={optionsMap} />
              </div>
              
              <div className="p-6 border-t border-border/50 shrink-0 bg-background/50 backdrop-blur-md relative z-10">
                <button
                  onClick={saveDrawer}
                  className="relative w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 shadow-md overflow-hidden group/drawer-btn"
                >
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover/drawer-btn:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                  Apply Changes
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  )
}
