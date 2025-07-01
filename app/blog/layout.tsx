import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog by Karthik Lal - Cybersecurity, Web Development & Tech Insights",
  description: "Read Karthik Lal's blog for expert insights on cybersecurity, web development, IT management, and technology trends. Tutorials, tips, and industry analysis from an experienced IT Manager and Certified Ethical Hacker.",
  keywords: [
    "Karthik Lal blog",
    "Karthik Lal articles",
    "cybersecurity blog",
    "web development blog", 
    "IT management blog",
    "technology blog Kerala",
    "ethical hacking tutorials",
    "security insights",
    "tech tutorials India",
    "programming blog"
  ],
  openGraph: {
    title: "Blog by Karthik Lal - Cybersecurity & Web Development Insights",
    description: "Expert insights on cybersecurity, web development, and technology from Karthik Lal, IT Manager and Certified Ethical Hacker. Tutorials, tips, and industry analysis.",
    url: "https://karthiklal.in/blog",
    images: [
      {
        url: "/1.jpg",
        width: 1200,
        height: 630,
        alt: "Karthik Lal's Tech Blog - Cybersecurity & Development Insights",
      },
    ],
  },
  twitter: {
    title: "Blog by Karthik Lal - Tech Insights & Tutorials",
    description: "Expert insights on cybersecurity, web development, and technology from IT Manager Karthik Lal.",
  },
  alternates: {
    canonical: "https://karthiklal.in/blog",
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
