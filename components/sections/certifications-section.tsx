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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional Certifications</h2>
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
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group"
            >
              <Card className="border border-border/50 bg-card/50 backdrop-blur-sm h-full transition-all duration-300 hover:border-primary/50 hover:shadow-lg group-hover:shadow-xl">
                  <CardHeader className="space-y-4 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      {certification.status === 'active' ? (
                        <Badge variant="default" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">
                          <Clock className="w-3 h-3 mr-1" />
                          Expiring
                        </Badge>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg transition-colors group-hover:text-primary">
                        {certification.title}
                      </CardTitle>
                      <div className="text-sm text-muted-foreground mt-1">{certification.issuer}</div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {certification.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center pt-2 border-t border-border/50">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Credential ID</div>
                        <div className="text-xs font-medium">{certification.credentialId}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                          {certification.date}
                        </span>
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
              className="rounded-full interactive"
            >
              {showAll ? (
                <>
                  Show Less
                  <ChevronUp className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Show More ({certifications.length - 3} more)
                  <ChevronDown className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  )
}

