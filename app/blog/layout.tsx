import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts, tutorials, and insights about web development, design, and technology from Karthik Lal.",
  openGraph: {
    title: "Blog | Karthik Lal",
    description: "Thoughts, tutorials, and insights about web development, design, and technology from Karthik Lal.",
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
