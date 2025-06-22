"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, ExternalLink, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const certifications = [
  {
    id: 1,
    title: "Certified Ethical Hacking (CEH)",
    issuer: "EC-Council",
    date: "Jun 2021",
    expiryDate: "Jun 2024",
    credentialId: "CEH-2021",
    status: "active",
    description: "Comprehensive ethical hacking certification covering penetration testing, vulnerability assessment, and cybersecurity best practices.",
    link: "https://www.eccouncil.org/",
  },
  {
    id: 2,
    title: "Git Certified Specialist",
    issuer: "GitKraken",
    date: "Apr 2023",
    expiryDate: "No Expiry",
    credentialId: "GK-GIT-2023",
    status: "active",
    description: "Professional certification in Git version control, covering advanced Git workflows, branching strategies, and collaboration techniques.",
    link: "https://www.gitkraken.com/",
  },
  {
    id: 3,
    title: "LFD103: A Beginner's Guide to Linux Kernel Development",
    issuer: "The Linux Foundation",
    date: "Feb 2023",
    expiryDate: "No Expiry",
    credentialId: "LF-LKD-2023",
    status: "active",
    description: "Comprehensive course on Linux kernel development fundamentals, covering kernel architecture and development practices.",
    link: "https://www.linuxfoundation.org/",
  },
  {
    id: 4,
    title: "Programming in C & Object Oriented Programming using C++",
    issuer: "NIST Computer Education Center",
    date: "Dec 2021",
    expiryDate: "No Expiry",
    credentialId: "NIST-CPP-2021",
    status: "active",
    description: "Advanced programming certification covering C fundamentals and object-oriented programming concepts in C++.",
    link: "https://nist.edu/",
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
            Continuous learning is essential in tech. Here are some of my professional certifications and achievements.
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
              className="group"
            >
              <Link
                href={certification.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
              >
                <Card className="border border-border/50 bg-card/50 backdrop-blur-sm h-full hover:border-primary/50 transition-all duration-300">
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
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
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
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
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

