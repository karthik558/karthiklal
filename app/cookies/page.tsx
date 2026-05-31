"use client"

import Link from "next/link"
import { ArrowLeft, Cookie, Settings, Eye, BarChart, Shield, Mail, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export default function CookiePolicyPage() {
  const lastUpdated = "December 25, 2024"

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  }

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30 pt-24 pb-32">
      {/* Immersive Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-primary/5 via-background to-background" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]"
        />
      </div>

      <div className="container max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 pt-8 text-center flex flex-col items-center"
        >
          <Badge variant="outline" className="mb-6 px-4 py-1.5 rounded-full bg-primary/5 border-primary/20 text-primary text-xs font-semibold tracking-[0.2em] uppercase">
            Legal & Trust
          </Badge>
          <div className="flex items-center justify-center gap-4 mb-6">
            <Cookie className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight">
              Cookie <span className="text-gradient">Policy</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light leading-relaxed mb-6">
            Understand how we use cookies and similar technologies to enhance your browsing experience.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 backdrop-blur-md border border-foreground/5 px-4 py-2 rounded-full">
            <Calendar className="h-4 w-4 text-primary" />
            <span>Last updated: <span className="text-foreground font-medium">{lastUpdated}</span></span>
          </div>
        </motion.div>

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors bg-secondary/30 backdrop-blur-md border border-foreground/5 px-4 py-2 rounded-full hover:bg-secondary/50">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </motion.div>

        {/* Content Blocks */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* What Are Cookies */}
          <motion.div variants={itemVariants} className="p-8 md:p-10 rounded-[2rem] bg-secondary/20 backdrop-blur-md border border-foreground/5 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-700" />
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
              <Cookie className="h-6 w-6 text-primary" />
              What Are Cookies?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 text-lg font-light">
              Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit our website. They help us provide you with a better browsing experience by remembering your preferences and understanding how you use our site.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-background/50 rounded-2xl border border-foreground/5 backdrop-blur-sm transition-transform hover:-translate-y-1">
                <h3 className="font-semibold text-foreground mb-1 text-lg">First-Party Cookies</h3>
                <p className="text-sm text-muted-foreground">Set directly by our website to remember your preferences and improve functionality.</p>
              </div>
              <div className="p-6 bg-background/50 rounded-2xl border border-foreground/5 backdrop-blur-sm transition-transform hover:-translate-y-1">
                <h3 className="font-semibold text-foreground mb-1 text-lg">Session vs Persistent</h3>
                <p className="text-sm text-muted-foreground">Session cookies expire when you close your browser, while persistent cookies remain for a set period.</p>
              </div>
            </div>
          </motion.div>

          {/* Types of Cookies We Use */}
          <motion.div variants={itemVariants} className="p-8 md:p-10 rounded-[2rem] bg-secondary/20 backdrop-blur-md border border-foreground/5 shadow-xl">
            <h2 className="text-2xl font-display font-bold mb-8">Types of Cookies We Use</h2>
            
            <div className="space-y-6">
              {/* Essential Cookies */}
              <div className="p-6 rounded-2xl bg-background/40 border border-foreground/5 transition-all hover:bg-background/60">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-green-500" />
                    <h3 className="text-xl font-semibold text-foreground/90">Essential Cookies</h3>
                  </div>
                  <Badge variant="outline" className="text-green-500 border-green-500/30 bg-green-500/10">Required</Badge>
                </div>
                <p className="text-muted-foreground mb-4">These cookies are necessary for the website to function properly and cannot be disabled.</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-secondary/30">
                    <span className="font-medium text-foreground">Theme Preference</span>
                    <span className="text-muted-foreground text-sm">Remembers dark/light mode</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-secondary/30">
                    <span className="font-medium text-foreground">Security</span>
                    <span className="text-muted-foreground text-sm">Protects against CSRF attacks</span>
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="p-6 rounded-2xl bg-background/40 border border-foreground/5 transition-all hover:bg-background/60">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <BarChart className="h-6 w-6 text-blue-500" />
                    <h3 className="text-xl font-semibold text-foreground/90">Analytics Cookies</h3>
                  </div>
                  <Badge variant="outline" className="text-blue-500 border-blue-500/30 bg-blue-500/10">Optional</Badge>
                </div>
                <p className="text-muted-foreground mb-4">Help us understand how visitors interact with our website by collecting anonymous information.</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-secondary/30">
                    <span className="font-medium text-foreground">Page Views</span>
                    <span className="text-muted-foreground text-sm">Track which pages are visited</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-secondary/30">
                    <span className="font-medium text-foreground">Session Duration</span>
                    <span className="text-muted-foreground text-sm">Measure time spent on site</span>
                  </div>
                </div>
              </div>

              {/* Performance Cookies */}
              <div className="p-6 rounded-2xl bg-background/40 border border-foreground/5 transition-all hover:bg-background/60">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Settings className="h-6 w-6 text-purple-500" />
                    <h3 className="text-xl font-semibold text-foreground/90">Performance Cookies</h3>
                  </div>
                  <Badge variant="outline" className="text-purple-500 border-purple-500/30 bg-purple-500/10">Optional</Badge>
                </div>
                <p className="text-muted-foreground mb-4">Allow us to optimize website performance and loading times.</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-secondary/30">
                    <span className="font-medium text-foreground">Load Time</span>
                    <span className="text-muted-foreground text-sm">Monitor page loading performance</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-secondary/30">
                    <span className="font-medium text-foreground">Error Tracking</span>
                    <span className="text-muted-foreground text-sm">Identify and fix technical issues</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cookie Management */}
          <motion.div variants={itemVariants} className="p-8 md:p-10 rounded-[2rem] bg-secondary/20 backdrop-blur-md border border-foreground/5 shadow-xl">
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
              <Settings className="h-6 w-6 text-primary" />
              Managing Your Cookie Preferences
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">You have several options to control and manage cookies:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-background/50 border border-foreground/5 backdrop-blur-sm">
                <h4 className="font-semibold text-foreground mb-3 text-lg">Browser Settings</h4>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Most browsers allow you to control cookies through their settings. Find these options in the "Privacy" or "Security" sections.
                </p>
                <div className="flex flex-wrap gap-2 text-sm">
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-full bg-secondary/50 text-foreground hover:bg-primary/20 hover:text-primary transition-colors">Chrome</a>
                  <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-full bg-secondary/50 text-foreground hover:bg-primary/20 hover:text-primary transition-colors">Firefox</a>
                  <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-full bg-secondary/50 text-foreground hover:bg-primary/20 hover:text-primary transition-colors">Safari</a>
                  <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-full bg-secondary/50 text-foreground hover:bg-primary/20 hover:text-primary transition-colors">Edge</a>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-background/50 border border-foreground/5 backdrop-blur-sm">
                <h4 className="font-semibold text-foreground mb-3 text-lg">If Disabled...</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
                    <span className="w-2 h-2 bg-amber-500 rounded-full shrink-0" />
                    <span>Your theme preference won't be remembered</span>
                  </li>
                  <li className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
                    <span className="w-2 h-2 bg-amber-500 rounded-full shrink-0" />
                    <span>We won't be able to analyze website usage</span>
                  </li>
                  <li className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
                    <span className="w-2 h-2 bg-amber-500 rounded-full shrink-0" />
                    <span>Some features may not work as expected</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-6 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-4">
              <Eye className="h-6 w-6 text-primary shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">Do Not Track</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We respect the "Do Not Track" browser setting. When enabled, we will not use analytics or performance cookies.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Third-Party Services */}
          <motion.div variants={itemVariants} className="p-8 md:p-10 rounded-[2rem] bg-secondary/20 backdrop-blur-md border border-foreground/5 shadow-xl">
            <h2 className="text-2xl font-display font-bold mb-6">Third-Party Services</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              We may use third-party services that set their own cookies. These services have their own privacy policies:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="group block p-5 rounded-2xl bg-background/50 border border-foreground/5 hover:border-primary/30 transition-colors backdrop-blur-sm">
                <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">Google Analytics</h4>
                <p className="text-sm text-muted-foreground">Website analytics and performance monitoring</p>
              </a>
              <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="group block p-5 rounded-2xl bg-background/50 border border-foreground/5 hover:border-primary/30 transition-colors backdrop-blur-sm">
                <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">Vercel Analytics</h4>
                <p className="text-sm text-muted-foreground">Hosting platform analytics</p>
              </a>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants} className="p-8 md:p-10 rounded-[2rem] bg-primary/5 backdrop-blur-md border border-primary/10 shadow-xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
            <div className="relative z-10">
              <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-display font-bold mb-4">Questions About Cookies?</h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                If you have any questions about our use of cookies, please reach out.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="mailto:contact@karthiklal.in" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                  contact@karthiklal.in
                </a>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  )
}
