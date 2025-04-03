"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BriefcaseIcon, GraduationCap } from "lucide-react"

const experiences = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    duration: "2022 - Present",
    description:
      "Lead the frontend development team in creating responsive and interactive web applications. Implemented modern frameworks and optimized performance.",
    type: "work",
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "DesignStudio",
    duration: "2020 - 2022",
    description:
      "Designed user interfaces and experiences for various clients. Conducted user research and created wireframes and prototypes for web and mobile applications.",
    type: "work",
  },
  {
    id: 3,
    title: "Master's Degree in Computer Science",
    company: "Tech University",
    duration: "2018 - 2020",
    description:
      "Specialized in Human-Computer Interaction and Web Technologies. Completed thesis on improving user experiences in web applications.",
    type: "education",
  },
  {
    id: 4,
    title: "Frontend Developer",
    company: "WebSolutions",
    duration: "2017 - 2020",
    description:
      "Developed responsive websites and web applications using React and related technologies. Collaborated with designers to implement UI/UX designs.",
    type: "work",
  },
  {
    id: 5,
    title: "Bachelor's Degree in Computer Science",
    company: "State University",
    duration: "2013 - 2017",
    description:
      "Studied Computer Science with a focus on software development and web technologies. Participated in various coding competitions and hackathons.",
    type: "education",
  },
  {
    id: 6,
    title: "Web Development Intern",
    company: "StartUp Labs",
    duration: "2016 - 2017",
    description:
      "Assisted in the development of web applications and websites. Learned modern web development practices and worked in an agile environment.",
    type: "work",
  },
]

export default function ExperienceSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.1 })

  const workExperiences = experiences.filter((exp) => exp.type === "work")
  const educationExperiences = experiences.filter((exp) => exp.type === "education")

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
              {workExperiences.map((experience, index) => (
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
              {educationExperiences.map((education, index) => (
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
          </motion.div>
        </div>
      </div>
    </section>
  )
}

