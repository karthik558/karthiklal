import Link from "next/link"
import { Github, Linkedin, Mail, MapPin } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary/5 border-t border-border">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-6 lg:col-span-1">
            <div>
              <h3 className="text-2xl font-bold">
                KARTHIK <span className="text-gradient">LAL</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs leading-relaxed">
                Creative Technologist specializing in web development, system administration, and cybersecurity solutions.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <Link
                href="https://github.com/karthiklal004"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 group"
              >
                <Github className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://linkedin.com/in/karthiklal004"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 group"
              >
                <Linkedin className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="mailto:dev@karthiklal.in"
                className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 group"
              >
                <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="#about"
                className="text-sm text-muted-foreground hover:text-primary transition-colors py-1"
              >
                About Me
              </Link>
              <Link
                href="#portfolio"
                className="text-sm text-muted-foreground hover:text-primary transition-colors py-1"
              >
                Portfolio
              </Link>
              <Link
                href="#services"
                className="text-sm text-muted-foreground hover:text-primary transition-colors py-1"
              >
                Services
              </Link>
              <Link
                href="#experience"
                className="text-sm text-muted-foreground hover:text-primary transition-colors py-1"
              >
                Experience
              </Link>
              <Link
                href="#skills"
                className="text-sm text-muted-foreground hover:text-primary transition-colors py-1"
              >
                Skills
              </Link>
              <Link
                href="#contact"
                className="text-sm text-muted-foreground hover:text-primary transition-colors py-1"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Get In Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>dev@karthiklal.in</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Lakshadweep, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear}. Designed & Developed by KARTHIK LAL
          </p>
        </div>
      </div>
    </footer>
  )
}

