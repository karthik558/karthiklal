"use client"

import { useState, useRef } from "react"
import dynamic from "next/dynamic"
import { Send, Check, Copy } from "lucide-react"
import { toast } from "sonner"
import { PROFILE_DATA, PUBLIC_SOCIAL_LINKS } from "@/lib/static-data"

const SUGGESTED_TOPICS = [
  "Security audit",
  "Web development",
  "IT consulting",
  "Infrastructure and cloud",
  "Design and branding",
  "General inquiry",
] as const

const ContactSuccessModal = dynamic(
  () => import("@/components/ui/contact-success-modal").then((mod) => mod.ContactSuccessModal),
  { ssr: false },
)

export default function ContactSection() {
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [senderName, setSenderName] = useState("")
  const [copied, setCopied] = useState(false)
  const [subject, setSubject] = useState("")
  const [subjectError, setSubjectError] = useState(false)
  const [messageLength, setMessageLength] = useState(0)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const subjectInputRef = useRef<HTMLInputElement>(null)
  const messageInputRef = useRef<HTMLTextAreaElement>(null)

  const email = PROFILE_DATA.personalInfo.email || "contact@karthiklal.in"

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const name = (formData.get("name") as string)?.trim() || ""
    const emailValue = (formData.get("email") as string)?.trim() || ""
    const subjectValue = (formData.get("subject") as string)?.trim() || subject.trim()
    const message = (formData.get("message") as string)?.trim() || ""
    const website = (formData.get("website") as string) || ""

    if (name.length < 2) {
      nameInputRef.current?.focus()
      toast.error("Name is required", {
        description: "Please enter your full name (minimum 2 characters).",
      })
      return
    }

    if (!emailValue || !emailValue.includes("@")) {
      emailInputRef.current?.focus()
      toast.error("Valid email is required", {
        description: "Please enter a valid email address.",
      })
      return
    }

    if (subjectValue.length < 2) {
      setSubjectError(true)
      subjectInputRef.current?.focus()
      toast.error("Subject is required", {
        description: "Please enter or select a subject for your message.",
      })
      return
    }

    if (message.length < 10) {
      messageInputRef.current?.focus()
      toast.error("Message is too short", {
        description: "Please provide at least 10 characters describing your inquiry.",
      })
      return
    }

    setIsLoading(true)
    setSubjectError(false)

    try {
      const data = {
        name,
        email: emailValue,
        subject: subjectValue,
        message,
        website,
      }

      const controller = new AbortController()
      const timeout = window.setTimeout(() => controller.abort(), 15_000)
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      }).finally(() => window.clearTimeout(timeout))

      const responseData = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(responseData.error || "Failed to submit message")
      }

      setSenderName(name)
      setShowSuccessModal(true)
      setSubject("")
      setMessageLength(0)
      setSubjectError(false)
      form.reset()
    } catch (error) {
      toast.error("Message not sent", {
        description: error instanceof DOMException && error.name === "AbortError"
          ? "The request timed out. Please try again."
          : error instanceof Error
            ? error.message
            : "Failed to send message. Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-28 border-t border-border">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        
        {/* Page Hero Header */}
        <div className="mb-14 border-b border-border pb-10">
          <div className="mb-3">
            <span className="paper-stamp">
              COMMUNICATION DISPATCH // 09
            </span>
          </div>
          <h1 className="font-display text-5xl font-black uppercase tracking-tight text-foreground sm:text-7xl md:text-8xl">
            GET IN TOUCH
          </h1>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Info Column */}
          <div className="paper-sheet group relative lg:col-span-5 flex flex-col justify-between border-2 border-border/80 bg-card p-8 space-y-8 font-mono text-xs transition-all duration-300 hover:border-foreground/80 hover:shadow-xl overflow-hidden">
            {/* Background Giant Stroke Number Watermark */}
            <div className="absolute right-2 -bottom-2 pointer-events-none select-none overflow-hidden opacity-[0.05] dark:opacity-[0.09] z-0 transition-opacity duration-300 group-hover:opacity-20">
              <span
                className="font-display text-8xl font-black uppercase tracking-tighter text-transparent leading-none block"
                style={{
                  WebkitTextStroke: "2.5px hsl(var(--foreground))",
                  WebkitTextFillColor: "transparent",
                }}
              >
                10
              </span>
            </div>

            <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
              <div>
                <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-6">
                  <span className="paper-tag">DIRECT CHANNELS</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">DISPATCH</span>
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
                  {PUBLIC_SOCIAL_LINKS.map((s) => (
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
          </div>

          {/* Right Form Column - Tactile Paper Memo */}
          <div className="paper-sheet paper-folded-corner group relative lg:col-span-7 border-2 border-border/80 bg-card p-8 md:p-10 transition-all duration-300 hover:border-foreground/80 hover:shadow-xl overflow-hidden">
            {/* Background Giant Stroke Watermark */}
            <div className="absolute right-2 -bottom-2 pointer-events-none select-none overflow-hidden opacity-[0.05] dark:opacity-[0.09] z-0 transition-opacity duration-300 group-hover:opacity-20">
              <span
                className="font-display text-8xl font-black uppercase tracking-tighter text-transparent leading-none block"
                style={{
                  WebkitTextStroke: "2.5px hsl(var(--foreground))",
                  WebkitTextFillColor: "transparent",
                }}
              >
                MEMO
              </span>
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-6">
                <span className="paper-tag">TRANSMISSION MEMO</span>
                <span className="paper-tag font-bold">REGISTERED DISPATCH // IST</span>
              </div>

              <form
                onSubmit={handleSubmit}
                onReset={() => {
                  setSubject("")
                  setSubjectError(false)
                  setMessageLength(0)
                }}
                className="space-y-6 font-mono text-xs"
              >
              <div className="opacity-0 absolute -z-50 pointer-events-none select-none h-0 w-0 overflow-hidden" aria-hidden="true" tabIndex={-1}>
                <label htmlFor="website">Website</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="new-password" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-name" className="block uppercase tracking-wider text-muted-foreground mb-2 font-mono text-xs">YOUR NAME *</label>
                  <input
                    ref={nameInputRef}
                    id="contact-name"
                    name="name"
                    required
                    type="text"
                    autoComplete="name"
                    minLength={2}
                    maxLength={80}
                    placeholder="Enter your full name"
                    className="w-full bg-background border-2 border-border p-3.5 text-foreground focus:outline-none focus:border-foreground"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block uppercase tracking-wider text-muted-foreground mb-2 font-mono text-xs">YOUR EMAIL *</label>
                  <input
                    ref={emailInputRef}
                    id="contact-email"
                    name="email"
                    required
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    placeholder="Enter your email address"
                    className="w-full bg-background border-2 border-border p-3.5 text-foreground focus:outline-none focus:border-foreground"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    id="contact-subject-label"
                    htmlFor="contact-subject"
                    className="block uppercase tracking-wider text-muted-foreground font-mono text-xs cursor-pointer select-none"
                  >
                    SUBJECT *
                  </label>
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                    TYPE OR SELECT TOPIC
                  </span>
                </div>

                <div className="relative">
                  <input
                    ref={subjectInputRef}
                    id="contact-subject"
                    name="subject"
                    required
                    type="text"
                    minLength={2}
                    maxLength={120}
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value)
                      if (subjectError) setSubjectError(false)
                    }}
                    placeholder="e.g. Web development, Security audit, or custom subject..."
                    list="subject-suggestions"
                    data-cursor-type="text"
                    aria-describedby={subjectError ? "contact-subject-error" : undefined}
                    className={`w-full bg-background border-2 p-3.5 text-foreground font-mono text-xs focus:outline-none transition-colors ${
                      subjectError
                        ? "border-destructive ring-1 ring-destructive text-destructive placeholder:text-destructive/60"
                        : "border-border hover:border-foreground/70 focus:border-foreground"
                    }`}
                  />

                  <datalist id="subject-suggestions">
                    {SUGGESTED_TOPICS.map((topic) => (
                      <option key={topic} value={topic} />
                    ))}
                  </datalist>
                </div>

                {subjectError && (
                  <p
                    id="contact-subject-error"
                    className="mt-1.5 font-mono text-[11px] font-bold text-destructive uppercase tracking-wider flex items-center gap-1"
                  >
                    * Please enter or select a subject for your message
                  </p>
                )}

                {/* Quick Selection Chips */}
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mr-1">
                    TOPICS:
                  </span>
                  {SUGGESTED_TOPICS.map((topic) => {
                    const isSelected = subject.trim().toLowerCase() === topic.toLowerCase()
                    return (
                      <button
                        key={topic}
                        type="button"
                        data-cursor-type="button"
                        onClick={() => {
                          setSubject(topic)
                          if (subjectError) setSubjectError(false)
                          subjectInputRef.current?.focus()
                        }}
                        className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider border transition-all cursor-pointer select-none ${
                          isSelected
                            ? "bg-foreground text-background border-foreground font-bold shadow-sm"
                            : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-foreground"
                        }`}
                      >
                        {topic}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="contact-message" className="block uppercase tracking-wider text-muted-foreground font-mono text-xs">
                    MESSAGE DETAILS *
                  </label>
                  <span className={`font-mono text-[10px] ${messageLength > 0 && messageLength < 10 ? "text-destructive font-bold" : "text-muted-foreground"}`}>
                    {messageLength > 0 && messageLength < 10
                      ? `MIN 10 CHARS (${messageLength}/10)`
                      : `${messageLength}/5000`}
                  </span>
                </div>
                <textarea
                  ref={messageInputRef}
                  id="contact-message"
                  name="message"
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={6}
                  onChange={(e) => setMessageLength(e.target.value.length)}
                  placeholder="Enter your message details and technical requirements (minimum 10 characters)..."
                  className="w-full bg-background border-2 border-border p-3.5 text-foreground focus:outline-none focus:border-foreground"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="paper-button w-full py-4 bg-foreground text-background font-mono text-xs font-bold uppercase tracking-wider border-2 border-foreground hover:bg-background hover:text-foreground transition-all duration-300 flex items-center justify-center gap-2 select-none cursor-pointer"
              >
                  {isLoading ? "TRANSMITTING MESSAGE..." : "TRANSMIT MESSAGE"} <Send className="w-4 h-4" />
              </button>

              <div className="space-y-2 border-t border-border pt-5 text-[10px] leading-relaxed tracking-wide text-muted-foreground">
                <p>
                  TYPICAL RESPONSE TIME // WITHIN 1–2 BUSINESS DAYS
                </p>
                <p>
                  Your information is used only to respond to this inquiry and is not shared for marketing purposes.
                </p>
              </div>
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
    </div>
  )
}
