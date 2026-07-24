export default function Loading() {
  return (
    <main
      className="min-h-screen animate-pulse bg-background px-4 pt-32 md:px-6"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div className="mx-auto max-w-7xl">
        <div className="h-4 w-40 bg-muted" />
        <div className="mt-6 h-16 max-w-3xl bg-muted md:h-24" />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="h-72 border-2 border-border bg-card" />
          <div className="h-72 border-2 border-border bg-card" />
        </div>
      </div>
    </main>
  )
}
