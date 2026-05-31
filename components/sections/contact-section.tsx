"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ContactSuccessModal } from "@/components/ui/contact-success-modal"
import { Mail, MapPin, Send, Github, Linkedin, ExternalLink, MessageCircle, Instagram, Facebook, Youtube, Globe, Palette, ArrowRight, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { motion, useMotionTemplate, useMotionValue } from "framer-motion"
import { cn } from "@/lib/utils"
import { AnimatedButton } from "@/components/ui/animated-button"
import { XIcon } from "@/components/ui/icons"

// Icon mapping for dynamic icon rendering
const iconMap = {
  Github,
  Linkedin,
  Mail,
  Twitter: XIcon,
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

      // Check for empty fields
      if (!data.name?.trim() || !data.email?.trim() || !data.subject?.trim() || !data.message?.trim()) {
        throw new Error('All fields are required')
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email)) {
        throw new Error('Please enter a valid email address')
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (response.ok) {
        // Store the sender's name for the modal
        setSenderName(data.name)
        // Show success modal instead of toast
        setShowSuccessModal(true)
          ; (e.target as HTMLFormElement).reset()
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
    <section id="contact" className="py-20 md:py-32 relative overflow-hidden bg-background">
      {/* Immersive Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="container max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-6 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary uppercase tracking-[0.2em]">
              Get in Touch
            </Badge>
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
              Contact <span className="text-gradient">Me</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Have a project in mind? I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
            </p>
          </motion.div>
        </div>

        {/* Clean Split-pane Layout */}
        <div className="relative rounded-3xl border border-border bg-card/50 backdrop-blur-xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-5">
          
          {/* Left Pane (Info & Socials) */}
          <div className="lg:col-span-2 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-border relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10 space-y-10">
              <div>
                <h3 className="text-2xl font-bold mb-2 text-foreground">Contact Information</h3>
                <p className="text-muted-foreground">Fill out the form and I will get back to you within 24 hours.</p>
              </div>

              <div className="space-y-6">
                {/* Clean Contact Card: Email */}
                <div className="flex items-center gap-5 p-4 rounded-2xl bg-background/50 border border-border transition-all hover:border-primary/50 hover:shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold mb-1">Email Me</p>
                    <a href={`mailto:${profileData?.email}`} className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                      {profileData?.email || 'loading...'}
                    </a>
                  </div>
                </div>

                {/* Clean Contact Card: Location */}
                <div className="flex items-center gap-5 p-4 rounded-2xl bg-background/50 border border-border transition-all hover:border-blue-500/50 hover:shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                    <MapPin className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold mb-1">Location</p>
                    <p className="text-lg font-medium text-foreground">
                      {profileData?.location || 'loading...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground font-semibold mb-6">Follow My Socials</p>
              <div className="flex flex-wrap gap-4">
                {socials.map((social, index) => {
                  const Icon = iconMap[social.icon]
                  return (
                    <motion.a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 shadow-sm"
                    >
                      <Icon className="w-5 h-5 transition-colors" />
                    </motion.a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Pane (Form) */}
          <div className="lg:col-span-3 p-8 md:p-12 relative z-10 bg-card">
            <h3 className="text-2xl font-bold mb-8 text-foreground">Send me a message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <Label htmlFor="name" className="text-muted-foreground group-focus-within:text-primary transition-colors">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Name"
                    required
                    disabled={isLoading}
                    className="bg-background border-border focus:border-primary h-14 pl-4 rounded-xl transition-all"
                  />
                </div>
                
                <div className="space-y-2 group">
                  <Label htmlFor="email" className="text-muted-foreground group-focus-within:text-primary transition-colors">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@domain.com"
                    required
                    disabled={isLoading}
                    className="bg-background border-border focus:border-primary h-14 pl-4 rounded-xl transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="subject" className="text-muted-foreground group-focus-within:text-primary transition-colors">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="Subject"
                  required
                  disabled={isLoading}
                  className="bg-background border-border focus:border-primary h-14 pl-4 rounded-xl transition-all"
                />
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="message" className="text-muted-foreground group-focus-within:text-primary transition-colors">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Message..."
                  required
                  disabled={isLoading}
                  className="bg-background border-border focus:border-primary p-4 rounded-xl resize-none transition-all"
                />
              </div>

              <AnimatedButton
                type="submit"
                variant="primary"
                className="w-full h-14 text-lg rounded-xl"
                disabled={isLoading}
                icon={isLoading ? null : <Send className="w-5 h-5" />}
              >
                {isLoading ? "Sending Message..." : "Send Message"}
              </AnimatedButton>
            </form>
          </div>
        </div>
      </div>

      <ContactSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        name={senderName}
      />
    </section>
  )
}
