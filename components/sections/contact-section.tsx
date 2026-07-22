"use client"

import { useState } from "react"
import { Github, Linkedin, Mail, MapPin, Send, Check, Copy, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import { AnimatedButton } from "@/components/ui/animated-button"
import { ContactSuccessModal } from "@/components/ui/contact-success-modal"
import { useToast } from "@/components/ui/use-toast"
import { PROFILE_DATA } from "@/lib/static-data"

export default function ContactSection() {
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [senderName, setSenderName] = useState("")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const email = PROFILE_DATA.personalInfo.email || "dev@karthiklal.in"

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const form = event.currentTarget
      const formData = new FormData(form)
      const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
      }

      if (!data.name?.trim() || !data.email?.trim() || !data.subject?.trim() || !data.message?.trim()) {
        throw new Error("All fields are required")
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()
      if (!response.ok) throw new Error(responseData.error || "Failed to submit message")

      setSenderName(data.name)
      setShowSuccessModal(true)
      form.reset()
    } catch (error) {
      toast({
        title: "Message not sent",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-28 border-t border-border">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        
        {/* Page Hero Header */}
        <div className="mb-14 border-b border-border pb-10">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            COMMUNICATION CHANNEL // 09
          </div>
          <h1 className="font-display text-5xl font-black uppercase tracking-tight text-foreground sm:text-7xl md:text-8xl">
            GET IN TOUCH
          </h1>
          <p className="mt-4 max-w-2xl font-sans text-base md:text-lg text-muted-foreground font-light leading-relaxed">
            Have an IT project, security vulnerability assessment, or full-stack web build inquiry? Submit a message below or email directly.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5 border-2 border-foreground bg-card p-8 space-y-8 flex flex-col justify-between font-mono text-xs">
            <div>
              <div className="font-bold uppercase tracking-widest text-muted-foreground mb-6">
                DIRECT CHANNELS
              </div>

              <div className="space-y-4">
                <div className="p-4 border border-border bg-background space-y-2">
                  <div className="text-muted-foreground uppercase">EMAIL ADDRESS</div>
                  <div className="font-bold text-foreground text-sm uppercase">{email}</div>
                  <button
                    onClick={copyEmail}
                    className="inline-flex items-center gap-1.5 pt-2 text-foreground hover:underline font-bold uppercase"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "COPIED TO CLIPBOARD" : "COPY EMAIL"}</span>
                  </button>
                </div>

                <div className="p-4 border border-border bg-background space-y-2">
                  <div className="text-muted-foreground uppercase">LOCATION & TIMEZONE</div>
                  <div className="font-bold text-foreground text-sm uppercase">KERALA, INDIA // IST (UTC+5:30)</div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-border">
              <div className="font-bold uppercase tracking-widest text-muted-foreground">
                SOCIAL PROFILES
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "GITHUB", href: "https://github.com/karthik558" },
                  { name: "LINKEDIN", href: "https://linkedin.com/in/karthiklal" },
                  { name: "X / TWITTER", href: "https://x.com/_karthiklal" },
                ].map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 border border-border bg-background text-foreground hover:border-foreground uppercase font-bold text-[10px]"
                  >
                    {s.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 border-2 border-border bg-card p-8 md:p-10">
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6">
              SEND MESSAGE FORM
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block uppercase tracking-wider text-muted-foreground mb-2">YOUR NAME *</label>
                  <input
                    name="name"
                    required
                    type="text"
                    placeholder="ENTER YOUR FULL NAME"
                    className="w-full bg-background border-2 border-border p-3.5 text-foreground uppercase focus:outline-none focus:border-foreground"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-muted-foreground mb-2">YOUR EMAIL *</label>
                  <input
                    name="email"
                    required
                    type="email"
                    placeholder="ENTER YOUR EMAIL ADDRESS"
                    className="w-full bg-background border-2 border-border p-3.5 text-foreground uppercase focus:outline-none focus:border-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-muted-foreground mb-2">SUBJECT / PROJECT TYPE *</label>
                <input
                  name="subject"
                  required
                  type="text"
                  placeholder="ENTER SUBJECT OR PROJECT TYPE"
                  className="w-full bg-background border-2 border-border p-3.5 text-foreground uppercase focus:outline-none focus:border-foreground"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-muted-foreground mb-2">MESSAGE DETAILS *</label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  placeholder="ENTER YOUR MESSAGE DETAILS AND TECHNICAL REQUIREMENTS..."
                  className="w-full bg-background border-2 border-border p-3.5 text-foreground uppercase focus:outline-none focus:border-foreground"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-foreground text-background font-mono text-xs font-bold uppercase tracking-wider border-2 border-foreground hover:bg-background hover:text-foreground transition-all duration-300 flex items-center justify-center gap-2 select-none cursor-pointer"
              >
                {isLoading ? "TRANSMITTING MESSAGE..." : "TRANSMIT MESSAGE"} <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <ContactSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          name={senderName}
        />
      </div>
    </main>
  )
}

