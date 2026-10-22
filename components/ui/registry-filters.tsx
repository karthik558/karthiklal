"use client"

import { Button } from "@/components/ui/button"
import SiteSelect from "@/components/ui/site-select"

interface RegistryFiltersProps<T extends string> {
  label: string
  options: { label: string; value: T }[]
  value: T
  onChange: (value: T) => void
  years: number[]
  selectedYear: number | null
  onYearChange: (year: number | null) => void
  count: number
}

export default function RegistryFilters<T extends string>({ label, options, value, onChange, years, selectedYear, onYearChange, count }: RegistryFiltersProps<T>) {
  return <div className="registry-toolbar">
    <div className="registry-tabs" role="group" aria-label={label}>
      {options.map(option => <Button key={option.value} variant={value === option.value ? "default" : "outline"} className="px-3 text-[10px] sm:px-4 sm:text-[11px]" type="button" aria-pressed={value === option.value} onClick={() => onChange(option.value)}>{option.label}</Button>)}
    </div>
    <div className="registry-year">
      <span className="registry-count" aria-live="polite">{String(count).padStart(2, "0")} entries</span>
      <SiteSelect label={`${label} year`} value={selectedYear === null ? "all" : String(selectedYear)} onChange={next => onYearChange(next === "all" ? null : Number(next))} options={[{ value: "all", label: "All years" }, ...[...years].reverse().map(year => ({ value: String(year), label: String(year) }))]} />
    </div>
  </div>
}
