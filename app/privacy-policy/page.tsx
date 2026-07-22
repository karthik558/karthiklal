"use client"

import { LegalCard, LegalContact, LegalGrid, LegalList, LegalPage, LegalSection } from "@/components/legal-page"

const navItems = [
  { number: "01", label: "Overview", href: "#overview" },
  { number: "02", label: "Collection", href: "#collection" },
  { number: "03", label: "Usage", href: "#usage" },
  { number: "04", label: "Protection", href: "#protection" },
  { number: "05", label: "Rights", href: "#rights" },
]

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      documentNumber="01"
      title="Privacy"
      outlinedTitle="Policy"
      description="A clear account of what information this portfolio collects, why it is used, and the choices available to you."
      lastUpdated="25 Dec 2024"
      navItems={navItems}
    >
      <LegalSection
        number="01"
        id="overview"
        title="Privacy at a glance"
        intro="This portfolio is designed to collect as little personal information as possible. Personal data is never sold or shared with third parties for advertising."
      >
        <LegalGrid columns={3}>
          <LegalCard title="Minimal data" tag="Principle">Only information required to respond, secure the site, and understand basic usage is collected.</LegalCard>
          <LegalCard title="Secure handling" tag="Practice">Reasonable technical and organizational safeguards are used to protect submitted information.</LegalCard>
          <LegalCard title="No ad profiles" tag="Promise">Your activity is not used to build advertising profiles or sold to data brokers.</LegalCard>
        </LegalGrid>
      </LegalSection>

      <LegalSection number="02" id="collection" title="Information collected" intro="Information arrives in two ways: details you choose to submit and limited technical data generated when the site is used.">
        <div className="space-y-8">
          <div>
            <h3 className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">Information you provide</h3>
            <LegalList items={[
              { title: "Contact details", text: "Your name, email address, and message when you use the contact form or send an email." },
              { title: "Communications", text: "Any additional information you voluntarily include in correspondence." },
            ]} />
          </div>
          <div>
            <h3 className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">Collected automatically</h3>
            <LegalList items={[
              { title: "Usage data", text: "Basic analytics such as pages visited, approximate session duration, and referring source." },
              { title: "Device information", text: "Browser, operating system, and device category used to improve compatibility." },
              { title: "Network information", text: "IP address and request metadata processed by the hosting provider for delivery, security, and analytics." },
            ]} />
          </div>
        </div>
      </LegalSection>

      <LegalSection number="03" id="usage" title="How information is used" intro="Collected information is limited to practical site operations and direct communication.">
        <LegalGrid>
          <LegalCard title="Communication">Respond to enquiries, discuss potential work, and provide requested information.</LegalCard>
          <LegalCard title="Improvement">Understand broad usage patterns and improve performance, accessibility, and content.</LegalCard>
          <LegalCard title="Security">Detect abuse, troubleshoot incidents, and protect the website and its visitors.</LegalCard>
          <LegalCard title="Compliance">Meet applicable legal obligations and respond to lawful requests where required.</LegalCard>
        </LegalGrid>
      </LegalSection>

      <LegalSection number="04" id="protection" title="Storage and disclosure" intro="Personal information is retained only as long as reasonably necessary for the purpose it was collected or as required by law.">
        <LegalList items={[
          { title: "Service providers", text: "Trusted hosting, email, and analytics providers may process limited data only to deliver their services." },
          { title: "Security controls", text: "Access is limited and reasonable safeguards are used, although no online transmission or storage system can guarantee absolute security." },
          { title: "Legal disclosure", text: "Information may be disclosed where required by law, regulation, legal process, or a valid governmental request." },
          { title: "External links", text: "This site may link to third-party websites. Their privacy practices are governed by their own policies." },
        ]} />
      </LegalSection>

      <LegalSection number="05" id="rights" title="Your choices and rights" intro="Depending on your location, you may have rights concerning the personal information held about you.">
        <LegalList items={[
          { title: "Access", text: "Ask what personal information is held about you and request a copy." },
          { title: "Correction", text: "Request that inaccurate or incomplete personal information be corrected." },
          { title: "Deletion", text: "Ask for personal information to be deleted when there is no overriding reason to retain it." },
          { title: "Objection", text: "Object to or restrict certain processing, including optional analytics where applicable." },
        ]} />
      </LegalSection>

      <LegalContact subject="privacy" />
    </LegalPage>
  )
}
