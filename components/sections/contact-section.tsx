"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ContactSuccessModal } from "@/components/ui/contact-success-modal"
import { Mail, MapPin, Send, Github, Linkedin, ExternalLink, MessageCircle, Twitter, Instagram, Facebook, Youtube, Globe, Palette } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

// Icon mapping for dynamic icon rendering
const iconMap = {
  Github,
  Linkedin,
  Mail,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  Globe,
  Palette,
}

interface Social {
  id: number
  name: string
  icon: keyof typeof iconMap
  url: string
  username: string
  active: boolean
  priority: number
}

interface PersonalInfo {
  email: string
  location: string
}

interface ProfileData {
  personalInfo: PersonalInfo
}

export default function ContactSection() {
  const [isLoading, setIsLoading] = useState(false)
  const [socials, setSocials] = useState<Social[]>([])
  const [profileData, setProfileData] = useState<PersonalInfo | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [senderName, setSenderName] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    // Load socials and profile data from JSON
    Promise.all([
      fetch('/data/socials.json').then(res => res.json()),
      fetch('/data/profile.json').then(res => res.json())
    ])
      .then(([socialsData, profileData]) => {
        // Filter active socials (excluding email) and sort by priority
        const activeSocials = socialsData.socials
          .filter((social: Social) => social.active && social.name !== 'Email')
          .sort((a: Social, b: Social) => a.priority - b.priority)
        setSocials(activeSocials)
        setProfileData(profileData.personalInfo)
      })
      .catch(error => {
        console.error('Failed to fetch data:', error)
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        subject: formData.get('subject') as string,
        message: formData.get('message') as string,
      }

      // Validate data before sending
      console.log('Form data:', data)
      
      // Check for empty fields
      if (!data.name?.trim() || !data.email?.trim() || !data.subject?.trim() || !data.message?.trim()) {
        throw new Error('All fields are required')
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email)) {
        throw new Error('Please enter a valid email address')
      }

      console.log('Sending request to /api/contact...')
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      console.log('Response status:', response.status)
      const responseData = await response.json()
      console.log('Response data:', responseData)

      if (response.ok) {
        // Store the sender's name for the modal
        setSenderName(data.name)
        // Show success modal instead of toast
        setShowSuccessModal(true)
        ;(e.target as HTMLFormElement).reset()
      } else {
        throw new Error(responseData.error || `Server error: ${response.status}`)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      
      let errorMessage = 'Failed to send message. Please try again later.'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      toast({
        title: "😔 Oops! Something went wrong",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="contact" className="py-20 md:py-32">
      {/* Simple background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/20"></div>
      
      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          {/* Clean heading */}
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Let's <span className="text-gradient">Connect</span>
          </h2>
          
          {/* Simple description */}
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Have a project in mind or want to collaborate? I'd love to hear from you and discuss how we can work together to bring your ideas to life.
          </p>
          
          {/* Status indicator */}
          <div className="flex items-center justify-center gap-8 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Available for new projects</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <MessageCircle className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Let's Talk</h3>
                  <p className="text-sm text-muted-foreground">Ready to bring your ideas to life</p>
                </div>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                <Card className="hover:shadow-md transition-shadow border-l-4 border-l-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Email Address</h4>
                        <a 
                          href={`mailto:${profileData?.email || 'contact@karthiklal.in'}`} 
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {profileData?.email || 'Loading...'}
                        </a>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow border-l-4 border-l-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Location</h4>
                        <p className="text-sm text-muted-foreground">{profileData?.location || 'Loading...'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold">Connect With Me</h4>
              
              {/* Social usernames display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      {(() => {
                        const IconComponent = iconMap[social.icon]
                        return <IconComponent className="h-4 w-4 text-primary" />
                      })()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{social.name}</p>
                      <p className="text-xs text-muted-foreground">{social.username}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="border border-border shadow-lg">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">Send Me a Message</h3>
                  <p className="text-sm text-muted-foreground">
                    Fill out the form below and I'll get back to you as soon as possible.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your full name"
                        required
                        disabled={isLoading}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        required
                        disabled={isLoading}
                        className="h-11"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-medium">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="What's this about?"
                      required
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Tell me about your project or how I can help you..."
                      required
                      disabled={isLoading}
                      className="resize-none"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 rounded-xl"
                    disabled={isLoading}
                  >
                    <span className="flex items-center gap-2">
                      {isLoading ? "Sending Message..." : "Send Message"}
                      <Send className="h-4 w-4" />
                    </span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <ContactSuccessModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        name={senderName}
      />
    </section>
  )
}

