"use client"

import SectionHeading from "@/components/sections/section-heading"
import ParallaxImage from "@/components/ui/parallax-image"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, Linkedin, MapPin } from "lucide-react"

const profileFacts = [
  { value: "26", label: "AGE" },
  { value: "IT MANAGER", label: "CURRENT ROLE", detail: "IHCL · MANGALORE" },
  { value: "KERALA", label: "BASED IN", detail: "INDIA" },
  { value: "MCA", label: "CURRENT STUDY", detail: "2025—2027" },
]

const practices = [
  { number: "01", title: "Operate", text: "Keeping enterprise and hospitality technology dependable, practical, and ready for the people using it every day." },
  { number: "02", title: "Secure", text: "Approaching infrastructure, networks, and software with an ethical-hacker mindset and security built in from the start." },
  { number: "03", title: "Build", text: "Turning technical ideas into useful full-stack products, clear interfaces, and systems that are easier to trust." },
]

export default function AboutSection() {
  const reduced = useReducedMotion()

  return (
    <section id="about" className="about-profile section-shell border-t border-border">
      <div className="section-container">
        <div className="section-heading-row">
          <SectionHeading number="01" label="PROFILE &amp; PRACTICE" title="Technical by nature." accent="Human by design." />
        </div>

        <div className="about-profile-layout">
          <motion.figure
            initial={reduced ? undefined : { opacity: 0, x: -72 }}
            whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="about-profile-portrait"
          >
            <ParallaxImage src="/user/about.jpg" alt="Karthik Lal" sizes="(min-width: 1024px) 42vw, 100vw" />
            <div className="about-profile-shade" />
            <div className="portrait-coordinate" aria-hidden="true">SYSTEMS / SECURITY / DESIGN</div>
            <svg className="portrait-signal" viewBox="0 0 160 160" fill="none" aria-hidden="true">
              <circle cx="80" cy="80" r="62" />
              <circle cx="80" cy="80" r="42" strokeDasharray="2 8" />
              <path d="M80 2v32m0 92v32M2 80h32m92 0h32" />
              <path d="m58 80 15 15 30-34" className="portrait-signal-mark" />
            </svg>
            <figcaption>
              <span>PROFILE / 2026</span>
              <div>
                <strong>KARTHIK LAL</strong>
                <span><MapPin aria-hidden="true" /> KERALA, INDIA</span>
              </div>
            </figcaption>
          </motion.figure>

          <motion.div
            initial={reduced ? undefined : { opacity: 0, x: 72 }}
            whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="about-profile-copy"
          >
            <p className="studio-label">ABOUT / KARTHIK LAL</p>
            <h3>I keep complex systems calm—and make digital work feel clear.</h3>
            <div className="about-profile-intro">
              <p>I&apos;m an IT Manager at The Indian Hotels Company Limited, working across enterprise technology, cybersecurity, and dependable day-to-day operations.</p>
              <p>Outside the operational layer, I build full-stack products, security tools, and visual experiences. The disciplines change; the standard stays the same: useful, resilient, and thoughtfully made.</p>
            </div>

            <div className="about-profile-facts" aria-label="Profile facts">
              {profileFacts.map(fact => (
                <div key={fact.label}>
                  <span>{fact.label}</span>
                  <strong>{fact.value}</strong>
                  {fact.detail && <small>{fact.detail}</small>}
                </div>
              ))}
            </div>

            <a className="about-linkedin" href="https://www.linkedin.com/in/karthiklal/" target="_blank" rel="noopener noreferrer">
              <Linkedin aria-hidden="true" />
              <span>VIEW LINKEDIN PROFILE</span>
              <ArrowUpRight aria-hidden="true" />
            </a>
          </motion.div>
        </div>

        <div className="about-practice-grid">
          {practices.map((practice, index) => (
            <motion.article
              key={practice.title}
              initial={reduced ? undefined : { opacity: 0, y: 34 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
            >
              <span>{practice.number}</span>
              <h4>{practice.title}</h4>
              <p>{practice.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
