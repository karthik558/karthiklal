import type { Metadata } from "next"
import ContactSection from "@/components/sections/contact-section"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Karthik Lal for IT consulting, cybersecurity services, web development projects, or collaboration opportunities.",
  openGraph: {
    title: "Contact | Karthik Lal",
    description: "Get in touch with Karthik Lal for IT consulting, cybersecurity services, web development projects, or collaboration opportunities.",
  },
}

export default function ContactPage() {
  return <ContactSection />
}