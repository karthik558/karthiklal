"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Code2, Shield, Palette, Gauge } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  {
    title: "Full-Stack Development",
    description: "Creating modern, scalable web applications with cutting-edge technologies and best practices for optimal performance and user experience.",
    icon: Code2,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Security Assessment",
    description: "Comprehensive penetration testing and security audits to identify vulnerabilities and ensure your applications are protected against cyber threats.",
    icon: Shield,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    title: "Creative Design Solutions",
    description: "Crafting visually stunning and intuitive designs that blend aesthetics with functionality, from brand identities to user interfaces.",
    icon: Palette,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Performance Engineering",
    description: "Optimizing application performance through advanced techniques in caching, load balancing, and code optimization for maximum efficiency.",
    icon: Gauge,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
]

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="border border-border/50 bg-card/50 backdrop-blur-sm h-full hover:border-primary/50 transition-all duration-300">
                <CardHeader>
                  <div className={`w-14 h-14 rounded-full ${service.bgColor} flex items-center justify-center mb-4`}>
                    <service.icon className={`h-7 w-7 ${service.color}`} />
                  </div>
                  <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">{service.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

