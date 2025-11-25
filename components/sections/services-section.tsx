"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Code2, Shield, Palette, Cloud } from "lucide-react"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import servicesData from "@/public/data/services.json"

// Icon mapping for dynamic icon rendering
const iconMap = {
  Shield,
  Code2,
  Cloud,
  Palette,
}

interface ServiceItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  isInView: boolean;
}

const ServiceItem = ({ area, icon, title, description, delay, isInView }: ServiceItemProps) => {
  return (
    <motion.li
      className={cn("min-h-[14rem] list-none", area)}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground">
                {title}
              </h3>
              <p className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
                {description}
              </p>
            </div>
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
    <section id="services" className="py-20 md:py-32 bg-secondary/10">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/20 bg-primary/5 text-primary">
            Services
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Expert Solutions</h2>
          <p className="text-muted-foreground">
            Specialized services tailored to elevate your digital presence with security, performance, and design excellence.
          </p>
        </motion.div>

        <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-2 lg:gap-4 xl:max-h-[34rem]">
          {servicesData.services.map((service, index) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap]

            // Define grid areas for different service layouts
            const gridAreas = [
              "md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/7]",
              "md:[grid-area:1/7/2/13] xl:[grid-area:1/7/2/13]",
              "md:[grid-area:2/1/3/7] xl:[grid-area:2/1/3/7]",
              "md:[grid-area:2/7/3/13] xl:[grid-area:2/7/3/13]"
            ]

            return (
              <ServiceItem
                key={service.id}
                area={gridAreas[index] || ""}
                icon={<IconComponent className="h-4 w-4" />}
                title={service.title}
                description={service.description}
                delay={0.1 * index}
                isInView={isInView}
              />
            )
          })}
        </ul>
      </div>
    </section >
  )
}

