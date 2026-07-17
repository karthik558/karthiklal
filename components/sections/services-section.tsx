"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { CheckCircle2, Code2, Shield, Palette, Cloud } from "lucide-react"
import { SectionHeader } from "@/components/ui/section-header"
import servicesData from "@/public/data/services.json"

// Icon mapping for dynamic icon rendering
const iconMap = {
  Shield,
  Code2,
  Cloud,
  Palette,
}

interface ServiceItemProps {
  index: number
  icon: React.ReactNode
  title: string
  description: string
  capabilities: string[]
  delay: number
  isInView: boolean
}

const serviceCapabilities: Record<string, string[]> = {
  "Network Security & Penetration Testing": ["Security audits", "Vulnerability checks", "Policy hardening"],
  "Full Stack Web Development": ["React / Next.js", "Secure backends", "Scalable systems"],
  "Cloud Hosting & Virtualization": ["AWS setup", "VMware management", "Reliable deployments"],
  "Graphic Design & Branding": ["Brand identity", "Marketing assets", "UI/UX design"],
}

const ServiceItem = ({ index, icon, title, description, capabilities, delay, isInView }: ServiceItemProps) => {
  return (
    <motion.li
      className="group list-none"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="relative h-full overflow-hidden rounded-lg border border-border/70 bg-card/75 p-4 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:bg-card hover:shadow-[0_18px_42px_rgba(var(--primary-rgb),0.12)] md:p-5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(420px_circle_at_20%_0%,hsl(var(--primary)/0.10),transparent_42%)] opacity-0 transition duration-500 group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

        <div className="relative z-10 flex h-full flex-col">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary shadow-inner transition group-hover:bg-primary group-hover:text-primary-foreground">
              {icon}
            </div>
            <span className="font-display text-2xl font-bold leading-none text-muted-foreground/25 transition group-hover:text-primary/30">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-display font-bold leading-tight text-foreground transition group-hover:text-primary">
              {title}
            </h3>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="mt-auto flex flex-wrap gap-2 pt-5">
            {capabilities.map((capability) => (
              <div key={capability} className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-secondary/45 px-2.5 py-1 text-xs font-medium text-foreground/80">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span>{capability}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.li>
  );
};

export default function ServicesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="services" className="relative overflow-hidden bg-background py-16 md:py-24">
      <div className="absolute inset-0 section-gradient-blend bg-[radial-gradient(900px_circle_at_12%_18%,hsl(var(--primary)/0.11),transparent_62%)]" />
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

      <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <SectionHeader eyebrow="Services" title="Expert" highlight="Solutions" align="left" />
        </motion.div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {servicesData.services.map((service, index) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap]

            return (
              <ServiceItem
                key={service.id}
                index={index}
                icon={<IconComponent className="h-6 w-6" />}
                title={service.title}
                description={service.description}
                capabilities={serviceCapabilities[service.title] || []}
                delay={0.1 * index}
                isInView={isInView}
              />
            )
          })}
        </ul>
      </div>
    </section>
  )
}
