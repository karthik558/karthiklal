import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Cookie, Settings, Eye, BarChart, Shield, Mail, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookie Policy for Karthik Lal's portfolio website. Learn about the cookies we use and how to manage your preferences.",
  openGraph: {
    title: "Cookie Policy | Karthik Lal",
    description: "Cookie Policy for Karthik Lal's portfolio website. Learn about the cookies we use and how to manage your preferences.",
  },
}

export default function CookiePolicyPage() {
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
              <Cookie className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold">Cookie Policy</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              This Cookie Policy explains how we use cookies and similar technologies on our website to enhance your browsing experience.
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
          
          {/* What Are Cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="h-5 w-5 text-primary" />
                What Are Cookies?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit our website. They help us provide you with a better browsing experience by remembering your preferences and understanding how you use our site.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-medium mb-2">First-Party Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Set directly by our website to remember your preferences and improve functionality.
                  </p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-medium mb-2">Session vs Persistent</h4>
                  <p className="text-sm text-muted-foreground">
                    Session cookies expire when you close your browser, while persistent cookies remain for a set period.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Types of Cookies We Use */}
          <Card>
            <CardHeader>
              <CardTitle>Types of Cookies We Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Essential Cookies */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <h3 className="text-lg font-semibold">Essential Cookies</h3>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-200">Required</Badge>
                </div>
                <p className="text-muted-foreground mb-3">
                  These cookies are necessary for the website to function properly and cannot be disabled.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Theme Preference</span>
                    <span className="text-muted-foreground">Remembers your dark/light mode choice</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Security</span>
                    <span className="text-muted-foreground">Protects against CSRF attacks</span>
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-semibold">Analytics Cookies</h3>
                  </div>
                  <Badge variant="outline" className="text-blue-600 border-blue-200">Optional</Badge>
                </div>
                <p className="text-muted-foreground mb-3">
                  Help us understand how visitors interact with our website by collecting anonymous information.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Page Views</span>
                    <span className="text-muted-foreground">Track which pages are visited</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Session Duration</span>
                    <span className="text-muted-foreground">Measure time spent on site</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Traffic Sources</span>
                    <span className="text-muted-foreground">Understand how users find our site</span>
                  </div>
                </div>
              </div>

              {/* Performance Cookies */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-purple-500" />
                    <h3 className="text-lg font-semibold">Performance Cookies</h3>
                  </div>
                  <Badge variant="outline" className="text-purple-600 border-purple-200">Optional</Badge>
                </div>
                <p className="text-muted-foreground mb-3">
                  Allow us to optimize website performance and loading times.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Load Time</span>
                    <span className="text-muted-foreground">Monitor page loading performance</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Error Tracking</span>
                    <span className="text-muted-foreground">Identify and fix technical issues</span>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Cookie Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Managing Your Cookie Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                You have several options to control and manage cookies:
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-secondary/5 rounded-lg">
                  <h4 className="font-medium mb-2">Browser Settings</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Most browsers allow you to control cookies through their settings. You can usually find these options in the "Privacy" or "Security" sections.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Chrome</a>
                    <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Firefox</a>
                    <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Safari</a>
                    <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Edge</a>
                  </div>
                </div>

                <div className="p-4 bg-secondary/5 rounded-lg">
                  <h4 className="font-medium mb-2">What Happens When You Disable Cookies?</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
                      <span>Your theme preference won't be remembered</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
                      <span>We won't be able to analyze website usage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
                      <span>Some features may not work as expected</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Eye className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Do Not Track</h4>
                    <p className="text-sm text-muted-foreground">
                      We respect the "Do Not Track" browser setting. When enabled, we will not use analytics or performance cookies.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Services */}
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We may use third-party services that set their own cookies. These services have their own privacy policies:
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg">
                  <div>
                    <p className="font-medium">Google Analytics</p>
                    <p className="text-sm text-muted-foreground">Website analytics and performance monitoring</p>
                  </div>
                  <a 
                    href="https://policies.google.com/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    Privacy Policy
                  </a>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg">
                  <div>
                    <p className="font-medium">Vercel Analytics</p>
                    <p className="text-sm text-muted-foreground">Hosting platform analytics</p>
                  </div>
                  <a 
                    href="https://vercel.com/legal/privacy-policy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    Privacy Policy
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Updates to This Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Updates to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last updated" date.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Questions About Cookies?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> <a href="mailto:dev@karthiklal.in" className="text-primary hover:underline">dev@karthiklal.in</a></p>
                <p><strong>Website:</strong> <a href="https://karthiklal.in" className="text-primary hover:underline">https://karthiklal.in</a></p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
