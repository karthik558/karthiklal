export default function Loading() {
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-background px-4 pb-20 pt-32 md:px-6"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/.28)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/.22)_1px,transparent_1px)] bg-[size:56px_56px]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="flex items-center justify-between border-b-2 border-foreground pb-4 font-mono text-[10px] font-black uppercase tracking-[0.2em]">
          <span>Loading route</span>
          <span className="flex items-center gap-2"><span className="h-2 w-2 animate-pulse bg-foreground" /> Assembling interface</span>
        </div>
        <div className="mt-10 animate-pulse">
          <div className="h-3 w-36 bg-muted" />
          <div className="mt-6 h-16 max-w-4xl bg-muted md:h-28" />
          <div className="mt-4 h-4 max-w-2xl bg-muted" />
          <div className="mt-12 grid border-l border-t border-border md:grid-cols-12">
            <div className="h-[360px] border-b border-r border-border bg-card md:col-span-8 md:h-[480px]" />
            <div className="border-b border-r border-border p-7 md:col-span-4">
              <div className="h-3 w-24 bg-muted" />
              <div className="mt-6 h-10 w-4/5 bg-muted" />
              <div className="mt-10 space-y-3">
                <div className="h-3 bg-muted" />
                <div className="h-3 w-5/6 bg-muted" />
                <div className="h-3 w-2/3 bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
