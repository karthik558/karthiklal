"use client"

import { useState } from "react"
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from "framer-motion"
import { Award, CheckCircle, Calendar, ChevronDown, ChevronUp, ShieldCheck, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnimatedButton } from "@/components/ui/animated-button"
import { CERTIFICATIONS_DATA } from "@/lib/static-data"

interface Certification {
  id: number
  title: string
  issuer: string
  date: string
  expiryDate: string
  credentialId: string
  status: string
  description?: string
  link?: string
}

function AchievementCard({ certification, index, isLarge }: { certification: Certification, index: number, isLarge: boolean }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <div
      className="group relative h-full w-full"
      onMouseMove={handleMouseMove}
    >
      {/* Holographic Border Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              800px circle at ${mouseX}px ${mouseY}px,
              rgba(var(--primary-rgb), 0.4),
              transparent 40%
            )
          `,
        }}
      />
      
      {/* Deep Glassmorphic Card */}
      <div className="relative h-full w-full rounded-3xl border border-white/10 bg-card/40 backdrop-blur-2xl transition-all duration-500 overflow-hidden flex flex-col z-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] group-hover:shadow-[0_20px_40px_rgba(var(--primary-rgb),0.15)]">
        
        {/* Subtle Metallic Sheen on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Holographic Watermark / Background Icon */}
        <div className="absolute -right-10 -bottom-10 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 pointer-events-none transform group-hover:scale-110 group-hover:rotate-12">
          <Award className="w-64 h-64 text-primary" />
        </div>

        <div className="p-6 md:p-8 flex-1 flex flex-col relative z-20">
          <div className="flex justify-between items-start mb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                <Award className="h-7 w-7 text-primary" />
              </div>
              {isLarge && (
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold tracking-wider text-primary/80 uppercase">Verified Credential</p>
                  <p className="text-xs text-muted-foreground">{certification.issuer}</p>
                </div>
              )}
            </div>
            
            {/* Holographic Status Badge */}
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full border backdrop-blur-md text-xs font-medium shadow-sm",
              certification.status === 'active' 
                ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400" 
                : "bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400"
            )}>
              {certification.status === 'active' ? (
                <ShieldCheck className="w-3.5 h-3.5" />
              ) : (
                <Clock className="w-3.5 h-3.5" />
              )}
              {certification.status === 'active' ? "Active" : "Expiring"}
            </div>
          </div>
          
          <h3 className={cn(
            "font-display font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight mb-2",
            isLarge ? "text-2xl md:text-3xl line-clamp-2" : "text-xl md:text-2xl line-clamp-2"
          )}>
            {certification.title}
          </h3>
          
          {!isLarge && (
            <p className="text-sm font-medium text-primary/80 mb-4">
              {certification.issuer}
            </p>
          )}
          
          <p className={cn(
            "text-muted-foreground/80 leading-relaxed",
            isLarge ? "text-base line-clamp-3 mb-8" : "text-sm line-clamp-2 mb-6"
          )}>
            {certification.description}
          </p>
          
          <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border/40">
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium shrink-0">
              <Calendar className="w-4 h-4 text-primary/60" />
              <span>{certification.date}</span>
            </div>
            
            {/* ID Badge with Monospace */}
            <div className="relative group/id max-w-full">
              <span className="block text-xs font-mono bg-black/5 dark:bg-white/5 border border-foreground/10 px-2.5 py-1 rounded-md text-muted-foreground group-hover/id:text-foreground transition-colors break-all">
                ID: {certification.credentialId || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CertificationsSection() {
  const certifications: Certification[] = CERTIFICATIONS_DATA.certifications
  const [showAll, setShowAll] = useState(false)

  return (
    <section id="certifications" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_85%_30%,hsl(var(--accent)/0.08),transparent_65%),radial-gradient(1000px_circle_at_15%_70%,hsl(var(--primary)/0.08),transparent_65%)]" />
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      
      <div className="container max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-24"
        >
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
            <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Credentials</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6">
            Professional <span className="text-gradient">Achievements</span>
          </h2>
        </motion.div>

        {/* Bento Grid Layout */}
        <motion.div 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <AnimatePresence mode="popLayout">
            {(showAll ? certifications : certifications.slice(0, 4)).map((cert, index) => {
              // Bento Grid logic: index 0 and 3 are large (span 2 cols on lg)
              const isLarge = index === 0 || index === 3;
              const spanClass = isLarge ? "lg:col-span-2" : "col-span-1";

              return (
                <motion.div 
                  key={cert.id}
                  layout
                  variants={{
                    hidden: { opacity: 0, y: 30, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1 }
                  }}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.5, delay: (index % 4) * 0.1, type: "spring", bounce: 0.3 }}
                  className={cn("w-full h-full", spanClass)}
                >
                  <AchievementCard certification={cert} index={index} isLarge={isLarge} />
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>

        {certifications.length > 4 && (
          <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 flex justify-center"
          >
            <AnimatedButton onClick={() => setShowAll(!showAll)} variant="outline">
              {showAll ? "Show Less Credentials" : `Show All ${certifications.length} Credentials`}
              {showAll ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </AnimatedButton>
          </motion.div>
        )}
      </div>
    </section>
  )
}
