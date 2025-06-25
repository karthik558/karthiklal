import { Button } from "@/components/ui/button"
import { ArrowDown, Download, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function HeroSectionStatic() {
  return (
    <div className="relative">
      {/* Extended background that covers hero and bleeds into next section */}
      <div className="absolute inset-0 h-[120vh] bg-gradient-to-br from-primary/3 via-background to-background"></div>
      
      <section className="relative min-h-screen flex items-center">
        {/* Content */}
        <div className="container relative z-10 mt-24 lg:mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="relative inline-block">
              <span className="bg-primary/20 text-primary text-sm font-semibold px-4 py-2 rounded-full animate-item">
                Web & Linux Developer
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold animate-item">
              Hi there, I'm <span className="text-primary">Karthik Lal</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-xl animate-item mx-auto lg:mx-0">
              Creative Technologist | Web & Linux Developer
            </p>

            <div className="flex flex-wrap gap-4 pt-4 animate-item justify-center lg:justify-start">
              <Button asChild size="lg" className="rounded-full button">
                <Link href="#portfolio">
                  View My Work
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="rounded-full button">
                <Link href="#" download>
                  Download CV
                  <Download className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="hidden lg:block">
            {/* Static image instead of 3D */}
            <div className="relative max-w-sm mx-auto">
              <div className="absolute -left-4 -top-4 w-24 h-24 bg-primary/10 rounded-lg"></div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/20 rounded-lg rotate-on-scroll"></div>
              <div className="relative rounded-lg overflow-hidden border-2 border-primary/20 shadow-xl">
                <img
                  src="/1.jpg"
                  alt="Karthik Lal - Profile Picture"
                  width={400}
                  height={480}
                  className="w-full h-auto object-cover"
                  data-speed="0.2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-0 right-0 z-10 animate-item flex justify-center">
        <Link href="#about" className="block">
          <div className="flex flex-col items-center group cursor-pointer">
            {/* Animated scroll wheel */}
            <div className="relative w-6 h-10 border-2 border-foreground/30 rounded-full mb-3 group-hover:border-primary transition-colors duration-300">
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-foreground/30 rounded-full animate-pulse group-hover:bg-primary transition-colors duration-300"></div>
            </div>
            
            {/* Text */}
            <span className="text-xs font-medium text-foreground/70 group-hover:text-primary transition-colors duration-300">
              Scroll Down
            </span>
          </div>
        </Link>
      </div>
      </section>
    </div>
  )
}

