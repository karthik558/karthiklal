"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Code2, Shield, Palette, Gauge, Network, Cloud } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  {
    title: "IT Infrastructure Management",
    description: "Comprehensive IT operations management including property management systems, network configuration, and daily IT support for hospitality and enterprise environments.",
    icon: Network,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Network Security & Penetration Testing",
    description: "Advanced cybersecurity services including penetration testing, security audits, vulnerability assessments, and implementation of robust security policies and protocols.",
    icon: Shield,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    title: "Full Stack Web Development",
    description: "Modern web application development using React, Next.js, TypeScript, and Rust. Creating scalable, secure solutions from frontend interfaces to backend systems.",
    icon: Code2,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Cloud Hosting & Virtualization",
    description: "Cloud infrastructure setup and management using AWS, VMware virtualization, and modern hosting solutions to ensure scalable and reliable systems.",
    icon: Cloud,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Graphic Design & Branding",
    description: "Creative design solutions including marketing materials, brand identities, and UI/UX design using Photoshop, Illustrator, and modern design tools.",
    icon: Palette,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    title: "IT Support & Training",
    description: "Comprehensive IT support services, staff training programs, vendor coordination, and technical troubleshooting for enterprise and hospitality environments.",
    icon: Gauge,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

