"use client"

import { Button } from "@/components/ui/button"
import { Download, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-32 bg-secondary/10 relative z-10">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image column */}
          <div className="relative mx-auto lg:mx-0 max-w-xs lg:max-w-sm" data-speed="1.1">
            <div className="relative">
              <div className="absolute -left-4 -top-4 w-24 h-24 bg-primary/10 rounded-lg" data-speed="0.9"></div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/20 rounded-lg" data-speed="1.2"></div>
              <div className="relative rounded-lg overflow-hidden border-2 border-primary/20 shadow-xl">
                <img
                  src="/user/1.jpg"
                  alt="Karthik Lal - About Picture"
                  width={350}
                  height={420}
                  className="w-full h-auto object-cover animate-item"
                  data-speed="1.0"
                />
              </div>
            </div>
          </div>

          {/* Content column */}
          <div className="space-y-6" data-speed="0.95">
            <div>
              <span className="inline-block text-primary font-medium mb-2 animate-item">
                About Me
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-item">
                <span className="text-gradient">Hey there!</span>
              </h2>
            </div>

            <p className="text-muted-foreground leading-relaxed animate-item">
              Driven IT Manager and developer with a strong background in cybersecurity and network management. With 6.8+ years of experience in IT operations, I currently manage infrastructure at IHCL, focusing on network security, guest connectivity, and in-room technology solutions.
            </p>

            <p className="text-muted-foreground leading-relaxed animate-item">
              Passionate about building secure, scalable systems and improving digital experiences for users. Experienced in leading IT operations for hospitality, designing modern web applications, and delivering hands-on support. Always learning, currently pursuing MCA to expand technical and leadership skills.
            </p>

            {/* Personal details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 animate-item">
              <div>
                <p className="text-sm text-muted-foreground">Name:</p>
                <p className="font-medium">Karthik Lal</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email:</p>
                <a href="mailto:dev@karthiklal.in" className="font-medium text-primary hover:underline transition-colors">dev@karthiklal.in</a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location:</p>
                <p className="font-medium">Kerala, India</p>
              </div>
            </div>

            {/* Signature */}
            <div className="flex justify-start animate-item">
              <div className="relative">
                <img
                  src="/signature/signature-light.png"
                  alt="Karthik Lal Signature"
                  className="h-16 w-auto dark:hidden"
                />
                <img
                  src="/signature/signature-dark.png"
                  alt="Karthik Lal Signature"
                  className="h-16 w-auto hidden dark:block"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-4 animate-item">
              <Button asChild size="lg" className="interactive rounded-full button">
                <Link href="/contact">
                  Let's Talk
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="interactive rounded-full button">
                <Link href="#" download>
                  Download CV
                  <Download className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

