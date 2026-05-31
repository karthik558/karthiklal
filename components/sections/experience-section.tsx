"use client"

import { useRef, useState } from "react"
import { motion, useInView, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { BriefcaseIcon, GraduationCap, ChevronDown, ChevronUp, Building2, Calendar } from "lucide-react"
import experiencesData from "@/public/data/experiences.json"
import { AnimatedButton } from "@/components/ui/animated-button"
import { cn } from "@/lib/utils"

export default function ExperienceSection() {
  const [showAllWork, setShowAllWork] = useState(false)
  const [showAllEducation, setShowAllEducation] = useState(false)
  const [activeTab, setActiveTab] = useState<'work' | 'education'>('work')
  
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.05 })

  // Scroll progress for the animated glowing line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  })

  // Smooth spring animation for the line
  const springScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  const lineHeight = useTransform(springScroll, [0, 1], ["0%", "100%"])

  const workExperiences = experiencesData.experiences.filter((exp) => exp.type === "work")
  const educationExperiences = experiencesData.experiences.filter((exp) => exp.type === "education")

  const displayedWorkExperiences = showAllWork ? workExperiences : workExperiences.slice(0, 3)
  const displayedEducationExperiences = showAllEducation ? educationExperiences : educationExperiences.slice(0, 3)

  return (
    <section id="experience" className="py-24 md:py-32 bg-background relative overflow-hidden" ref={containerRef}>
      <div className="absolute inset-0 bg-[radial-gradient(1000px_circle_at_20%_20%,hsl(var(--primary)/0.08),transparent_65%)]" />
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

      <div className="container max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-24"
        >
          <Badge variant="outline" className="mb-6 px-4 py-1.5 rounded-full bg-primary/5 border-primary/20 text-primary text-xs font-semibold tracking-[0.2em] uppercase">
            Career Path
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6">
            Experience & <span className="text-gradient">Education</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            My professional journey and academic milestones that have shaped my skills and expertise in the tech industry.
          </p>
        </motion.div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex justify-center mb-12">
          <div className="relative flex w-full max-w-md p-1 bg-card/50 backdrop-blur-md border border-foreground/10 rounded-full">
            <div 
              className={cn(
                "absolute inset-y-1 w-[calc(50%-4px)] bg-primary rounded-full transition-all duration-300 shadow-lg",
                activeTab === 'education' ? "left-[calc(50%+2px)]" : "left-1"
              )} 
            />
            <button
              onClick={() => setActiveTab('work')}
              className={cn(
                "relative z-10 flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors duration-300 rounded-full",
                activeTab === 'work' ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <BriefcaseIcon className="w-4 h-4" /> Experience
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={cn(
                "relative z-10 flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors duration-300 rounded-full",
                activeTab === 'education' ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <GraduationCap className="w-4 h-4" /> Education
            </button>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative w-full">
          {/* Animated Central Glowing Line */}
          <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-[2px] bg-border/40 transform md:-translate-x-1/2 rounded-full overflow-hidden z-0">
            <motion.div 
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary via-primary to-transparent shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)]"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 w-full relative z-10">
            
            {/* Experience Column (Left on Desktop, Conditional on Mobile) */}
            <div className={cn("flex flex-col gap-8 md:gap-12", activeTab === 'education' && "hidden md:flex")}>
              <div className="hidden md:flex items-center justify-end gap-3 mb-4 pr-12 lg:pr-16 text-primary font-bold text-2xl opacity-80">
                Experience <BriefcaseIcon className="w-6 h-6" />
              </div>
              <AnimatePresence mode="popLayout">
                {displayedWorkExperiences.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -50, scale: 0.9 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1, type: "spring", bounce: 0.3 }}
                  >
                    <TimelineCard item={item} type="work" align="right" />
                  </motion.div>
                ))}
              </AnimatePresence>

              {workExperiences.length > 3 && (
                <motion.div layout className="flex justify-start pl-16 md:pl-0 md:justify-end mt-4 md:pr-12 lg:pr-16">
                  <AnimatedButton
                    onClick={() => setShowAllWork(!showAllWork)}
                    variant="outline"
                  >
                    {showAllWork ? 'Show Less' : `Show ${workExperiences.length - 3} More`}
                    {showAllWork ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                  </AnimatedButton>
                </motion.div>
              )}
            </div>

            {/* Education Column (Right on Desktop, Conditional on Mobile) */}
            <div className={cn("flex flex-col gap-8 md:gap-12 mt-12 md:mt-0", activeTab === 'work' && "hidden md:flex")}>
              <div className="hidden md:flex items-center justify-start gap-3 mb-4 pl-12 lg:pl-16 text-primary font-bold text-2xl opacity-80">
                <GraduationCap className="w-6 h-6" /> Education
              </div>
              <div className="md:pt-16 lg:pt-24 flex flex-col gap-8 md:gap-12">
                <AnimatePresence mode="popLayout">
                  {displayedEducationExperiences.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 50, scale: 0.9 }}
                      whileInView={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: index * 0.1, type: "spring", bounce: 0.3 }}
                    >
                      <TimelineCard item={item} type="education" align="left" />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {educationExperiences.length > 3 && (
                  <motion.div layout className="flex justify-start pl-16 md:pl-12 lg:pl-16 mt-4">
                    <AnimatedButton
                      onClick={() => setShowAllEducation(!showAllEducation)}
                      variant="outline"
                    >
                      {showAllEducation ? 'Show Less' : `Show ${educationExperiences.length - 3} More`}
                      {showAllEducation ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                    </AnimatedButton>
                  </motion.div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

function TimelineCard({ item, type, align }: { item: any, type: 'work' | 'education', align: 'left' | 'right' }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  // Mobile always aligns left for content, but we keep the visual desktop alignment logic
  const isRightAligned = align === 'right'

  return (
    <div className={cn(
      "relative flex items-center group pl-16 md:pl-0 w-full",
      isRightAligned ? "md:justify-end md:pr-12 lg:pr-16" : "md:justify-start md:pl-12 lg:pl-16"
    )}>
      {/* Node Point */}
      <div className={cn(
        "absolute top-8 w-5 h-5 rounded-full bg-background border-4 border-primary z-20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] transition-transform duration-300 group-hover:scale-150 transform -translate-y-1/2",
        "left-[15px] md:left-auto",
        isRightAligned ? "md:-right-[10px]" : "md:-left-[10px]"
      )}>
        <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
      </div>

      {/* Connection Line */}
      <div className={cn(
        "hidden md:block absolute top-8 h-[2px] bg-border/40 transition-colors duration-300 group-hover:bg-primary/50 transform -translate-y-1/2 z-10",
        isRightAligned ? "right-0 w-12 lg:w-16" : "left-0 w-12 lg:w-16"
      )} />

      <motion.div
        onMouseMove={handleMouseMove}
        whileHover={{ y: -5 }}
        className="relative w-full max-w-[500px]"
      >
        {/* Glow behind the card */}
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-primary/50 via-transparent to-accent/50 opacity-0 transition duration-500 group-hover:opacity-100 blur-sm pointer-events-none" />
        
        <div className={cn(
          "relative p-6 md:p-8 rounded-3xl bg-card/60 backdrop-blur-xl border border-white/10 overflow-hidden h-full",
          "shadow-[0_8px_30px_rgba(0,0,0,0.04)] group-hover:shadow-[0_20px_40px_rgba(var(--primary-rgb),0.15)] transition-all duration-500"
        )}>
          {/* Glassmorphic Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className={cn(
            "flex flex-col gap-4 relative z-10",
            isRightAligned ? "md:items-end md:text-right" : "md:items-start md:text-left"
          )}>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 backdrop-blur-md shadow-sm">
              {item.duration}
            </Badge>
            
            <h3 className="text-xl md:text-2xl font-display font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              {item.title}
            </h3>
            
            <div className={cn(
              "flex items-center gap-2 text-muted-foreground/80 font-medium text-sm md:text-base",
              isRightAligned ? "md:justify-end" : "md:justify-start"
            )}>
              {type === 'work' ? <Building2 className="w-4 h-4 shrink-0 text-primary/70" /> : <GraduationCap className="w-4 h-4 shrink-0 text-primary/70" />}
              <span>{item.company}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
