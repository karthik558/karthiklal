import { Card } from "@/components/ui/card"
import Image from "next/image"

// Skill categories with individual skills
const skillsData = {
  Frontend: [
    { name: "React", level: 0.9 },
    { name: "Next.js", level: 0.85 },
    { name: "JavaScript", level: 0.95 },
    { name: "TypeScript", level: 0.85 },
    { name: "HTML/CSS", level: 0.9 },
    { name: "Tailwind CSS", level: 0.85 },
  ],
  Backend: [
    { name: "Node.js", level: 0.8 },
    { name: "Express", level: 0.75 },
    { name: "MongoDB", level: 0.7 },
    { name: "SQL", level: 0.65 },
    { name: "GraphQL", level: 0.7 },
    { name: "REST API", level: 0.85 },
  ],
  "Tools & Others": [
    { name: "Git", level: 0.9 },
    { name: "Docker", level: 0.6 },
    { name: "Jest", level: 0.7 },
    { name: "Figma", level: 0.8 },
    { name: "Webpack", level: 0.65 },
    { name: "CI/CD", level: 0.6 },
  ],
  "3D & Animation": [
    { name: "Three.js", level: 0.75 },
    { name: "GSAP", level: 0.8 },
    { name: "WebGL", level: 0.6 },
    { name: "Framer Motion", level: 0.85 },
    { name: "Blender", level: 0.5 },
    { name: "Canvas API", level: 0.7 },
  ],
}

function SkillBar({ skill, level }: { skill: string; level: number }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">{skill}</span>
        <span className="text-sm text-muted-foreground">{Math.round(level * 100)}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${level * 100}%` }} />
      </div>
    </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Static image instead of 3D */}
          <div className="h-[500px] w-full">
            <Card className="h-full w-full flex items-center justify-center overflow-hidden">
              <Image
                src="/placeholder.svg?height=500&width=500"
                alt="Skills Visualization"
                width={500}
                height={500}
                className="object-cover"
              />
            </Card>
          </div>

          {/* Skills Bars */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(skillsData).map(([category, skills]) => (
                <div key={category}>
                  <h3 className="text-xl font-bold mb-4">{category}</h3>
                  <div>
                    {skills.map((skill) => (
                      <SkillBar key={skill.name} skill={skill.name} level={skill.level} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

