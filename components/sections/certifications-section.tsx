"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useMotionTemplate, useMotionValue } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, CheckCircle, Clock, ExternalLink, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface Certification {
  id: number
  title: string
  issuer: string
  date: string
  expiryDate: string
  credentialId: string
  status: string
  description: string
}

function AchievementCard({ certification, index }: { certification: Certification, index: number }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative h-full"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary/50 to-primary/50 opacity-0 transition duration-300 group-hover:opacity-100" />
      <Card className="relative h-full border border-border/50 bg-card/90 backdrop-blur-sm transition-all duration-300 overflow-hidden">
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                650px circle at ${mouseX}px ${mouseY}px,
                rgba(var(--primary-rgb), 0.15),
                transparent 80%
              )
            `,
          }}
        />
        
        <CardHeader className="pb-4 relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <Badge 
              variant="outline" 
              className={cn(
                "px-3 py-1 border-primary/20 bg-primary/5",
                certification.status === 'active' ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"
              )}
            >
              {certification.status === 'active' ? "Active" : "Expiring"}
            </Badge>
          </div>
          
          <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {certification.title}
          </CardTitle>
          <p className="text-sm font-medium text-muted-foreground">
            {certification.issuer}
          </p>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <p className="text-sm text-muted-foreground/80 line-clamp-3 mb-4 leading-relaxed">
            {certification.description}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{certification.date}</span>
            </div>
            {/* ID Badge */}
            <span className="text-[10px] font-mono bg-secondary/50 px-2 py-1 rounded text-muted-foreground">
              {certification.credentialId}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function CertificationsSection() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/certifications.json')
      .then(res => res.json())
      .then(data => {
        setCertifications(data.certifications)
        setLoading(false)
      })
      .catch(error => {
        console.error('Failed to load certifications:', error)
        setLoading(false)
      })
  }, [])

  if (loading) return null

  return (
    <section id="certifications" className="py-20 md:py-32 bg-secondary/10">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/20 bg-primary/5 text-primary">
            Certifications
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional <span className="text-gradient">Achievements</span></h2>
          <p className="text-muted-foreground">
            Continuous learning is essential in tech. Here are some of my professional certifications and achievements.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6">
          {certifications.map((cert, index) => (
            <div key={cert.id} className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
              <AchievementCard certification={cert} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

