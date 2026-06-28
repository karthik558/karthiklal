"use client"

import { useState } from "react"
import { Github, Globe, Instagram, Linkedin, Mail, MapPin, MessageCircle, Palette, Send, Facebook, Youtube } from "lucide-react"
import { motion } from "framer-motion"
import { AnimatedButton } from "@/components/ui/animated-button"
import { ContactSuccessModal } from "@/components/ui/contact-success-modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageHero, PageShell } from "@/components/ui/page-layout"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { XIcon } from "@/components/ui/icons"
import { PROFILE_DATA, SOCIALS_DATA } from "@/lib/static-data"

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
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [senderName, setSenderName] = useState("")
  const { toast } = useToast()

  const profileData: PersonalInfo = PROFILE_DATA.personalInfo
  const socials: Social[] = (SOCIALS_DATA.socials as Social[])
    .filter((social: Social) => social.active && social.name !== "Email")
    .sort((a: Social, b: Social) => a.priority - b.priority)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
      }

      if (!data.name?.trim() || !data.email?.trim() || !data.subject?.trim() || !data.message?.trim()) {
        throw new Error("All fields are required")
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email)) {
        throw new Error("Please enter a valid email address")
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || `Server error: ${response.status}`)
      }

      setSenderName(data.name)
      setShowSuccessModal(true)
      event.currentTarget.reset()
    } catch (error) {
      console.error("Error sending message:", error)

      toast({
        title: "Message not sent",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again later.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="Get in Touch"
        title="Let's"
        gradientText="Connect"
        description="Send a project brief, security question, collaboration idea, or consulting request. I usually respond within 24 hours."
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm lg:grid-cols-[0.85fr_1.15fr]"
      >
        <aside className="border-b border-border/70 bg-secondary/25 p-6 md:p-8 lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col justify-between gap-10">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Contact details</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Use the form for project details, or reach me directly through email and social channels.
              </p>

              <div className="mt-8 space-y-4">
                <a href={`mailto:${profileData?.email}`} className="group flex items-center gap-4 rounded-lg border border-border/70 bg-background/70 p-4 transition hover:border-primary/30 hover:bg-background">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                    <Mail className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-muted-foreground">Email</span>
                    <span className="block truncate font-semibold text-foreground">{profileData?.email || "loading..."}</span>
                  </span>
                </a>

                <div className="flex items-center gap-4 rounded-lg border border-border/70 bg-background/70 p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-muted-foreground">Location</span>
                    <span className="block font-semibold text-foreground">{profileData?.location || "loading..."}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-border/70 pt-6">
              <p className="mb-4 text-sm font-medium text-muted-foreground">Social links</p>
              <div className="flex flex-wrap gap-2">
                {socials.map((social, index) => {
                  const Icon = iconMap[social.icon as keyof typeof iconMap] || Globe

                  return (
                    <motion.a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.04 }}
                      className="flex h-10 w-10 items-center justify-center rounded-md border border-border/70 bg-background/70 text-muted-foreground transition hover:border-primary/30 hover:bg-primary hover:text-primary-foreground"
                    >
                      <Icon className="h-4 w-4" />
                    </motion.a>
                  )
                })}
              </div>
            </div>
          </div>
        </aside>

        <section className="p-6 md:p-8">
          <h2 className="text-2xl font-bold tracking-tight">Send a message</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">A few clear details help me respond with the right next step.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Your name" required disabled={isLoading} className="h-11 rounded-md bg-background" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="name@domain.com" required disabled={isLoading} className="h-11 rounded-md bg-background" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" placeholder="How can I help?" required disabled={isLoading} className="h-11 rounded-md bg-background" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" placeholder="Tell me about the work, timeline, goals, or problem..." rows={7} required disabled={isLoading} className="resize-none rounded-md bg-background" />
            </div>

            <AnimatedButton type="submit" variant="primary" className="h-12 w-full rounded-md" disabled={isLoading} icon={isLoading ? null : <Send className="h-5 w-5" />}>
              {isLoading ? "Sending Message..." : "Send Message"}
            </AnimatedButton>
          </form>
        </section>
      </motion.div>

      <ContactSuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} name={senderName} />
    </PageShell>
  )
}
