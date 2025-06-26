import type React from "react"
import type { Metadata } from "next"
import { Mona_Sans as FontSans } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import AppWrapper from "@/components/app-wrapper"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: {
    default: "KARTHIK LAL - Certified Ethical Hacker",
    template: "%s | Karthik Lal"
  },
  description: "Karthik Lal is a 25-year-old IT Manager and cybersecurity expert with 6.8+ years of experience in network management, threat intelligence, and full-stack development. Based in Kerala, India, specializing in secure IT solutions, web development, and cybersecurity education.",
  keywords: [
    "Karthik Lal",
    "IT Manager",
    "Certified Ethical Hacker",
    "Cybersecurity Expert",
    "Full Stack Developer",
    "Web Developer",
    "Network Security",
    "Threat Intelligence",
    "IHCL IT Manager",
    "Kerala India",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Rust Developer",
    "Python Developer",
    "Cybersecurity Researcher",
    "Penetration Testing",
    "Network Management",
    "DDOS Mitigation",
    "Phishing Defense",
    "Information Security",
    "Cyberattack Response",
    "Cybercrime Prevention",
    "Linux System Administrator",
    "Hotel IT Solutions",
    "Guest Connectivity",
    "Infrastructure Management",
    "Hospitality Technology",
    "CEH Certified",
    "BCA Graduate",
    "MCA Student"
  ],
  authors: [{ name: "Karthik Lal", url: "https://karthiklal.in" }],
  creator: "Karthik Lal",
  publisher: "Karthik Lal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://karthiklal.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://karthiklal.in",
    title: "Karthik Lal - IT Manager & Certified Ethical Hacker",
    description: "IT Manager with 6.8+ years in cybersecurity and full-stack development. Specializing in secure IT solutions, network management, and threat intelligence. Based in Kerala, India.",
    siteName: "Karthik Lal Portfolio",
    images: [
      {
        url: "/1.jpg",
        width: 1200,
        height: 630,
        alt: "Karthik Lal - IT Manager & Certified Ethical Hacker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Karthik Lal - IT Manager & Certified Ethical Hacker",
    description: "IT Manager with 6.8+ years in cybersecurity and full-stack development. Specializing in secure IT solutions and network management.",
    site: "@karthiklal_in",
    creator: "@karthiklal_in",
    images: ["/1.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" }
    ],
    shortcut: "/favicon/favicon.ico",
    apple: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon.ico", sizes: "180x180", type: "image/x-icon" },
    ],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code-here", // You'll need to add your Google Search Console verification code
  },
  category: "technology",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased transition-colors duration-300",
          fontSans.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
          <AppWrapper>
            {children}
          </AppWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}