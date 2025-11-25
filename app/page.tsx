import AboutSection from "@/components/sections/about-section"
import PortfolioGallerySection from "@/components/sections/portfolio-gallery-section"
import PortfolioSection from "@/components/sections/portfolio-section"
import ServicesSection from "@/components/sections/services-section"
import ExperienceSection from "@/components/sections/experience-section"
import CertificationsSection from "@/components/sections/certifications-section"
import SkillsSection from "@/components/sections/skills-section"
import TestimonialsSection from "@/components/sections/testimonials-section"
import CtaSection from "@/components/sections/cta-section"
import HeroSectionStatic from "@/components/sections/hero-section-static"
import MarqueeSection from "@/components/sections/marquee-section"

// Enhanced Structured Data for SEO - targeting "Karthik Lal" searches
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Karthik Lal",
  "alternateName": [
    "Karthik Lal IT Manager",
    "Karthik Lal Certified Ethical Hacker",
    "Karthik Lal Developer"
  ],
  "description": "Karthik Lal is an experienced IT Manager, Certified Ethical Hacker, and Full Stack Developer with 6.8+ years of expertise in cybersecurity, network management, and web development. Based in Kerala, India.",
  "url": "https://karthiklal.in",
  "image": [
    "https://karthiklal.in/1.jpg",
    "https://karthiklal.in/user/2.jpg",
    "https://karthiklal.in/user/3.jpg"
  ],
  "sameAs": [
    "https://linkedin.com/in/karthiklal",
    "https://github.com/karthik558",
    "https://twitter.com/_karthiklal.in",
    "https://instagram.com/karthiklal_in"
  ],
  "jobTitle": [
    "IT Manager",
    "Certified Ethical Hacker", 
    "Full Stack Developer",
    "Cybersecurity Expert",
    "Network Security Specialist"
  ],
  "worksFor": {
    "@type": "Organization",
    "name": "IHCL (Indian Hotels Company Limited)",
    "url": "https://www.ihcltata.com/"
  },
  "alumniOf": [
    {
      "@type": "CollegeOrUniversity", 
      "name": "Uttaranchal University",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Dehradun",
        "addressRegion": "Uttarakhand",
        "addressCountry": "IN"
      }
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
    "Ethical Hacking",
    "React Development",
    "Next.js Development",
    "TypeScript Programming",
    "Rust Programming",
    "Python Development",
    "Linux System Administration",
    "Hotel IT Solutions",
    "Infrastructure Management",
    "Threat Intelligence",
    "DDOS Mitigation",
    "Phishing Defense",
    "Information Security"
  ],
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "name": "Certified Ethical Hacker (CEH)",
      "credentialCategory": "Professional Certification",
      "recognizedBy": {
        "@type": "Organization",
        "name": "EC-Council"
      }
    },
    {
      "@type": "EducationalOccupationalCredential", 
      "name": "Bachelor of Computer Applications (BCA)",
      "credentialCategory": "Degree"
    }
  ],
  "hasOccupation": {
    "@type": "Occupation",
    "name": "IT Manager",
    "occupationLocation": {
      "@type": "Country",
      "name": "India"
    },
    "skills": [
      "Cybersecurity",
      "Network Management", 
      "Web Development",
      "System Administration",
      "Threat Analysis"
    ]
  },
  "brand": {
    "@type": "Brand",
    "name": "Karthik Lal",
    "description": "Professional IT Manager and Cybersecurity Expert"
  }
}

export default function Home() {
  // Additional Website/Organization structured data
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Karthik Lal - Official Portfolio",
    "alternateName": "Karthik Lal Website",
    "url": "https://karthiklal.in",
    "description": "Official portfolio website of Karthik Lal - IT Manager, Certified Ethical Hacker, and Full Stack Developer",
    "author": {
      "@type": "Person",
      "name": "Karthik Lal"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://karthiklal.in/?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <div className="relative">
      {/* Enhanced Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
      />
      
      <HeroSectionStatic />
      <MarqueeSection />
      <AboutSection />
      <PortfolioGallerySection />
      <SkillsSection />
      <ServicesSection />
      <ExperienceSection />
      <CertificationsSection />
      <PortfolioSection />
      <TestimonialsSection />
      <CtaSection />
    </div>
  )
}

