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
      <label className="text-sm font-semibold text-foreground capitalize">{label.replace(/([A-Z])/g, ' $1').trim()}</label>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-muted border-2 border-border border-dashed flex items-center justify-center shrink-0">
          {value ? (
            <Image src={value.startsWith('http') ? value : (value.startsWith('/') ? value : `/${value}`)} alt="Preview" fill className="object-cover" unoptimized />
          ) : (
            <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
          )}
        </div>
        <div className="flex-1 w-full">
          <input
            type="text"
            className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
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
    <label className="text-sm font-semibold text-foreground capitalize">{label.replace(/([A-Z])/g, ' $1').trim()}</label>
    <textarea
      className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[120px]"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
)

const TextInput = ({ label, value, onChange, type = "text", options = [] }: { label: string; value: string | number; onChange: (v: any) => void; type?: string; options?: string[] }) => {
  const listId = options.length > 0 ? `${label.replace(/\s+/g, '-')}-options` : undefined;
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-foreground capitalize">{label.replace(/([A-Z])/g, ' $1').trim()}</label>
      <input
        type={type}
        list={listId}
        className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
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
  <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50">
    <label className="text-sm font-semibold text-foreground capitalize cursor-pointer" onClick={() => onChange(!value)}>
      {label.replace(/([A-Z])/g, ' $1').trim()}
    </label>
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-300 ${value ? 'bg-primary' : 'bg-muted-foreground/30'}`}
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
      <label className="text-sm font-semibold text-foreground capitalize">{label.replace(/([A-Z])/g, ' $1').trim()}</label>
      <div className="p-3 bg-background border border-border rounded-lg flex flex-wrap gap-2 items-center focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
        {value.map((tag, i) => (
          <span key={i} className="flex items-center gap-1 bg-primary/15 text-primary text-xs font-semibold px-2 py-1 rounded-md">
            {tag}
            <button onClick={() => onChange(value.filter((_, idx) => idx !== i))} className="hover:text-destructive transition-colors">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          list={listId}
          className="flex-1 bg-transparent min-w-[120px] text-sm focus:outline-none"
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
    <div className="space-y-6 pb-20 relative">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-card p-4 sm:p-6 rounded-2xl border border-border shadow-sm sticky top-0 z-20 backdrop-blur-md bg-card/80 gap-4">
        <div>
          <h2 className="text-2xl font-bold capitalize text-foreground">{modelName.replace("-", " ")}</h2>
          <p className="text-sm text-muted-foreground mt-1">Visually manage your content entries</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {isArrayModel && (
            <button
              onClick={openNewDrawer}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-4 py-2.5 rounded-full font-semibold hover:bg-secondary/80 transition-all shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Add New
            </button>
          )}
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
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
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={item.id || idx}
                  className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full"
                >
                  {/* Thumbnail area */}
                  <div className="relative h-40 bg-muted border-b border-border/50 flex items-center justify-center p-4">
                    {image ? (
                      <Image 
                        src={image.startsWith('http') ? image : (image.startsWith('/') ? image : `/${image}`)} 
                        alt={title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold uppercase">
                        {title.charAt(0)}
                      </div>
                    )}
                    
                    {/* Action Overlay */}
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button 
                        onClick={() => openDrawer(idx)}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold text-sm hover:scale-105 transition-transform"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteItem(idx)}
                        className="bg-destructive text-destructive-foreground p-2 rounded-full hover:scale-105 transition-transform"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Info area */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-foreground line-clamp-1">{title}</h3>
                    {subtitle && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{subtitle}</p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {arrayData?.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-2xl">
              <PlusCircle className="w-12 h-12 mb-4 opacity-50" />
              <p className="font-semibold text-lg">No entries yet</p>
              <p className="text-sm">Click 'Add New' to create your first item.</p>
            </div>
          )}
        </div>
      ) : (
        /* Object: Full Page Form View */
        <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm max-w-4xl mx-auto">
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
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-card border-l border-border shadow-2xl z-50 flex flex-col h-[100dvh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-border/50 shrink-0">
                <h3 className="text-xl font-bold text-foreground capitalize">
                  {editingIndex === -1 ? 'Add New Item' : 'Edit Item'}
                </h3>
                <button 
                  onClick={() => setEditingIndex(null)}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                <DynamicForm data={drawerData} onChange={setDrawerData} optionsMap={optionsMap} />
              </div>
              
              <div className="p-6 border-t border-border/50 shrink-0 bg-background/50 backdrop-blur-md">
                <button
                  onClick={saveDrawer}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
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
