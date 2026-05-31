"use client"

import Link from "next/link"
import { ArrowLeft, FileText, Scale, Shield, AlertTriangle, Mail, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export default function TermsPage() {
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
            <Scale className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight">
              Terms of <span className="text-gradient">Service</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light leading-relaxed mb-6">
            Please read these Terms of Service carefully before using our website. By accessing or using our service, you agree to be bound by these terms.
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
          {/* Acceptance of Terms */}
          <motion.div variants={itemVariants} className="p-8 md:p-10 rounded-[2rem] bg-secondary/20 backdrop-blur-md border border-foreground/5 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-700" />
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3 relative z-10">
              <FileText className="h-6 w-6 text-primary" />
              Acceptance of Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg font-light relative z-10">
              By accessing and using this website (karthiklal.in), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </motion.div>

          {/* Use License */}
          <motion.div variants={itemVariants} className="p-8 md:p-10 rounded-[2rem] bg-secondary/20 backdrop-blur-md border border-foreground/5 shadow-xl">
            <h2 className="text-2xl font-display font-bold mb-6">Use License</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Permission is granted to temporarily download one copy of the materials on Karthik Lal's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "Modify or copy the materials",
                "Use the materials for any commercial purpose or for any public display (commercial or non-commercial)",
                "Attempt to decompile or reverse engineer any software contained on the website",
                "Remove any copyright or other proprietary notations from the materials"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-background/40 border border-foreground/5">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground leading-relaxed p-4 rounded-xl bg-primary/5 border border-primary/10">
              This license shall automatically terminate if you violate any of these restrictions and may be terminated by Karthik Lal at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
            </p>
          </motion.div>

          {/* Disclaimer & Limitations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Disclaimer */}
            <motion.div variants={itemVariants} className="p-8 rounded-[2rem] bg-secondary/20 backdrop-blur-md border border-foreground/5 shadow-xl">
              <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Disclaimer
              </h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>The materials on Karthik Lal's website are provided on an 'as is' basis. Karthik Lal makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                <p>Further, Karthik Lal does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.</p>
              </div>
            </motion.div>

            {/* Limitations */}
            <motion.div variants={itemVariants} className="p-8 rounded-[2rem] bg-secondary/20 backdrop-blur-md border border-foreground/5 shadow-xl">
              <h2 className="text-xl font-display font-bold mb-4">Limitations</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                In no event shall Karthik Lal or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Karthik Lal's website, even if Karthik Lal or a Karthik Lal authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
              </p>
            </motion.div>
          </div>

          {/* Additional Terms */}
          <motion.div variants={itemVariants} className="p-8 md:p-10 rounded-[2rem] bg-secondary/20 backdrop-blur-md border border-foreground/5 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-3 text-foreground">Accuracy of Materials</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The materials appearing on Karthik Lal's website could include technical, typographical, or photographic errors. Karthik Lal does not warrant that any of the materials on its website are accurate, complete, or current. Karthik Lal may make changes to the materials contained on its website at any time without notice. However, Karthik Lal does not make any commitment to update the materials.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-3 text-foreground">Links</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Karthik Lal has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Karthik Lal of the site. Use of any such linked website is at the user's own risk.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-3 text-foreground">Modifications</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Karthik Lal may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-3 text-foreground">Governing Law</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Prohibited Uses */}
          <motion.div variants={itemVariants} className="p-8 md:p-10 rounded-[2rem] bg-secondary/20 backdrop-blur-md border border-foreground/5 shadow-xl">
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              Prohibited Uses
            </h2>
            <p className="text-muted-foreground mb-6">You may not use our website:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "For any unlawful purpose or to solicit others to unlawful acts",
                "To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances",
                "To infringe upon or violate our intellectual property rights or the intellectual property rights of others",
                "To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate",
                "To submit false or misleading information",
                "To upload or transmit viruses or any other type of malicious code"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-background/40 border border-foreground/5 hover:border-primary/20 transition-colors">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants} className="p-8 md:p-10 rounded-[2rem] bg-primary/5 backdrop-blur-md border border-primary/10 shadow-xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
            <div className="relative z-10">
              <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-display font-bold mb-4">Questions About Terms?</h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                If you have any questions about these Terms of Service, please contact us.
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
