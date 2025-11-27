"use client"

import { useRef, useState } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { Card, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BriefcaseIcon, GraduationCap, ChevronDown, ChevronUp, Calendar, Building2 } from "lucide-react"
import experiencesData from "@/public/data/experiences.json"
import { AnimatedButton } from "@/components/ui/animated-button"

export default function ExperienceSection() {
  const [showAllWork, setShowAllWork] = useState(false)
  const [showAllEducation, setShowAllEducation] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  // Scroll progress for timeline line
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const lineHeight = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"])

  const workExperiences = experiencesData.experiences.filter((exp) => exp.type === "work")
  const educationExperiences = experiencesData.experiences.filter((exp) => exp.type === "education")

  const displayedWorkExperiences = showAllWork ? workExperiences : workExperiences.slice(0, 3)
  const displayedEducationExperiences = showAllEducation ? educationExperiences : educationExperiences.slice(0, 3)

  const handleShowMoreWork = () => {
    if (showAllWork) {
      setShowAllWork(false)
      setTimeout(() => {
        ref.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        })
      }, 100)
    } else {
      setShowAllWork(true)
    }
  }

  const handleShowMoreEducation = () => {
    if (showAllEducation) {
      setShowAllEducation(false)
      setTimeout(() => {
        ref.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        })
      }, 100)
    } else {
      setShowAllEducation(true)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  return (
    <section id="experience" className="py-24 md:py-32 bg-secondary/5 relative overflow-hidden">


      <div className="container max-w-6xl mx-auto relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/20 bg-primary/5 text-primary">
            Career Path
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            Experience & <span className="text-gradient">Education</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            My professional journey and academic milestones that have shaped my skills and expertise in the tech industry.
          </p>
        </motion.div>

        <Tabs defaultValue="experience" className="w-full">
          <div className="flex justify-center mb-16">
            <TabsList className="grid w-full max-w-md grid-cols-2 h-14 p-1 bg-secondary/50 backdrop-blur-xl border border-border/40 rounded-full shadow-lg">
              <TabsTrigger
                value="experience"
                className="rounded-full h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300 font-medium text-base"
              >
                <BriefcaseIcon className="w-4 h-4 mr-2" />
                Experience
              </TabsTrigger>
              <TabsTrigger
                value="education"
                className="rounded-full h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300 font-medium text-base"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Education
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="experience" className="relative">
            <Timeline items={displayedWorkExperiences} type="work" />

            {workExperiences.length > 3 && (
              <ShowMoreButton
                onClick={handleShowMoreWork}
                isShowingAll={showAllWork}
                count={workExperiences.length - 3}
                label="Positions"
              />
            )}
          </TabsContent>

          <TabsContent value="education" className="relative">
            <Timeline items={displayedEducationExperiences} type="education" />

            {educationExperiences.length > 3 && (
              <ShowMoreButton
                onClick={handleShowMoreEducation}
                isShowingAll={showAllEducation}
                count={educationExperiences.length - 3}
                label="Qualifications"
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

function Timeline({ items, type }: { items: any[], type: 'work' | 'education' }) {
  return (
    <div className="relative">
      {/* Central Line for Desktop / Left Line for Mobile */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-border/40 transform md:-translate-x-1/2"></div>

      <div className="space-y-12 md:space-y-0">
        {items.map((item, index) => (
          <TimelineItem
            key={item.id}
            item={item}
            index={index}
            type={type}
          />
        ))}
      </div>
    </div>
  )
}

function TimelineItem({ item, index, type }: { item: any, index: number, type: 'work' | 'education' }) {
  const isEven = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative flex flex-col md:flex-row gap-8 md:gap-0 ${isEven ? 'md:flex-row-reverse' : ''
        }`}
    >
      {/* Spacer for the other side */}
      <div className="hidden md:block flex-1" />

      {/* Center Dot */}
      <div className="absolute left-8 md:left-1/2 top-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-background border-4 border-primary/20 flex items-center justify-center transform -translate-x-1/2 z-10 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">
        <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-primary animate-pulse"></div>
      </div>

      {/* Content Card */}
      <div className="flex-1 pl-20 md:pl-0">
        <div className={`
          relative p-6 md:p-8 rounded-2xl 
          bg-card/40 backdrop-blur-md border border-white/10 dark:border-white/5 
          shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] 
          transition-all duration-300 group
          ${isEven ? 'md:mr-12 md:text-right' : 'md:ml-12 md:text-left'}
        `}>
          {/* Gradient Glow on Hover */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className={`flex flex-col gap-4 relative z-10 ${isEven ? 'md:items-end' : 'md:items-start'}`}>
            <div className="space-y-2">
              <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-0">
                {item.duration}
              </Badge>
              <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <div className={`flex items-center gap-2 text-muted-foreground ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                <Building2 className="w-4 h-4" />
                <span className="font-medium">{item.company}</span>
              </div>
            </div>

            {/* Optional: Add description if available in data, or keep it clean */}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ShowMoreButton({ onClick, isShowingAll, count, label }: { onClick: () => void, isShowingAll: boolean, count: number, label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="flex justify-center mt-16 relative z-10"
    >
      <AnimatedButton
        onClick={onClick}
        variant="outline"
        icon={isShowingAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      >
        {isShowingAll ? 'Show Less' : `Show ${count} More ${label}`}
      </AnimatedButton>
    </motion.div>
  )
}


