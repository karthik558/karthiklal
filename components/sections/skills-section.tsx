"use client"

import { motion } from "framer-motion"
import { Code2, Cpu, Palette, Shield, Terminal, Wrench } from "lucide-react"
import skillsData from "@/public/data/skills.json"

const iconMap = { Code2, Terminal, Shield, Cpu, Palette, Wrench }

interface SkillCategory {
  name: string
  icon: keyof typeof iconMap
  skills: string[]
}

const categories = skillsData.skillCategories as SkillCategory[]

export default function SkillsSection() {
  return (
    <section id="skills" className="relative bg-background py-20 md:py-36 border-t border-border">
      <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        
        {/* Section Header */}
        <div className="mb-14 border-b border-border pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
              04 // TECH MATRIX & TOOLING
            </div>
            <h2 className="font-display text-4xl font-black uppercase tracking-tight text-foreground sm:text-6xl md:text-7xl">
              SKILLS & EXPERTISE
            </h2>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = iconMap[category.icon] || Code2
            const numStr = String(index + 1).padStart(2, "0")

            return (
              <motion.article
                key={category.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative flex flex-col justify-between border-2 border-border bg-card p-6 md:p-8 transition-all duration-300 hover:border-foreground hover:shadow-xl overflow-hidden"
              >
                {/* Background Giant Stroke Number Watermark */}
                <div className="absolute right-2 -bottom-2 pointer-events-none select-none overflow-hidden opacity-[0.06] dark:opacity-[0.1] z-0 transition-opacity duration-300 group-hover:opacity-20">
                  <span
                    className="font-display text-7xl sm:text-8xl font-black uppercase tracking-tighter text-transparent leading-none block"
                    style={{
                      WebkitTextStroke: "2.5px hsl(var(--foreground))",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {numStr}
                  </span>
                </div>

                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 border border-foreground bg-foreground text-background">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="font-mono text-sm font-bold uppercase tracking-tight text-foreground">
                          {category.name}
                        </h3>
                      </div>
                      <span className="font-mono text-xs font-bold text-muted-foreground">
                        [{numStr}]
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill) => (
                        <span
                          key={skill}
                          className="font-mono text-xs border border-border bg-background px-3 py-1 text-foreground transition-colors duration-200 group-hover:border-foreground/50"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-border/60 flex items-center justify-between font-mono text-[10px] uppercase text-muted-foreground">
                    <span>SYSTEM MATRIX</span>
                    <span>{category.skills.length} MODULES</span>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
