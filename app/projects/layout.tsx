import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Projects by Karthik Lal - Portfolio of Web Development & Cybersecurity Projects",
  description: "Explore Karthik Lal's comprehensive portfolio of web development, cybersecurity, and IT projects. Full-stack applications, security tools, and innovative solutions built with React, Next.js, Python, Rust, and modern technologies.",
  keywords: [
    "Karthik Lal projects",
    "Karthik Lal portfolio", 
    "Karthik Lal web development",
    "Karthik Lal cybersecurity projects",
    "React projects Karthik Lal",
    "Next.js projects",
    "Python projects",
    "Rust projects", 
    "full stack applications",
    "cybersecurity tools",
    "IT solutions portfolio",
    "web applications Kerala",
    "developer portfolio India"
  ],
  openGraph: {
    title: "Projects by Karthik Lal - Web Development & Cybersecurity Portfolio",
    description: "Explore Karthik Lal's portfolio of innovative web development and cybersecurity projects. See full-stack applications and security solutions built with cutting-edge technologies.",
    url: "https://karthiklal.in/projects",
    images: [
      {
        url: "/1.jpg",
        width: 1200,
        height: 630,
        alt: "Karthik Lal's Project Portfolio - Web Development & Cybersecurity",
      },
    ],
  },
  twitter: {
    title: "Projects by Karthik Lal - Developer Portfolio",
    description: "Explore innovative web development and cybersecurity projects by Karthik Lal. Full-stack applications and security solutions.",
  },
  alternates: {
    canonical: "https://karthiklal.in/projects",
  },
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
