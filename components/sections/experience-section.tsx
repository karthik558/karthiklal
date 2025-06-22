"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BriefcaseIcon, GraduationCap, ChevronDown, ChevronUp } from "lucide-react"
import experiencesData from "@/public/data/experiences.json"

export default function ExperienceSection() {
  const [showAllWork, setShowAllWork] = useState(false)
  const [showAllEducation, setShowAllEducation] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const workExperiences = experiencesData.experiences.filter((exp) => exp.type === "work")
  const educationExperiences = experiencesData.experiences.filter((exp) => exp.type === "education")
  
  const displayedWorkExperiences = showAllWork ? workExperiences : workExperiences.slice(0, 3)
  const displayedEducationExperiences = showAllEducation ? educationExperiences : educationExperiences.slice(0, 3)

  return (
    <section id="experience" className="py-20 md:py-32 bg-secondary/5">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-primary font-medium mb-2">Experience & Education</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Professional Journey</h2>
          <p className="text-muted-foreground">A timeline of my professional experience and educational background.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Work Experience */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <BriefcaseIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Work Experience</h3>
            </div>

            <div className="space-y-6 relative before:absolute before:left-[11px] before:top-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/50 before:to-primary/0">
              {displayedWorkExperiences.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="relative pl-8"
                >
                  <div className="absolute left-0 top-3 h-5 w-5 rounded-full border-4 border-primary/30 bg-primary"></div>
                  <Card className="border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <CardTitle className="text-lg font-bold">{experience.title}</CardTitle>
                        <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full whitespace-nowrap">
                          {experience.duration}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-primary/80">{experience.company}</div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">{experience.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Show More/Less Button for Work Experience */}
            {workExperiences.length > 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex justify-center mt-8"
              >
                <Button
                  onClick={() => setShowAllWork(!showAllWork)}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  {showAllWork ? (
                    <>
                      Show Less
                      <ChevronUp className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Show More ({workExperiences.length - 3} more)
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Education</h3>
            </div>

            <div className="space-y-6 relative before:absolute before:left-[11px] before:top-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/50 before:to-primary/0">
              {displayedEducationExperiences.map((education, index) => (
                <motion.div
                  key={education.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="relative pl-8"
                >
                  <div className="absolute left-0 top-3 h-5 w-5 rounded-full border-4 border-primary/30 bg-primary"></div>
                  <Card className="border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <CardTitle className="text-lg font-bold">{education.title}</CardTitle>
                        <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full whitespace-nowrap">
                          {education.duration}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-primary/80">{education.company}</div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">{education.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Show More/Less Button for Education */}
            {educationExperiences.length > 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex justify-center mt-8"
              >
                <Button
                  onClick={() => setShowAllEducation(!showAllEducation)}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  {showAllEducation ? (
                    <>
                      Show Less
                      <ChevronUp className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Show More ({educationExperiences.length - 3} more)
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

