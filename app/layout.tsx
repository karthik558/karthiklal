import type React from "react"
import type { Metadata } from "next"
import { Mona_Sans as FontSans } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@/components/analytics"
import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"
import Preloader from "@/components/preloader"
import BackToTop from "@/components/back-to-top"
import { LoadingProvider } from "@/components/loading-context"
import ContentWrapper from "@/components/content-wrapper"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Karthik Lal | IT Manager & Full Stack Developer",
  description: "IT Manager with 6.8+ years in network management, cybersecurity, and full-stack development. Specializing in secure, scalable IT solutions.",
  keywords: ["IT Manager", "Full Stack Developer", "Cybersecurity", "Network Security", "React", "Next.js", "TypeScript", "Rust", "Python", "Kerala"],
  authors: [{ name: "Karthik Lal" }],
  creator: "Karthik Lal",
  icons: {
    icon: [
      {
        url: "/logo-dark.png",
        sizes: "any"
      }
    ],
    shortcut: "/logo-dark.png",
    apple: "/logo-dark.png"
  }
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
          <LoadingProvider>
            <Preloader />
            <ContentWrapper>
              <NavBar />
              <main>{children}</main>
              <Footer />
              <BackToTop />
            </ContentWrapper>
            <Analytics />
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}