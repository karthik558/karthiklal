import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms",
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
