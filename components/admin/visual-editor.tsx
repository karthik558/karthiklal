"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Save, Plus, Trash2, X, Check, Image as ImageIcon, PlusCircle, ArrowUp } from "lucide-react"

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
    <div className="space-y-2 font-mono text-xs uppercase">
      <label className="font-bold text-muted-foreground">{label.replace(/([A-Z])/g, ' $1').trim()}</label>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-24 h-24 border-2 border-border bg-background flex items-center justify-center shrink-0 overflow-hidden">
          {value ? (
            <Image src={value.startsWith('http') ? value : (value.startsWith('/') ? value : `/${value}`)} alt="Preview" fill className="object-cover" unoptimized />
          ) : (
            <ImageIcon className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 w-full">
          <input
            type="text"
            className="w-full bg-background border-2 border-border p-3 text-xs text-foreground uppercase focus:outline-none focus:border-foreground"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/IMAGE-PATH.JPG OR HTTPS://..."
          />
        </div>
      </div>
    </div>
  )
}

const TextareaInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="space-y-2 font-mono text-xs uppercase">
    <label className="font-bold text-muted-foreground">{label.replace(/([A-Z])/g, ' $1').trim()}</label>
    <textarea
      className="w-full bg-background border-2 border-border p-3 text-xs text-foreground uppercase focus:outline-none focus:border-foreground min-h-[120px]"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
)

