"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Code2, Shield, Palette, Gauge, Network, Cloud } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import servicesData from "@/public/data/services.json"

// Icon mapping for dynamic icon rendering
const iconMap = {
  Shield,
  Code2,
  Cloud,
  Palette,
  Network,
  Gauge,
}

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
          <span className="inline-block text-primary font-medium mb-2">Services</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Expert Solutions</h2>
          <p className="text-muted-foreground">
            Specialized services tailored to elevate your digital presence with security, performance, and design excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicesData.services.map((service, index) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap]
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
                className="group"
              >
                <Card className="border border-border/50 bg-card/50 backdrop-blur-sm h-full hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-20 h-20 rounded-2xl ${service.bgColor} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`h-10 w-10 ${service.color} group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                    <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors duration-300">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <CardDescription className="text-muted-foreground leading-relaxed text-sm">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

