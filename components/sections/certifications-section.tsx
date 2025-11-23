"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
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

function CertificationCard({ certification, index, toggleCertDescription, isExpanded }: {
  certification: Certification,
  index: number,
  toggleCertDescription: (id: number) => void,
  isExpanded: boolean
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 })
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 })

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect()
    x.set(clientX - left - width / 2)
    y.set(clientY - top - height / 2)
  }

  function onMouseLeave() {
    x.set(0)
    y.set(0)
  }

  const rotateX = useTransform(mouseY, [-100, 100], [5, -5])
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      style={{ perspective: 1000 }}
      className="h-full"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="h-full"
      >
        <Card className="h-full bg-card border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-xl group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <CardHeader className="pb-4 relative z-10">
            {/* Header with icon and status */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors shadow-inner">
                <Award className="h-6 w-6 text-primary" />
              </div>
              {certification.status === 'active' ? (
                <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 animate-pulse-slow">
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

            {/* Description with expand/collapse */}
            <div className="mt-3">
              {/* Show expand button only if description is long enough */}
              {certification.description.length > 100 && (
                <>
                  <AnimatePresence mode="wait">
                    {isExpanded && (
                      <motion.div
                        key="description"
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                          marginBottom: 8,
                          transition: {
                            duration: 0.4,
                            ease: "circOut"
                          }
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                          marginBottom: 0,
                          transition: {
                            duration: 0.3,
                            ease: "circIn"
                          }
                        }}
                        style={{ overflow: "hidden" }}
                      >
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {certification.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCertDescription(certification.id);
                    }}
                    className="w-6 h-6 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-all duration-200 group"
                    aria-label={isExpanded ? "Hide description" : "Show description"}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.span
                      className="text-xs font-bold text-primary"
                      animate={{
                        rotate: isExpanded ? 180 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-3 w-3" />
                    </motion.span>
                  </motion.button>
                </>
              )}

              {/* For short descriptions, show them normally */}
              {certification.description.length <= 100 && (
                <motion.p
                  className="text-sm text-muted-foreground leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {certification.description}
                </motion.p>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-0 relative z-10">
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
    </motion.div>
  )
}

export default function CertificationsSection() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [expandedCerts, setExpandedCerts] = useState<Set<number>>(new Set())
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

  const toggleCertDescription = (certId: number) => {
    setExpandedCerts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(certId)) {
        newSet.delete(certId)
      } else {
        newSet.add(certId)
      }
      return newSet
    })
  }

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
              <CertificationCard
                key={certification.id}
                certification={certification}
                index={index}
                toggleCertDescription={toggleCertDescription}
                isExpanded={expandedCerts.has(certification.id)}
              />
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

