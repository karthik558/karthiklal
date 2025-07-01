import type { Metadata } from "next"
import ContactSection from "@/components/sections/contact-section"

export const metadata: Metadata = {
  title: "Contact Karthik Lal - Hire IT Manager & Cybersecurity Expert",
  description: "Get in touch with Karthik Lal for IT consulting, cybersecurity services, web development projects, or collaboration opportunities. Professional IT Manager and Certified Ethical Hacker based in Kerala, India.",
  keywords: [
    "contact Karthik Lal",
    "hire Karthik Lal",
    "Karthik Lal services",
    "IT consulting Kerala",
    "cybersecurity services India",
    "web development services",
    "IT Manager for hire",
    "ethical hacker services",
    "freelance developer Kerala",
    "IT consultation India"
  ],
  openGraph: {
    title: "Contact Karthik Lal - Professional IT & Cybersecurity Services",
    description: "Connect with Karthik Lal for expert IT consulting, cybersecurity services, and web development projects. Professional IT Manager and Certified Ethical Hacker.",
    url: "https://karthiklal.in/contact",
    images: [
      {
        url: "/1.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Karthik Lal - IT Manager & Cybersecurity Expert",
      },
    ],
  },
  twitter: {
    title: "Contact Karthik Lal - IT & Cybersecurity Services",
    description: "Get professional IT consulting and cybersecurity services from experienced IT Manager Karthik Lal.",
  },
  alternates: {
    canonical: "https://karthiklal.in/contact",
  },
}

export default function ContactPage() {
  return <ContactSection />
}