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
  display: "swap",
  preload: true,
})

const fontDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: "KARTHIK LAL",
    template: "KARTHIK LAL - %s"
  },
  applicationName: "Karthik Lal Portfolio",
  description: "Karthik Lal is an IT Manager and Certified Ethical Hacker with enterprise experience since 2019 in cybersecurity, network management, and full-stack development. Based in Kerala, India.",
  keywords: [
    "Karthik Lal",
    "IT Manager Kerala",
    "Certified Ethical Hacker India",
    "Full Stack Developer India",
    "Network Security Expert",
    "Hospitality Technology",
    "Cybersecurity Portfolio"
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
        url: "/user/hero.webp",
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
    site: "@_karthiklal",
    creator: "@_karthiklal",
    images: ["/user/hero.webp"],
  },
  icons: {
    icon: [
      { url: "/logo/favicon.webp", sizes: "48x48", type: "image/webp" },
      { url: "/logo/favicon-192x192.webp", sizes: "192x192", type: "image/webp" },
    ],
    shortcut: "/logo/favicon.webp",
    apple: [
      { url: "/logo/favicon-192x192.webp", sizes: "192x192", type: "image/webp" },
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
          "min-h-screen bg-background font-sans antialiased",
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
