"use client"

import { useRef, useState } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { Card, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BriefcaseIcon, GraduationCap, ChevronDown, ChevronUp, Calendar, Building2 } from "lucide-react"
import experiencesData from "@/public/data/experiences.json"

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

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" as any }
    }
  }

  return (
    <section id="experience" className="py-20 md:py-32 bg-secondary/5 overflow-hidden">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-primary font-medium mb-2">Experience & Education</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Professional <span className="text-gradient">Journey</span></h2>
          <p className="text-muted-foreground">
            A comprehensive overview of my professional experience and educational milestones that shaped my expertise.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Tabs defaultValue="experience" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-12 h-16 p-2 bg-secondary/30 backdrop-blur-md border border-border/30 rounded-full shadow-sm">
              <TabsTrigger
                value="experience"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md h-12 text-base font-medium transition-all duration-300 rounded-full flex items-center justify-center gap-2 group"
              >
                <BriefcaseIcon className="h-4 w-4" />
                Work Experience
                <Badge className="ml-1 h-5 px-2 text-xs bg-background/20 text-current border border-current/30 group-data-[state=active]:bg-white group-data-[state=active]:text-primary group-data-[state=active]:border-white/50">
                  {workExperiences.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="education"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md h-12 text-base font-medium transition-all duration-300 rounded-full flex items-center justify-center gap-2 group"
              >
                <GraduationCap className="h-4 w-4" />
                Education
                <Badge className="ml-1 h-5 px-2 text-xs bg-background/20 text-current border border-current/30 group-data-[state=active]:bg-white group-data-[state=active]:text-primary group-data-[state=active]:border-white/50">
                  {educationExperiences.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* Work Experience Tab */}
            <TabsContent value="experience" className="space-y-8">
              <div className="relative pl-2">
                {/* Enhanced timeline line with drawing animation */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/10 rounded-full"></div>
                <motion.div
                  style={{ height: lineHeight }}
                  className="absolute left-8 top-0 w-0.5 bg-gradient-to-b from-primary via-primary/70 to-primary/30 rounded-full origin-top"
                />

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className="space-y-8"
                >
                  {displayedWorkExperiences.map((experience, index) => (
                    <motion.div
                      key={experience.id}
                      variants={itemVariants}
                      className="relative"
                    >
                      {/* Enhanced timeline dot */}
                      <div className="absolute left-6 top-8 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg z-10 transform -translate-x-1/2">
                        <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20"></div>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.02, x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Card className="ml-16 group hover:shadow-xl transition-all duration-300 border border-border/50 bg-card/80 backdrop-blur-sm hover:bg-card/90 hover:border-primary/30 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <CardHeader className="pb-4 relative z-10">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div className="space-y-3 flex-1">
                                <div className="space-y-2">
                                  <h4 className="text-xl font-bold group-hover:text-primary transition-colors leading-tight">
                                    {experience.title}
                                  </h4>
                                  <div className="flex items-center gap-3 text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                      <Building2 className="h-4 w-4 text-primary" />
                                      <span className="font-medium">{experience.company}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {experience.duration}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Show More/Less Button for Work Experience */}
              {workExperiences.length > 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex justify-center pt-8"
                >
                  <Button
                    onClick={handleShowMoreWork}
                    variant="outline"
                    size="lg"
                    className="rounded-full hover:bg-primary hover:text-primary-foreground border-primary/30 hover:border-primary transition-all duration-300 group"
                  >
                    {showAllWork ? (
                      <>
                        <ChevronUp className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                        Show {workExperiences.length - 3} More Positions
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education" className="space-y-8">
              <div className="relative pl-2">
                {/* Enhanced timeline line with drawing animation */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/10 rounded-full"></div>
                <motion.div
                  style={{ height: lineHeight }}
                  className="absolute left-8 top-0 w-0.5 bg-gradient-to-b from-primary via-primary/70 to-primary/30 rounded-full origin-top"
                />

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className="space-y-8"
                >
                  {displayedEducationExperiences.map((education, index) => (
                    <motion.div
                      key={education.id}
                      variants={itemVariants}
                      className="relative"
                    >
                      {/* Enhanced timeline dot */}
                      <div className="absolute left-6 top-8 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg z-10 transform -translate-x-1/2">
                        <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20"></div>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.02, x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Card className="ml-16 group hover:shadow-xl transition-all duration-300 border border-border/50 bg-card/80 backdrop-blur-sm hover:bg-card/90 hover:border-primary/30 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <CardHeader className="pb-4 relative z-10">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div className="space-y-3 flex-1">
                                <div className="space-y-2">
                                  <h4 className="text-xl font-bold group-hover:text-primary transition-colors leading-tight">
                                    {education.title}
                                  </h4>
                                  <div className="flex items-center gap-3 text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                      <Building2 className="h-4 w-4 text-primary" />
                                      <span className="font-medium">{education.company}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {education.duration}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Show More/Less Button for Education */}
              {educationExperiences.length > 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex justify-center pt-8"
                >
                  <Button
                    onClick={handleShowMoreEducation}
                    variant="outline"
                    size="lg"
                    className="rounded-full hover:bg-primary hover:text-primary-foreground border-primary/30 hover:border-primary transition-all duration-300 group"
                  >
                    {showAllEducation ? (
                      <>
                        <ChevronUp className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                        Show {educationExperiences.length - 3} More Qualifications
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  )
}