const TextInput = ({ label, value, onChange, type = "text", options = [] }: { label: string; value: string | number; onChange: (v: any) => void; type?: string; options?: string[] }) => {
  const listId = options.length > 0 ? `${label.replace(/\s+/g, '-')}-options` : undefined;
  return (
    <div className="space-y-2 font-mono text-xs uppercase">
      <label className="font-bold text-muted-foreground">{label.replace(/([A-Z])/g, ' $1').trim()}</label>
      <input
        type={type}
        list={listId}
        className="w-full bg-background border-2 border-border p-3 text-xs text-foreground uppercase focus:outline-none focus:border-foreground"
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
  <div className="flex items-center justify-between p-4 border-2 border-border bg-card font-mono text-xs uppercase">
    <label className="font-bold text-foreground cursor-pointer" onClick={() => onChange(!value)}>
      {label.replace(/([A-Z])/g, ' $1').trim()}
    </label>
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`px-4 py-1.5 border border-foreground font-bold text-xs uppercase ${value ? 'bg-foreground text-background' : 'bg-background text-muted-foreground'}`}
    >
      {value ? "ENABLED" : "DISABLED"}
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
    <div className="space-y-2 font-mono text-xs uppercase">
      <label className="font-bold text-muted-foreground">{label.replace(/([A-Z])/g, ' $1').trim()}</label>
      <div className="p-3 bg-background border-2 border-border flex flex-wrap gap-2 items-center">
        {value.map((tag, i) => (
          <span key={i} className="flex items-center gap-1.5 bg-foreground text-background font-bold text-xs px-2.5 py-1 uppercase">
            {tag}
            <button onClick={() => onChange(value.filter((_, idx) => idx !== i))} className="hover:opacity-70">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          list={listId}
          className="flex-1 bg-transparent min-w-[120px] text-xs focus:outline-none text-foreground uppercase placeholder:text-muted-foreground"
          placeholder="TYPE AND PRESS ENTER..."
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
        const isImage = key.toLowerCase().match(/image|logo|avatar|photo/)
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

  const moveToTop = (index: number) => {
    if (!arrayData || index === 0) return
    const newData = [...arrayData]
    const itemToMove = newData.splice(index, 1)[0]
    newData.unshift(itemToMove)

    // Automatically reassign sequential IDs if objects have numeric ids
    if (newData.length > 0 && typeof newData[0].id === 'number') {
      newData.forEach((item, idx) => {
        item.id = idx + 1
      })
    }

    setData(wrapperKey ? { [wrapperKey]: newData } : newData)
  }

  // Compute autocomplete options based on existing arrayData
  const optionsMap: Record<string, string[]> = {}
  if (arrayData) {
    optionsMap['category'] = Array.from(new Set(arrayData.map((item: any) => item.category).filter(Boolean))) as string[]
    optionsMap['technologies'] = Array.from(new Set(arrayData.flatMap((item: any) => item.technologies || []).filter(Boolean))) as string[]
  }

  return (
    <div className="space-y-8 pb-20 relative font-mono text-xs uppercase">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-2 border-foreground bg-card p-6 shadow-2xl sticky top-0 z-20 gap-4">
        <div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mb-1">
            MODULE EDITOR // {modelName.toUpperCase()}
          </div>
          <h2 className="font-display text-3xl font-black uppercase text-foreground">{modelName.replace("-", " ")}</h2>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {isArrayModel && (
            <button
              onClick={openNewDrawer}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 border-2 border-border bg-background px-5 py-3 text-foreground font-bold hover:border-foreground transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              ADD NEW RECORD
            </button>
          )}
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 border-2 border-foreground bg-foreground text-background font-bold px-6 py-3 hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <span>SAVING...</span>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4" /> SAVED
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> SAVE CHANGES
              </>
            )}
          </button>
        </div>
      </div>

      {/* Array: Grid View */}
      {isArrayModel ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {arrayData?.map((item: any, idx: number) => {
              const title = item.title || item.name || item.company || item.platform || `Item ${idx + 1}`
              const image = item.image || item.logo || item.avatar
              const subtitle = item.category || item.role || item.position || (item.technologies && item.technologies.join(', '))
              
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  key={item.id || idx}
                  className="border-2 border-border bg-card hover:border-foreground transition-all duration-300 group flex flex-col justify-between"
                >
                  {/* Thumbnail area */}
                  <div className="relative h-44 bg-background border-b-2 border-border flex items-center justify-center overflow-hidden shrink-0">
                    {image ? (
                      <Image 
                        src={image.startsWith('http') ? image : (image.startsWith('/') ? image : `/${image}`)} 
                        alt={title} 
                        fill 
                        className="object-cover grayscale contrast-125 transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                        unoptimized
                      />
                    ) : (
                      <div className="w-12 h-12 border border-border bg-card flex items-center justify-center text-foreground font-display font-black text-xl">
                        {title.charAt(0)}
                      </div>
                    )}
                    
                    {/* Action Overlay */}
                    <div className="absolute inset-0 bg-background/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 z-20">
                      {idx > 0 && (
                        <button 
                          onClick={() => moveToTop(idx)}
                          className="p-2.5 border border-border bg-card text-foreground hover:border-foreground"
                          title="Move to Top"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => openDrawer(idx)}
                        className="px-4 py-2 bg-foreground text-background font-bold text-xs uppercase"
                      >
                        EDIT
                      </button>
                      <button 
                        onClick={() => deleteItem(idx)}
                        className="p-2.5 border border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Info area */}
                  <div className="p-4 flex flex-col justify-between flex-1 space-y-2">
                    <h3 className="font-display font-black text-foreground text-lg uppercase truncate">{title}</h3>
                    {subtitle && (
                      <p className="font-mono text-xs text-muted-foreground truncate">{subtitle}</p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {arrayData?.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border bg-card">
              <PlusCircle className="w-10 h-10 mb-3 text-foreground" />
              <p className="font-display font-black text-xl text-foreground">NO RECORDS CREATED</p>
              <p className="text-xs mt-1">CLICK 'ADD NEW RECORD' TO INITIALIZE DATA.</p>
            </div>
          )}
        </div>
      ) : (
        /* Object: Full Page Form View */
        <div className="border-2 border-foreground bg-card p-6 md:p-8 max-w-4xl mx-auto space-y-6">
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
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 right-0 w-full max-w-lg bg-card border-l-2 border-foreground shadow-2xl z-50 flex flex-col h-[100dvh] font-mono text-xs uppercase"
            >
              <div className="flex items-center justify-between p-6 border-b-2 border-border shrink-0">
                <h3 className="font-display text-2xl font-black uppercase text-foreground">
                  {editingIndex === -1 ? 'ADD NEW ITEM' : 'EDIT ITEM'}
                </h3>
                <button 
                  onClick={() => setEditingIndex(null)}
                  className="p-2 border-2 border-foreground bg-foreground text-background font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <DynamicForm data={drawerData} onChange={setDrawerData} optionsMap={optionsMap} />
              </div>
              
              <div className="p-6 border-t-2 border-border shrink-0 bg-background">
                <button
                  onClick={saveDrawer}
                  className="w-full bg-foreground text-background py-4 font-bold uppercase tracking-wider border border-foreground hover:bg-foreground/90 transition-colors"
                >
                  APPLY CHANGES
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  )
}

