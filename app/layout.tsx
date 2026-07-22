import type React from "react"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans, Bricolage_Grotesque } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import AppWrapper from "@/components/app-wrapper"
import { Toaster } from "@/components/ui/sonner"

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  title: {
    default: "KARTHIK LAL",
    template: "KARTHIK LAL - %s"
  },
  description: "Karthik Lal is an IT Manager and Certified Ethical Hacker with enterprise experience since 2019 in cybersecurity, network management, and full-stack development. Based in Kerala, India.",
  keywords: [
    // Primary name variations for better search visibility
    "Karthik Lal",
    "Who is Karthik Lal",
    "Karthik Lal IT Manager",
    "Karthik Lal Certified Ethical Hacker",
    "Karthik Lal Full Stack Developer",
    "Karthik Lal Kerala",
    "Karthik Lal India",
    "Karthik Lal IHCL",
    "Karthik Lal Cybersecurity",
    "Karthik Lal Portfolio",
    "Karthik Lal Developer",
    "Karthik Lal Website",
    // Professional titles and expertise
    "IT Manager Kerala",
    "Certified Ethical Hacker India",
    "Cybersecurity Expert Kerala",
    "Full Stack Developer India",
    "Web Developer Kerala",
    "Network Security Expert",
    "Threat Intelligence Specialist",
    "IHCL IT Manager",
    "React Developer Kerala",
    "Next.js Developer India",
    "TypeScript Developer",
    "Rust Developer",
    "Python Developer",
    "Cybersecurity Researcher",
    "Penetration Testing Expert",
    "Network Management Specialist",
    "DDOS Mitigation Expert",
    "Phishing Defense Specialist",
    "Information Security Expert",
    "Linux System Administrator",
    "Hotel IT Solutions Expert",
    "Infrastructure Management",
    "Hospitality Technology",
    "CEH Certified Professional",
    "BCA Graduate Kerala",
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
    title: "Karthik Lal - IT Manager, Certified Ethical Hacker & Full Stack Developer",
    description: "Meet Karthik Lal: an IT Manager with enterprise experience since 2019 in cybersecurity and full-stack development. Based in Kerala, India.",
    siteName: "Karthik Lal - Official Portfolio",
    images: [
      {
        url: "/1.jpg",
        width: 1200,
        height: 630,
        alt: "Karthik Lal - IT Manager & Certified Ethical Hacker from Kerala, India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Karthik Lal - IT Manager & Certified Ethical Hacker",
    description: "Meet Karthik Lal: an IT Manager with enterprise experience since 2019 in cybersecurity, full-stack development, and network management.",
    site: "@karthiklal_in",
    creator: "@karthiklal_in",
    images: ["/1.jpg"],
  },
  icons: {
    icon: [
      { url: "/icon", sizes: "32x32", type: "image/png" },
      { url: "/logo-dark.png", sizes: "192x192", type: "image/png" }
    ],
    shortcut: "/icon",
    apple: [
      { url: "/apple-icon", sizes: "180x180", type: "image/png" },
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
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased transition-colors duration-300",
          fontSans.variable,
          fontDisplay.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
          <AppWrapper>
            {children}
          </AppWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
