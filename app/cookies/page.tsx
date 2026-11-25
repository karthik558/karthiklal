"use client"

import { ArrowUpRight } from "lucide-react"
import { LegalCard, LegalContact, LegalGrid, LegalList, LegalPage, LegalSection } from "@/components/legal-page"

const navItems = [
  { number: "01", label: "Definition", href: "#definition" },
  { number: "02", label: "Cookie types", href: "#types" },
  { number: "03", label: "Management", href: "#management" },
  { number: "04", label: "Third parties", href: "#third-parties" },
]

const browserLinks = [
  { name: "Chrome", href: "https://support.google.com/chrome/answer/95647" },
  { name: "Firefox", href: "https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" },
  { name: "Safari", href: "https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" },
  { name: "Edge", href: "https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" },
]

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie"
      outlinedTitle="Policy"
      lastUpdated="25 Dec 2024"
      navItems={navItems}
    >
      <LegalSection
        number="01"
        id="definition"
        title="What are cookies?"
        intro="Cookies are small text files stored on your computer, tablet, or phone when you visit a website. They can remember preferences, support essential functions, and provide limited usage information."
      >
        <LegalGrid>
          <LegalCard title="First-party cookies" tag="Origin">Set directly by this website to remember preferences and support core functionality.</LegalCard>
          <LegalCard title="Session & persistent" tag="Duration">Session cookies expire when the browser closes; persistent cookies remain for a defined period or until removed.</LegalCard>
        </LegalGrid>
      </LegalSection>

      <LegalSection number="02" id="types" title="Cookies used" intro="The site may use the following categories. Optional categories are used only where enabled and applicable.">
        <div className="space-y-6">
          <div className="border border-border bg-card/60 p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="registry-kicker">Category 01</p>
                <h3 className="mt-1.5 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Essential cookies</h3>
              </div>
              <span className="registry-status">Required</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Necessary for the website to function and generally cannot be disabled through the site.</p>
            <div className="mt-5"><LegalList items={[
              { title: "Theme preference", text: "Remembers whether you selected light or dark mode." },
              { title: "Security", text: "Supports protection against malicious requests and abuse." },
            ]} /></div>
          </div>

          <LegalGrid>
            <LegalCard title="Analytics" tag="Optional">
              Anonymous measurements such as page views, referring sources, and approximate session duration.
            </LegalCard>
            <LegalCard title="Performance" tag="Optional">
              Technical measurements used to monitor loading speed, reliability, and application errors.
            </LegalCard>
          </LegalGrid>
        </div>
      </LegalSection>

      <LegalSection number="03" id="management" title="Managing preferences" intro="Most browsers let you review, block, or delete cookies. These controls are usually found under Privacy or Security settings.">
        <div className="grid gap-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {browserLinks.map((browser) => (
              <a
                key={browser.name}
                href={browser.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between border border-border bg-card/60 p-5 font-display text-lg font-semibold tracking-tight text-foreground transition-colors hover:border-primary"
              >
                {browser.name}
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </a>
            ))}
          </div>

          <div>
            <h3 className="studio-label mb-3">What changes when cookies are disabled</h3>
            <LegalList items={[
              { text: "Your theme preference may not be remembered between visits." },
              { text: "Anonymous usage and performance measurements may no longer be available." },
              { text: "Some website features may behave differently or require preferences to be set again." },
            ]} />
          </div>

          <div className="border-l-2 border-primary bg-card/60 p-5 sm:p-6">
            <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">Do Not Track</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Where technically supported, the site respects browser signals intended to limit optional analytics or performance tracking.</p>
          </div>
        </div>
      </LegalSection>

      <LegalSection number="04" id="third-parties" title="Third-party services" intro="Some infrastructure and analytics providers may set or process their own cookies. Their handling is governed by their respective policies.">
        <LegalGrid>
          <LegalCard title="Google Analytics" tag="Analytics">
            Website usage and performance measurement. <a className="font-medium text-foreground underline decoration-primary underline-offset-4 hover:text-primary" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Read Google’s policy.</a>
          </LegalCard>
          <LegalCard title="Vercel" tag="Hosting">
            Hosting infrastructure and limited platform analytics. <a className="font-medium text-foreground underline decoration-primary underline-offset-4 hover:text-primary" href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Read Vercel’s policy.</a>
          </LegalCard>
        </LegalGrid>
      </LegalSection>

      <LegalContact subject="cookies" />
    </LegalPage>
  )
}
