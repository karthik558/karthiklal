"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, CheckCircle, Clock, ChevronDown, ChevronUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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

export default function CertificationsSection() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  useEffect(() => {
    // Load certifications from JSON
    fetch('/data/certifications.json')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        setCertifications(data.certifications)
        setLoading(false)
      })
      .catch(error => {
        console.error('Failed to load certifications:', error)
        setLoading(false)
      })
  }, [])

  const displayedCertifications = showAll ? certifications : certifications.slice(0, 3)

  const handleShowMore = () => {
    if (showAll) {
      // When collapsing, scroll back to the certifications section
      setShowAll(false)
      setTimeout(() => {
        ref.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        })
      }, 100)
    } else {
      setShowAll(true)
    }
  }

  return (
    <section id="certifications" className="py-20 md:py-32 bg-secondary/10">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-primary font-medium mb-2">Certifications</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional <span className="text-gradient">Achievements</span></h2>
          <p className="text-muted-foreground">
            Continuous learning is essential in tech. Here are some of my professional certifications and achievements.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-64 bg-muted/50 rounded-lg animate-pulse"
              />
            ))
          ) : (
            displayedCertifications.map((certification, index) => (
            <motion.div
              key={certification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group"
            >
              <Card className="h-full bg-card border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg group">
                <CardHeader className="pb-4">
                  {/* Header with icon and status */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    {certification.status === 'active' ? (
                      <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400">
                        <Clock className="w-3 h-3 mr-1" />
                        Expiring
                      </Badge>
                    )}
                  </div>

                  {/* Title and issuer */}
                  <div className="space-y-2">
                    <CardTitle className="text-lg font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {certification.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground font-medium">
                      {certification.issuer}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mt-3">
                    {certification.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Divider */}
                  <div className="border-t border-border/50 mb-4"></div>
                  
                  {/* Bottom section with details */}
                  <div className="space-y-3">
                    {/* Credential ID */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                        Credential ID
                      </span>
                      <span className="text-xs font-mono bg-secondary px-2 py-1 rounded text-foreground">
                        {certification.credentialId}
                      </span>
                    </div>
                    
                    {/* Dates */}
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Issued:</span>
                        <span className="font-medium text-foreground">{certification.date}</span>
                      </div>
                      {certification.expiryDate && (
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">Expires:</span>
                          <span className="font-medium text-foreground">{certification.expiryDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            ))
          )}
        </div>

        {/* Show More/Less Button */}
        {certifications.length > 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center mt-12"
          >
            <Button
              onClick={handleShowMore}
              variant="outline"
              size="lg"
              className="rounded-full hover:bg-primary hover:text-primary-foreground border-primary/30 hover:border-primary transition-all duration-300 group"
            >
              {showAll ? (
                <>
                  <ChevronUp className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                  Show {certifications.length - 3} More Certifications
                </>
              )}
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  )
}

