"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Code2, Shield, Palette, Cloud, ArrowRight } from "lucide-react"
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
      className={cn("min-h-[16rem] list-none group", area)}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="relative h-full flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20">
        
        <div className="flex items-start justify-between mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 bg-secondary group-hover:bg-primary/10">
            <div className="text-muted-foreground group-hover:text-primary transition-colors duration-300">
              {icon}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-border opacity-0 transform translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:border-primary/20">
            <ArrowRight className="w-4 h-4 text-primary" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl md:text-2xl font-display font-bold group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.li>
  );
};

export default function ServicesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="services" className="py-20 md:py-32 bg-background relative">
      <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <Badge variant="outline" className="mb-6 px-4 py-1.5 rounded-full bg-primary/5 border-primary/20 text-primary text-xs font-semibold tracking-[0.2em] uppercase">
            Services
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6">Expert <span className="text-gradient">Solutions</span></h2>
        </motion.div>

        <ul className="grid grid-cols-1 grid-rows-none gap-6 md:grid-cols-12 md:grid-rows-2 lg:gap-8 xl:max-h-[36rem]">
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
                icon={<IconComponent className="h-6 w-6" />}
                title={service.title}
                description={service.description}
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

