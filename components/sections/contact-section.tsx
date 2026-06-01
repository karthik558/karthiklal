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
import { PROFILE_DATA, SOCIALS_DATA } from "@/lib/static-data"

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
  const profileData: PersonalInfo = PROFILE_DATA.personalInfo
  const socials: Social[] = (SOCIALS_DATA.socials as Social[])
    .filter((social: Social) => social.active && social.name !== 'Email')
    .sort((a: Social, b: Social) => a.priority - b.priority)
  
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [senderName, setSenderName] = useState('')
  const { toast } = useToast()

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
    <div className="min-h-screen pt-24 pb-32 relative overflow-hidden bg-background selection:bg-primary/30">
      {/* Immersive Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-primary/5 via-background to-background" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="container max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 pt-8 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <Badge variant="outline" className="mb-6 px-4 py-1.5 rounded-full bg-primary/5 border-primary/20 text-primary text-xs font-semibold tracking-[0.2em] uppercase">
              Get in Touch
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight">
              Contact <span className="text-gradient">Me</span>
            </h1>
          </motion.div>
        </div>

        {/* Clean Split-pane Layout */}
        <div className="relative rounded-[2rem] border border-foreground/5 bg-secondary/20 backdrop-blur-xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-5">
          
          {/* Left Pane (Info & Socials) */}
          <div className="lg:col-span-2 p-8 md:p-12 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
            
            <div className="relative z-10 space-y-10">
              <div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Contact Information</h3>
                <p className="text-muted-foreground leading-relaxed">Fill out the form and I will get back to you within 24 hours.</p>
              </div>

              <div className="space-y-4">
                {/* Clean Contact Card: Email */}
                <div className="flex items-center gap-5 p-5 rounded-2xl bg-background/40 border border-foreground/5 transition-all hover:border-primary/30 group">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Mail className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-semibold mb-1">Email Me</p>
                    <a href={`mailto:${profileData?.email}`} className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                      {profileData?.email || 'loading...'}
                    </a>
                  </div>
                </div>

                {/* Clean Contact Card: Location */}
                <div className="flex items-center gap-5 p-5 rounded-2xl bg-background/40 border border-foreground/5 transition-all hover:border-blue-500/30 group">
                  <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <MapPin className="w-6 h-6 text-blue-500 group-hover:text-white transition-colors" />
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

            <div className="relative z-10 mt-12 pt-8 border-t border-foreground/5">
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
                      className="w-12 h-12 rounded-full bg-background/50 border border-foreground/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 shadow-sm backdrop-blur-sm"
                    >
                      <Icon className="w-5 h-5 transition-colors" />
                    </motion.a>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Pane (Form) */}
          <div className="lg:col-span-3 p-8 md:p-12 relative z-10 bg-background/50 backdrop-blur-md">
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
                    className="bg-background/80 border-foreground/5 focus:border-primary/50 h-14 pl-4 rounded-xl transition-all shadow-sm"
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
                    className="bg-background/80 border-foreground/5 focus:border-primary/50 h-14 pl-4 rounded-xl transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="subject" className="text-muted-foreground group-focus-within:text-primary transition-colors">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="How can I help you?"
                  required
                  disabled={isLoading}
                  className="bg-background/80 border-foreground/5 focus:border-primary/50 h-14 pl-4 rounded-xl transition-all shadow-sm"
                />
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="message" className="text-muted-foreground group-focus-within:text-primary transition-colors">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell me about your project..."
                  rows={6}
                  required
                  disabled={isLoading}
                  className="bg-background/80 border-foreground/5 focus:border-primary/50 p-4 rounded-xl resize-none transition-all shadow-sm"
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
    </div>
  )
}
