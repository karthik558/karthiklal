"use client"

import { motion } from "framer-motion"
import { Check, Cloud, Code2, Palette, Shield } from "lucide-react"
import { SectionHeader } from "@/components/ui/section-header"
import servicesData from "@/public/data/services.json"

const iconMap = { Shield, Code2, Cloud, Palette }

const serviceCapabilities: Record<string, string[]> = {
  "Network Security & Penetration Testing": ["Security audits", "Vulnerability checks", "Policy hardening"],
  "Full Stack Web Development": ["React / Next.js", "Secure backends", "Scalable systems"],
  "Cloud Hosting & Virtualization": ["AWS setup", "VMware management", "Reliable deployments"],
  "Graphic Design & Branding": ["Brand identity", "Marketing assets", "UI/UX design"],
}

export default function ServicesSection() {
  return (
    <section id="services" className="relative overflow-hidden bg-background py-20 md:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0 section-gradient-blend bg-[radial-gradient(900px_circle_at_12%_18%,hsl(var(--primary)/0.11),transparent_62%)]" />
      <div className="container relative z-10">
        <div className="mb-10 lg:mb-12"><SectionHeader eyebrow="Services" title="Expert" highlight="Solutions" align="left" /></div>

        <div className="grid gap-4 md:grid-cols-2">
          {servicesData.services.map((service, index) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap]
            const capabilities = serviceCapabilities[service.title] || []

            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="interactive-surface group rounded-2xl border border-border/70 bg-card/60 p-5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-5">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
                  <span className="font-display text-2xl font-bold text-muted-foreground/20">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-5 font-display text-xl font-bold leading-tight tracking-tight transition-colors group-hover:text-primary md:text-2xl">{service.title}</h3>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{service.description}</p>
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-border/60 pt-4">
                  {capabilities.map((capability) => (
                    <span key={capability} className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/70"><Check className="h-3 w-3 text-primary" />{capability}</span>
                  ))}
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
