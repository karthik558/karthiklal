import AboutSection from "@/components/sections/about-section"
import PortfolioSection from "@/components/sections/portfolio-section"
import ServicesSection from "@/components/sections/services-section"
import ExperienceSection from "@/components/sections/experience-section"
import CertificationsSection from "@/components/sections/certifications-section"
import SkillsSection from "@/components/sections/skills-section"
import TestimonialsSection from "@/components/sections/testimonials-section"
import HeroSectionStatic from "@/components/sections/hero-section-static"

export default function Home() {
  return (
    <div className="relative">
      <HeroSectionStatic />
      <AboutSection />
      <PortfolioSection />
      <ServicesSection />
      <ExperienceSection />
      <CertificationsSection />
      <SkillsSection />
      <TestimonialsSection />
    </div>
  )
}

