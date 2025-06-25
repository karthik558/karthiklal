import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore Karthik Lal's portfolio of web development, cybersecurity, and software projects. From React applications to security tools and system administration solutions.",
  openGraph: {
    title: "Projects | Karthik Lal",
    description: "Explore Karthik Lal's portfolio of web development, cybersecurity, and software projects. From React applications to security tools and system administration solutions.",
  },
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
