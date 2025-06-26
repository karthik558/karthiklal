"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Code2,
  Terminal,
  Shield,
  Cpu,
  Palette,
  Wrench,
} from "lucide-react"

// Define skill categories with their respective skills
const skillCategories = [
  {
    name: "Programming Languages",
    icon: Code2,
    skills: ["Python", "Rust", "TypeScript", "JavaScript", "C", "C++", "SHELL", "BASH"],
  },
  {
    name: "Web Development",
    icon: Terminal,
    skills: ["ReactJS", "NextJS", "HTML", "CSS", "Supabase", "Git"],
  },
  {
    name: "IT Infrastructure & Security",
    icon: Shield,
    skills: ["VMware", "Virtualization", "Wireshark", "NMAP", "BurpSuite", "Acunetix"],
  },
  {
    name: "Systems & Cloud",
    icon: Cpu,
    skills: ["Windows", "Linux", "MacOS", "AWS", "CloudFlare", "VirtualBox"],
  },
  {
    name: "Design & Media",
    icon: Palette,
    skills: ["Photoshop", "Illustrator", "Figma", "UI/UX Design"],
  },
  {
    name: "Enterprise Software",
    icon: Wrench,
    skills: ["Microsoft 365", "Opera", "Micros", "ShawMan", "CPanel"],
  },
]

export default function SkillsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="skills" className="py-20 md:py-32 bg-secondary/10">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-primary font-medium mb-2">Skills & Expertise</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical <span className="text-gradient">Proficiency</span></h2>
          <p className="text-muted-foreground">
            A comprehensive overview of my technical skills and areas of expertise across various domains of software development.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, categoryIndex) => {
            const IconComponent = category.icon
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 + categoryIndex * 0.1 }}
              >
                <Card className="border border-border/50 bg-card/50 backdrop-blur-sm h-full hover:shadow-lg transition-all duration-300 group">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">{category.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{category.skills.length} skills</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill, skillIndex) => (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                          transition={{ 
                            duration: 0.3, 
                            delay: 0.2 + categoryIndex * 0.1 + skillIndex * 0.05 
                          }}
                        >
                          <Badge 
                            variant="secondary" 
                            className="bg-secondary/80 text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-default text-xs py-1"
                          >
                            {skill}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
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
