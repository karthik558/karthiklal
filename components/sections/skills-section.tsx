"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { 
  Code2, 
  Palette, 
  BrainCircuit, 
  FileCode2, 
  Cpu, 
  Cog, 
  Box,
  Figma as FigmaIcon,
  ImageIcon,
  Binary,
  Terminal,
  Blocks,
  LayoutGrid,
  FileJson
} from "lucide-react"

// Mapping of skills to their icons and categories
const skillsData = {
  "Programming Languages": {
    icon: Code2,
    skills: [
      { name: "JavaScript", icon: Binary },
      { name: "Python", icon: Terminal },
      { name: "C", icon: FileCode2 },
      { name: "C++", icon: Cpu },
      { name: "Rust", icon: Cog }
    ]
  },
  "Web Technologies": {
    icon: BrainCircuit,
    skills: [
      { name: "ReactJS", icon: Blocks },
      { name: "NextJS", icon: LayoutGrid },
      { name: "CSS", icon: Box }
    ]
  },
  "Design Tools": {
    icon: Palette,
    skills: [
      { name: "Figma", icon: FigmaIcon },
      { name: "Photoshop", icon: ImageIcon }
    ]
  }
}

const SkillCard = ({ skill }: { skill: { name: string; icon: any } }) => {
  const Icon = skill.icon
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-4 text-center border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
        <div className="flex flex-col items-center gap-2">
          <Icon className="h-6 w-6 text-primary" />
          <span className="font-medium">{skill.name}</span>
        </div>
      </Card>
    </motion.div>
  )
}

export default function SkillsSection() {
  return (
    <section id="skills" className="py-20 md:py-32">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-primary font-medium mb-2">Skills</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical Expertise</h2>
          <p className="text-muted-foreground">
            My professional skill set and technical proficiencies across various domains.
          </p>
        </div>

        <div className="space-y-12">
          {Object.entries(skillsData).map(([category, { icon: Icon, skills }]) => (
            <div key={category} className="space-y-6">
              <div className="flex items-center gap-3">
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold">{category}</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {skills.map((skill) => (
                  <SkillCard key={skill.name} skill={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

