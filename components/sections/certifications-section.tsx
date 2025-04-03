"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, ExternalLink } from "lucide-react"
import Link from "next/link"

const certifications = [
  {
    id: 1,
    title: "Advanced Web Development",
    issuer: "Frontend Masters",
    date: "2023",
    link: "https://example.com",
  },
  {
    id: 2,
    title: "React Expert Certification",
    issuer: "React Training",
    date: "2022",
    link: "https://example.com",
  },
  {
    id: 3,
    title: "UX Design Professional",
    issuer: "Google",
    date: "2022",
    link: "https://example.com",
  },
  {
    id: 4,
    title: "Advanced JavaScript",
    issuer: "Udemy",
    date: "2021",
    link: "https://example.com",
  },
  {
    id: 5,
    title: "Three.js Journey",
    issuer: "Bruno Simon",
    date: "2021",
    link: "https://example.com",
  },
  {
    id: 6,
    title: "Full-Stack Web Development",
    issuer: "Coursera",
    date: "2020",
    link: "https://example.com",
  },
]

export default function CertificationsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

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
            Continuous learning is essential in tech. Here are some of my professional certifications and courses.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((certification, index) => (
            <motion.div
              key={certification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Link
                href={certification.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full interactive"
              >
                <Card className="border border-border/50 bg-card/50 backdrop-blur-sm h-full">
                  <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{certification.title}</CardTitle>
                      <div className="text-sm text-muted-foreground">{certification.issuer}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center pt-2">
                    <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                      {certification.date}
                    </span>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

