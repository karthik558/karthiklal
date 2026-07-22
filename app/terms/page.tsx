"use client"

import { LegalCard, LegalContact, LegalGrid, LegalList, LegalPage, LegalSection } from "@/components/legal-page"

const navItems = [
  { number: "01", label: "Agreement", href: "#agreement" },
  { number: "02", label: "Use license", href: "#license" },
  { number: "03", label: "Responsibilities", href: "#responsibilities" },
  { number: "04", label: "Liability", href: "#liability" },
  { number: "05", label: "General terms", href: "#general" },
]

export default function TermsPage() {
  return (
    <LegalPage
      documentNumber="03"
      title="Terms of"
      outlinedTitle="Service"
      description="The conditions that govern access to this portfolio, its content, and the external resources linked from it."
      lastUpdated="25 Dec 2024"
      navItems={navItems}
    >
      <LegalSection
        number="01"
        id="agreement"
        title="Agreement to these terms"
        intro="By accessing karthiklal.in, you agree to these Terms of Service. If you do not agree with them, please discontinue use of the website."
      >
        <LegalGrid columns={3}>
          <LegalCard title="Personal portfolio" tag="Scope">
            This website presents professional information, selected work, writing, and ways to contact Karthik Lal.
          </LegalCard>
          <LegalCard title="Acceptance" tag="Access">
            Continued access to or use of the website indicates acceptance of the current version of these terms.
          </LegalCard>
          <LegalCard title="Updates" tag="Revision">
            These terms may be revised when the website, its services, or applicable requirements change.
          </LegalCard>
        </LegalGrid>
      </LegalSection>

      <LegalSection
        number="02"
        id="license"
        title="Use license"
        intro="A limited, temporary license is granted to view or download website materials for personal, non-commercial use. Ownership is not transferred."
      >
        <LegalList items={[
          { title: "No commercial reuse", text: "Do not reproduce, republish, sell, or use website materials for a commercial purpose without prior written permission." },
          { title: "No unauthorized modification", text: "Do not modify, copy, decompile, reverse engineer, or create misleading derivatives of website materials or software." },
          { title: "Preserve attribution", text: "Do not remove copyright, ownership, attribution, or other proprietary notices from downloaded materials." },
          { title: "License termination", text: "This permission ends automatically if these restrictions are violated, after which retained copies must be deleted or destroyed." },
        ]} />
      </LegalSection>

      <LegalSection
        number="03"
        id="responsibilities"
        title="Acceptable use"
        intro="Visitors are responsible for using the website lawfully and without interfering with its availability, security, or the rights of others."
      >
        <div className="space-y-8">
          <LegalGrid>
            <LegalCard title="Lawful conduct">Do not use the website to violate applicable laws, regulations, or the intellectual-property and privacy rights of others.</LegalCard>
            <LegalCard title="Accurate communication">Do not submit false, misleading, abusive, discriminatory, defamatory, or fraudulent information through the website.</LegalCard>
            <LegalCard title="System integrity">Do not upload malicious code, probe for vulnerabilities without authorization, disrupt service, or attempt unauthorized access.</LegalCard>
            <LegalCard title="Responsible linking">Do not present links to this website in a way that falsely suggests endorsement, partnership, or ownership.</LegalCard>
          </LegalGrid>

          <div className="border-l-2 border-foreground bg-card/60 p-5 sm:p-6">
            <h3 className="font-display text-xl font-black uppercase text-foreground">Enforcement</h3>
            <p className="mt-3 text-sm font-light leading-6 text-muted-foreground">
              Access may be restricted where activity threatens the website, its visitors, or applicable rights. Suspected unlawful activity may be reported where legally required.
            </p>
          </div>
        </div>
      </LegalSection>

      <LegalSection
        number="04"
        id="liability"
        title="Disclaimers and liability"
        intro="The website and its materials are provided on an “as is” and “as available” basis, without guarantees that they will always be complete, current, uninterrupted, or error-free."
      >
        <LegalList items={[
          { title: "Accuracy", text: "Materials may contain technical, typographical, or photographic errors and may be changed without prior notice." },
          { title: "No warranties", text: "To the extent permitted by law, express and implied warranties—including merchantability, fitness for a particular purpose, and non-infringement—are disclaimed." },
          { title: "External websites", text: "Third-party links are provided for convenience. Their content, availability, security, and policies remain the responsibility of their operators." },
          { title: "Limitation of liability", text: "To the extent permitted by law, Karthik Lal is not liable for indirect, incidental, consequential, or data-loss damages arising from use of, or inability to use, this website." },
        ]} />
      </LegalSection>

      <LegalSection
        number="05"
        id="general"
        title="General provisions"
        intro="These provisions explain how the terms are maintained and interpreted."
      >
        <LegalGrid>
          <LegalCard title="Changes">The current terms apply whenever you use the website. The updated date above identifies the latest published revision.</LegalCard>
          <LegalCard title="Governing law">These terms are governed by the applicable laws of India, subject to any mandatory rights available in your jurisdiction.</LegalCard>
          <LegalCard title="Severability">If any provision is held unenforceable, the remaining provisions continue to apply to the fullest extent permitted.</LegalCard>
          <LegalCard title="Entire agreement">These terms, together with the Privacy and Cookie policies, form the agreement governing use of this website.</LegalCard>
        </LegalGrid>
      </LegalSection>

      <LegalContact subject="these terms" />
    </LegalPage>
  )
}
