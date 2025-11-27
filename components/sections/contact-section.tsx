"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ContactSuccessModal } from "@/components/ui/contact-success-modal"
import { Mail, MapPin, Send, Github, Linkedin, ExternalLink, MessageCircle, Instagram, Facebook, Youtube, Globe, Palette, ArrowRight, Sparkles } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useToast } from "@/components/ui/use-toast"
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion"
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
    <section id="contact" className="py-20 md:py-32 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/20 bg-primary/5 text-primary rounded-full text-sm font-medium">
              Get in Touch
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              Let's Work <span className="text-gradient">Together</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Have a project in mind? I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Contact Info Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-10"
          >
            <div className="relative">
              <h3 className="text-3xl font-bold mb-4">Contact Information</h3>
              <p className="text-muted-foreground text-lg">
                Fill out the form and I will get back to you within 24 hours.
              </p>
            </div>

            <div className="space-y-6">
              <SpotlightCard>
                <div className="p-6 flex items-start gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Chat to me</h4>
                    <p className="text-muted-foreground mb-3">I am here to help.</p>
                    <a href={`mailto:${profileData?.email}`} className="text-primary font-medium hover:underline">
                      {profileData?.email || 'loading...'}
                    </a>
                  </div>
                </div>
              </SpotlightCard>

              <SpotlightCard>
                <div className="p-6 flex items-start gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Location</h4>
                    <p className="text-muted-foreground mb-3">Currently based in.</p>
                    <p className="text-primary font-medium">
                      {profileData?.location || 'loading...'}
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            </div>

            <div className="pt-8 border-t border-white/10">
              <h4 className="text-lg font-semibold mb-6">Follow my socials</h4>
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
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
              <CardContent className="p-8 md:p-10 relative">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Name"
                        required
                        disabled={isLoading}
                        className="bg-white/5 border-white/10 focus:border-primary/50 h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        required
                        disabled={isLoading}
                        className="bg-white/5 border-white/10 focus:border-primary/50 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Project Inquiry"
                      required
                      disabled={isLoading}
                      className="bg-white/5 border-white/10 focus:border-primary/50 h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={6}
                      placeholder="Tell me about your project..."
                      required
                      disabled={isLoading}
                      className="bg-white/5 border-white/10 focus:border-primary/50 resize-none"
                    />
                  </div>

                  <AnimatedButton
                    type="submit"
                    variant="primary"
                    className="w-full h-14 text-lg"
                    disabled={isLoading}
                    icon={isLoading ? null : <Send className="w-5 h-5" />}
                  >
                    {isLoading ? "Sending..." : "Send Message"}
                  </AnimatedButton>
                </form>
              </CardContent>
            </Card>
          </motion.div>
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

function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={cn(
        "group relative border border-white/10 bg-white/5 overflow-hidden rounded-xl",
        className
      )}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(116, 38, 26, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

