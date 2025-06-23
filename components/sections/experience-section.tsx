"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BriefcaseIcon, GraduationCap, ChevronDown, ChevronUp, Calendar, Building2 } from "lucide-react"
import experiencesData from "@/public/data/experiences.json"

export default function ExperienceSection() {
  const [showAllWork, setShowAllWork] = useState(false)
  const [showAllEducation, setShowAllEducation] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const workExperiences = experiencesData.experiences.filter((exp) => exp.type === "work")
  const educationExperiences = experiencesData.experiences.filter((exp) => exp.type === "education")
  
  const displayedWorkExperiences = showAllWork ? workExperiences : workExperiences.slice(0, 3)
  const displayedEducationExperiences = showAllEducation ? educationExperiences : educationExperiences.slice(0, 3)

  const handleShowMoreWork = () => {
    if (showAllWork) {
      // When collapsing, scroll back to the experience section
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
      // When collapsing, scroll back to the experience section
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

  return (
    <section id="experience" className="py-20 md:py-32 bg-secondary/5">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-primary font-medium mb-2 animate-item">Experience & Education</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-item">My Professional <span className="text-gradient">Journey</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-item">
            A comprehensive overview of my professional experience and educational milestones that shaped my expertise.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Work Experience */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <BriefcaseIcon className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Work Experience</h3>
                <p className="text-sm text-muted-foreground">{workExperiences.length} positions</p>
              </div>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-8 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent"></div>
              
              <div className="space-y-8">
                {displayedWorkExperiences.map((experience, index) => (
                  <motion.div
                    key={experience.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                    className="relative"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-4 top-6 w-4 h-4 rounded-full border-3 border-background bg-primary shadow-lg z-10"></div>
                    
                    <Card className="ml-14 group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="space-y-1">
                              <h4 className="font-bold text-lg group-hover:text-primary transition-colors">
                                {experience.title}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Building2 className="h-4 w-4" />
                                <span className="font-medium">{experience.company}</span>
                              </div>
                            </div>
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 whitespace-nowrap">
                              <Calendar className="h-3 w-3 mr-1" />
                              {experience.duration}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {experience.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Show More/Less Button for Work Experience */}
            {workExperiences.length > 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex justify-center"
              >
                <Button
                  onClick={handleShowMoreWork}
                  variant="outline"
                  className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {showAllWork ? (
                    <>
                      <ChevronUp className="mr-2 h-4 w-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-2 h-4 w-4" />
                      Show {workExperiences.length - 3} More Positions
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </div>

          {/* Education */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <GraduationCap className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Education</h3>
                <p className="text-sm text-muted-foreground">{educationExperiences.length} qualifications</p>
              </div>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-8 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent"></div>
              
              <div className="space-y-8">
                {displayedEducationExperiences.map((education, index) => (
                  <motion.div
                    key={education.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="relative"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-4 top-6 w-4 h-4 rounded-full border-3 border-background bg-primary shadow-lg z-10"></div>
                    
                    <Card className="ml-14 group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="space-y-1">
                              <h4 className="font-bold text-lg group-hover:text-primary transition-colors">
                                {education.title}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Building2 className="h-4 w-4" />
                                <span className="font-medium">{education.company}</span>
                              </div>
                            </div>
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 whitespace-nowrap">
                              <Calendar className="h-3 w-3 mr-1" />
                              {education.duration}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {education.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Show More/Less Button for Education */}
            {educationExperiences.length > 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex justify-center"
              >
                <Button
                  onClick={handleShowMoreEducation}
                  variant="outline"
                  className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {showAllEducation ? (
                    <>
                      <ChevronUp className="mr-2 h-4 w-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-2 h-4 w-4" />
                      Show {educationExperiences.length - 3} More Qualifications
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

