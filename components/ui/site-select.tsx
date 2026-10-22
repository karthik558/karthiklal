"use client"

import { useEffect, useId, useRef, useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SiteSelectProps {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}

export default function SiteSelect({ label, value, options, onChange }: SiteSelectProps) {
  const id = useId()
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [keyboardNavigation, setKeyboardNavigation] = useState(true)
  const selectedIndex = Math.max(0, options.findIndex(option => option.value === value))

  useEffect(() => {
    if (!open) return
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", close)
    return () => document.removeEventListener("pointerdown", close)
  }, [open])

  useEffect(() => {
    if (!open || !keyboardNavigation) return
    const list = document.getElementById(`${id}-list`)
    const option = document.getElementById(`${id}-${active}`)
    if (!list || !option) return
    // Scroll only this menu; never move the page or follow pointer hover.
    const top = option.offsetTop
    const bottom = top + option.offsetHeight
    if (top < list.scrollTop) list.scrollTop = top
    else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight
  }, [active, id, open, keyboardNavigation])

  const choose = (index: number) => {
    onChange(options[index].value)
    setOpen(false)
    trigger.current?.focus()
  }

  return (
    <div ref={root} className="relative min-w-36">
      <Button
        ref={trigger}
        type="button"
        variant="outline"
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-haspopup="listbox"
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        className="w-full justify-between px-4 text-[11px]"
        onClick={() => { setKeyboardNavigation(true); setActive(selectedIndex); setOpen(current => !current) }}
        onBlur={event => { if (!root.current?.contains(event.relatedTarget)) setOpen(false) }}
        onKeyDown={event => {
          setKeyboardNavigation(true)
          if (event.key === "Escape" || event.key === "Tab") { setOpen(false); return }
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault()
            const direction = event.key === "ArrowDown" ? 1 : -1
            if (!open) { setActive(selectedIndex); setOpen(true) }
            else setActive(current => (current + direction + options.length) % options.length)
          } else if (event.key === "Home" || event.key === "End") {
            event.preventDefault(); setOpen(true); setActive(event.key === "Home" ? 0 : options.length - 1)
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            if (open) choose(active)
            else { setActive(selectedIndex); setOpen(true) }
          }
        }}
      >
        {options[selectedIndex].label}
        <ChevronDown className={`transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
      </Button>
      {open && (
        <ul id={`${id}-list`} role="listbox" aria-label={label} data-lenis-prevent className="absolute right-0 top-full z-50 mt-2 max-h-64 w-full min-w-40 overflow-y-auto overscroll-contain border-2 border-foreground bg-card p-1 shadow-[4px_4px_0_hsl(var(--border))]">
          {options.map((option, index) => (
            <li key={option.value} id={`${id}-${index}`} role="option" aria-selected={value === option.value}
              onPointerMove={() => { setKeyboardNavigation(false); setActive(index) }}
              onMouseDown={event => event.preventDefault()}
              onClick={() => choose(index)}
              className={`flex min-h-11 cursor-pointer items-center justify-between gap-4 px-3 font-mono text-xs font-bold uppercase tracking-wider ${active === index ? "bg-foreground text-background" : "text-foreground"}`}
            >
              {option.label}{value === option.value && <Check aria-hidden="true" className="h-3.5 w-3.5" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
