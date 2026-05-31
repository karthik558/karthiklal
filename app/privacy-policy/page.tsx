"use client"

import Link from "next/link"
import { ArrowLeft, Shield, Eye, Cookie, Database, Mail, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export default function PrivacyPolicyPage() {
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
            <Shield className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight">
              Privacy <span className="text-gradient">Policy</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light leading-relaxed mb-6">
            Transparency is a core principle of my work. Learn exactly how your data is treated when you visit this platform.
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
          {/* Quick Overview */}
          <motion.div variants={itemVariants} className="p-8 md:p-10 rounded-[2rem] bg-secondary/20 backdrop-blur-md border border-foreground/5 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-700" />
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
              <Eye className="h-6 w-6 text-primary" />
              Quick Overview
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 text-lg font-light">
              Your privacy is important to us. This portfolio website is designed with privacy in mind. We collect minimal information and do not sell or share your personal data with third parties for marketing purposes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-background/50 rounded-2xl border border-foreground/5 backdrop-blur-sm transition-transform hover:-translate-y-1">
                <Database className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-foreground mb-1">Minimal Data</h3>
                <p className="text-sm text-muted-foreground">We collect only what's necessary</p>
              </div>
              <div className="p-6 bg-background/50 rounded-2xl border border-foreground/5 backdrop-blur-sm transition-transform hover:-translate-y-1">
                <Shield className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-foreground mb-1">Secure Storage</h3>
                <p className="text-sm text-muted-foreground">Your data is protected</p>
              </div>
              <div className="p-6 bg-background/50 rounded-2xl border border-foreground/5 backdrop-blur-sm transition-transform hover:-translate-y-1">
                <Cookie className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-foreground mb-1">No Tracking</h3>
                <p className="text-sm text-muted-foreground">No unnecessary cookies</p>
              </div>
            </div>
          </motion.div>

          {/* Information We Collect */}
          <motion.div variants={itemVariants} className="p-8 md:p-10 rounded-[2rem] bg-secondary/20 backdrop-blur-md border border-foreground/5 shadow-xl">
            <h2 className="text-2xl font-display font-bold mb-8">Information We Collect</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-foreground/90">Information You Provide</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4 p-4 rounded-2xl bg-background/40 border border-foreground/5">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="w-2 h-2 bg-primary rounded-full" />
                    </div>
                    <div>
                      <strong className="block text-foreground mb-1">Contact Information</strong>
                      <span className="text-muted-foreground text-sm leading-relaxed">When you contact us through the contact form or email, we collect your name, email address, and message content.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4 p-4 rounded-2xl bg-background/40 border border-foreground/5">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="w-2 h-2 bg-primary rounded-full" />
                    </div>
                    <div>
                      <strong className="block text-foreground mb-1">Communication</strong>
                      <span className="text-muted-foreground text-sm leading-relaxed">Any additional information you choose to share in your communications with us.</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent my-8" />

              <div>
                <h3 className="text-xl font-semibold mb-4 text-foreground/90">Automatically Collected Information</h3>
                <ul className="space-y-4">
                  {[
                    { title: "Usage Data", desc: "Basic analytics about how you interact with our website (pages visited, time spent, referring sites)." },
                    { title: "Device Information", desc: "Browser type, operating system, and device type for optimization purposes." },
                    { title: "IP Address", desc: "For security and analytics purposes, collected automatically by our hosting provider." }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-background/40 border border-foreground/5">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                      </div>
                      <div>
                        <strong className="block text-foreground mb-1">{item.title}</strong>
                        <span className="text-muted-foreground text-sm leading-relaxed">{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* How We Use Information */}
          <motion.div variants={itemVariants} className="p-8 md:p-10 rounded-[2rem] bg-secondary/20 backdrop-blur-md border border-foreground/5 shadow-xl">
            <h2 className="text-2xl font-display font-bold mb-6">How We Use Your Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Communication", desc: "To respond to your inquiries and provide customer support." },
                { title: "Website Improvement", desc: "To analyze usage patterns and improve our website's functionality." },
                { title: "Security", desc: "To protect against fraud, abuse, and security issues." },
                { title: "Legal Compliance", desc: "To comply with applicable laws and regulations." }
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-2xl bg-background/50 border border-foreground/5 backdrop-blur-sm">
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants} className="p-8 md:p-10 rounded-[2rem] bg-primary/5 backdrop-blur-md border border-primary/10 shadow-xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
            <div className="relative z-10">
              <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-display font-bold mb-4">Questions About Privacy?</h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                If you have any questions about this Privacy Policy or wish to exercise your rights, please reach out.
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
