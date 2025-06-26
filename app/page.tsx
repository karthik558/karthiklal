import AboutSection from "@/components/sections/about-section"
import PortfolioSection from "@/components/sections/portfolio-section"
import ServicesSection from "@/components/sections/services-section"
import ExperienceSection from "@/components/sections/experience-section"
import CertificationsSection from "@/components/sections/certifications-section"
import SkillsSection from "@/components/sections/skills-section"
import TestimonialsSection from "@/components/sections/testimonials-section"
import HeroSectionStatic from "@/components/sections/hero-section-static"
import MarqueeSection from "@/components/sections/marquee-section"

// Structured Data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Karthik Lal",
  "alternateName": "Karthik Lal IT Manager",
  "description": "IT Manager, Certified Ethical Hacker, and Full Stack Developer with 6.8+ years of experience in cybersecurity and network management",
  "url": "https://karthiklal.in",
  "image": "https://karthiklal.in/1.jpg",
  "sameAs": [
    "https://linkedin.com/in/karthiklal",
    "https://github.com/karthik558",
    "https://twitter.com/karthiklal_in"
  ],
  "jobTitle": [
    "IT Manager",
    "Certified Ethical Hacker",
    "Full Stack Developer",
    "Cybersecurity Expert"
  ],
  "worksFor": {
    "@type": "Organization",
    "name": "IHCL (Indian Hotels Company Limited)"
  },
  "alumniOf": [
    {
      "@type": "CollegeOrUniversity",
      "name": "Uttaranchal University",
      "address": "Dehradun, Uttarakhand"
    }
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Kerala",
    "addressCountry": "IN"
  },
  "email": "dev@karthiklal.in",
  "knowsAbout": [
    "Cybersecurity",
    "Network Security",
    "Penetration Testing",
    "React Development",
    "Next.js",
    "TypeScript",
    "Rust Programming",
    "Python Development",
    "Linux System Administration",
    "Hotel IT Solutions",
    "Infrastructure Management"
  ],
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "name": "Certified Ethical Hacker (CEH)",
      "credentialCategory": "Professional Certification"
    },
    {
      "@type": "EducationalOccupationalCredential",
      "name": "Bachelor of Computer Applications (BCA)",
      "credentialCategory": "Degree"
    }
  ]
}

export default function Home() {
  return (
    <div className="relative">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <HeroSectionStatic />
      <MarqueeSection />
      <AboutSection />
      <SkillsSection />
      <ServicesSection />
      <ExperienceSection />
      <CertificationsSection />
      <PortfolioSection />
      <TestimonialsSection />
    </div>
  )
}

