import { Button } from "@/components/ui/button"
import { ArrowDown, Download, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HeroSectionStatic() {
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background with gradient instead of 3D */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-background"></div>

      {/* Content */}
      <div className="container relative z-10 mt-24 lg:mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="relative inline-block">
              <span className="bg-primary/20 text-primary text-sm font-semibold px-4 py-2 rounded-full">
                Full-Stack Developer
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Hi, I'm <span className="text-primary">Karthik Lal</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-xl">
              I create immersive digital experiences with modern web technologies, focusing on interactive design and
              seamless functionality.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg" className="rounded-full">
                <Link href="#portfolio">
                  View My Work
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link href="#" download>
                  Download CV
                  <Download className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="hidden lg:block">
            {/* Static image instead of 3D */}
            <div className="relative">
              <div className="absolute -left-4 -top-4 w-24 h-24 bg-primary/10 rounded-lg"></div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/20 rounded-lg"></div>
              <div className="relative rounded-lg overflow-hidden border-2 border-primary/20 shadow-xl">
                <Image
                  src="/placeholder.svg?height=600&width=500"
                  alt="3D Visualization"
                  width={500}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <Link
          href="#about"
          className="flex flex-col items-center text-foreground/70 hover:text-primary transition-colors"
        >
          <span className="text-sm mb-2">Scroll Down</span>
          <ArrowDown className="h-5 w-5 animate-bounce" />
        </Link>
      </div>
    </section>
  )
}

