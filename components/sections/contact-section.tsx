"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Send, Github, Linkedin, ExternalLink, MessageCircle, Twitter, Instagram, Facebook, Youtube, Globe, Palette } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useState, useRef, useEffect } from "react"
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

export default function ContactSection() {
  const [isLoading, setIsLoading] = useState(false)
  const [socials, setSocials] = useState<Social[]>([])
  const { toast } = useToast()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  useEffect(() => {
    // Load socials from JSON
    fetch('/data/socials.json')
      .then(res => res.json())
      .then(data => {
        // Filter active socials (excluding email) and sort by priority
        const activeSocials = data.socials
          .filter((social: Social) => social.active && social.name !== 'Email')
          .sort((a: Social, b: Social) => a.priority - b.priority)
        setSocials(activeSocials)
      })
      .catch(error => {
        console.error('Failed to load socials:', error)
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast({
      title: "Message sent!",
      description: "Thank you for your message. I'll get back to you soon.",
    })
    
    setIsLoading(false)
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <section id="contact" className="relative py-20 md:py-32 bg-secondary/5 overflow-hidden">
      {/* Enhanced background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Main gradient orbs */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-gradient-to-bl from-orange-500/10 to-accent/5 rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-to-r from-primary/5 to-transparent rounded-full blur-2xl opacity-30" />
        
        {/* Additional floating elements */}
        <div className="absolute top-16 right-16 w-32 h-32 bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-xl opacity-50" />
        <div className="absolute top-32 left-16 w-24 h-24 bg-gradient-to-br from-orange-500/8 to-transparent rounded-full blur-lg opacity-40" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="h-full w-full bg-[linear-gradient(to_right,_hsl(var(--border))_1px,_transparent_1px),linear-gradient(to_bottom,_hsl(var(--border))_1px,_transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
        
        {/* Animated floating dots */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute top-16 left-8 w-2 h-2 bg-primary/30 rounded-full"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 0.8 }}
          className="absolute top-32 right-32 w-1 h-1 bg-primary/40 rounded-full"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 1.1 }}
          className="absolute top-24 left-2/3 w-1.5 h-1.5 bg-primary/20 rounded-full"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 1.4 }}
          className="absolute top-8 right-1/3 w-1 h-1 bg-orange-500/30 rounded-full"
        ></motion.div>
      </div>
      
      <div className="container max-w-6xl mx-auto relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          {/* Enhanced badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Mail className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Get In Touch</span>
            </div>
          </motion.div>
          
          {/* Enhanced heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-item"
          >
            Let's <span className="text-gradient">Connect</span>
          </motion.h2>
          
          {/* Enhanced description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-item mb-8"
          >
            Have a project in mind or want to collaborate? I'd love to hear from you and discuss how we can work together to bring your ideas to life.
          </motion.p>
          
          {/* Status indicators */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center gap-8 mb-4"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Available for new projects</span>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
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
                <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Email Address</h4>
                        <a 
                          href="mailto:dev@karthiklal.in" 
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          dev@karthiklal.in
                        </a>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Location</h4>
                        <p className="text-sm text-muted-foreground">Lakshadweep, India</p>
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
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
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
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
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
                    <motion.span
                      className="flex items-center gap-2"
                      animate={isLoading ? { opacity: [1, 0.5, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      {isLoading ? "Sending Message..." : "Send Message"}
                      <Send className="h-4 w-4" />
                    </motion.span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

