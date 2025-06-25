import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Shield, Eye, Cookie, Database, Mail, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Karthik Lal's portfolio website. Learn how we collect, use, and protect your personal information.",
  openGraph: {
    title: "Privacy Policy | Karthik Lal",
    description: "Privacy Policy for Karthik Lal's portfolio website. Learn how we collect, use, and protect your personal information.",
  },
}

export default function PrivacyPolicyPage() {
  const lastUpdated = "December 25, 2024"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary/5 border-b border-border pt-20">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Button variant="outline" size="sm" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              This Privacy Policy describes how we collect, use, and protect your information when you visit our website.
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Quick Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Quick Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Your privacy is important to us. This portfolio website is designed with privacy in mind. We collect minimal information and do not sell or share your personal data with third parties for marketing purposes.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <Database className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="font-medium">Minimal Data</p>
                  <p className="text-sm text-muted-foreground">We collect only what's necessary</p>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="font-medium">Secure Storage</p>
                  <p className="text-sm text-muted-foreground">Your data is protected</p>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <Cookie className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="font-medium">No Tracking</p>
                  <p className="text-sm text-muted-foreground">No unnecessary cookies</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Information You Provide</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Contact Information:</strong> When you contact us through the contact form or email, we collect your name, email address, and message content.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Communication:</strong> Any additional information you choose to share in your communications with us.</span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Automatically Collected Information</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Usage Data:</strong> Basic analytics about how you interact with our website (pages visited, time spent, referring sites).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span><strong>Device Information:</strong> Browser type, operating system, and device type for optimization purposes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span><strong>IP Address:</strong> For security and analytics purposes, collected automatically by our hosting provider.</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span><strong>Communication:</strong> To respond to your inquiries and provide customer support.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span><strong>Website Improvement:</strong> To analyze usage patterns and improve our website's functionality and user experience.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span><strong>Security:</strong> To protect against fraud, abuse, and security issues.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span><strong>Legal Compliance:</strong> To comply with applicable laws and regulations.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Cookies and Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="h-5 w-5 text-primary" />
                Cookies and Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We use minimal cookies and tracking technologies to enhance your browsing experience:
              </p>
              <div className="space-y-3">
                <div className="p-4 bg-secondary/5 rounded-lg">
                  <h4 className="font-medium mb-2">Essential Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Necessary for basic website functionality, such as theme preferences and security features.
                  </p>
                </div>
                <div className="p-4 bg-secondary/5 rounded-lg">
                  <h4 className="font-medium mb-2">Analytics Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Help us understand how visitors interact with our website to improve user experience. These are anonymized and aggregated.
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                You can control cookie preferences through your browser settings. Disabling certain cookies may affect website functionality.
              </p>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We implement appropriate security measures to protect your personal information:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>SSL encryption for all data transmission</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Secure hosting infrastructure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Regular security updates and monitoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Limited access to personal data</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You have the following rights regarding your personal information:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Access & Portability</h4>
                  <p className="text-sm text-muted-foreground">Request a copy of your personal data</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Correction</h4>
                  <p className="text-sm text-muted-foreground">Update or correct your information</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Deletion</h4>
                  <p className="text-sm text-muted-foreground">Request removal of your data</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Objection</h4>
                  <p className="text-sm text-muted-foreground">Opt-out of certain data processing</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> <a href="mailto:dev@karthiklal.in" className="text-primary hover:underline">dev@karthiklal.in</a></p>
                <p><strong>Website:</strong> <a href="https://karthiklal.in" className="text-primary hover:underline">https://karthiklal.in</a></p>
              </div>
            </CardContent>
          </Card>

          {/* Updates */}
          <Card>
            <CardHeader>
              <CardTitle>Policy Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Changes become effective immediately upon posting.
              </p>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
