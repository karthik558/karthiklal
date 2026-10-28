import NavHeader from "@/components/ui/nav-header"

export default function NavBar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-[9999] w-full isolate pointer-events-none pt-2.5 sm:pt-3.5">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 flex justify-center">
        <NavHeader />
      </div>
    </header>
  )
}
