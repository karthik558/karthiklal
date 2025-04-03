"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Code2, Layout, Layers, Smartphone, PenTool, LineChart, Server, Database } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const services = [
  {
    title: "Web Development",
    description: "Building modern, responsive websites and web applications using the latest technologies.",
    icon: Code2,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "UI/UX Design",
    description: "Creating intuitive, user-friendly interfaces with a focus on usability and accessibility.",
    icon: Layout,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "3D Design & Development",
    description: "Developing immersive 3D experiences and visualizations for the web using Three.js and WebGL.",
    icon: Layers,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Mobile App Development",
    description: "Building cross-platform mobile applications with React Native for iOS and Android.",
    icon: Smartphone,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    title: "Logo & Brand Identity",
    description: "Designing distinctive logos and comprehensive brand identities that communicate your values.",
    icon: PenTool,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    title: "Performance Optimization",
    description: "Enhancing website speed and performance to improve user experience and SEO ranking.",
    icon: LineChart,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    title: "Backend Development",
    description: "Building robust server-side applications with Node.js, Express, and other modern frameworks.",
    icon: Server,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    title: "Database Design",
    description: "Designing efficient, scalable database structures for optimal data management and retrieval.",
    icon: Database,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
]

export default function ServicesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.1 })

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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What I Offer</h2>
          <p className="text-muted-foreground">
            I provide a wide range of services to help businesses and individuals create exceptional digital
            experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <Card className="border border-border/50 bg-card/50 backdrop-blur-sm h-full">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-full ${service.bgColor} flex items-center justify-center mb-4`}>
                    <service.icon className={`h-6 w-6 ${service.color}`} />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{service.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

