"use client"

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
      {options.map(option => <button key={option.value} type="button" aria-pressed={value === option.value} onClick={() => onChange(option.value)}>{option.label}</button>)}
    </div>
    <div className="registry-year">
      <span className="registry-count" aria-live="polite">{String(count).padStart(2, "0")} entries</span>
      <label><span className="sr-only">{label} year</span>
        <select value={selectedYear ?? "all"} onChange={event => onYearChange(event.target.value === "all" ? null : Number(event.target.value))}>
          <option value="all">ALL YEARS</option>
          {[...years].reverse().map(year => <option key={year} value={year}>{year}</option>)}
        </select>
      </label>
    </div>
  </div>
}
