"use client"

import { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import { Send, Check, Copy, ChevronDown } from "lucide-react"
import { toast } from "sonner"
import { PROFILE_DATA, PUBLIC_SOCIAL_LINKS } from "@/lib/static-data"

const PROJECT_TYPES = [
  "Security audit",
  "Web development",
  "IT consulting",
  "Infrastructure and cloud",
  "Design and branding",
  "Other / General inquiry",
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
  const [selectedSubject, setSelectedSubject] = useState("")
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const selectContainerRef = useRef<HTMLDivElement>(null)
  const selectButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (selectContainerRef.current && !selectContainerRef.current.contains(e.target as Node)) {
        setIsSelectOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    document.addEventListener("touchstart", handleOutsideClick)
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
      document.removeEventListener("touchstart", handleOutsideClick)
    }
  }, [])

  const handleSelectKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (!isSelectOpen) {
        setIsSelectOpen(true)
        setHighlightedIndex(selectedSubject ? PROJECT_TYPES.indexOf(selectedSubject as (typeof PROJECT_TYPES)[number]) : 0)
      } else {
        setHighlightedIndex((prev) => (prev < PROJECT_TYPES.length - 1 ? prev + 1 : 0))
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (!isSelectOpen) {
        setIsSelectOpen(true)
        setHighlightedIndex(selectedSubject ? PROJECT_TYPES.indexOf(selectedSubject as (typeof PROJECT_TYPES)[number]) : PROJECT_TYPES.length - 1)
      } else {
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : PROJECT_TYPES.length - 1))
      }
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      if (isSelectOpen && highlightedIndex >= 0 && highlightedIndex < PROJECT_TYPES.length) {
        setSelectedSubject(PROJECT_TYPES[highlightedIndex])
        setIsSelectOpen(false)
      } else {
        setIsSelectOpen((prev) => !prev)
        if (!isSelectOpen) {
          setHighlightedIndex(selectedSubject ? PROJECT_TYPES.indexOf(selectedSubject as (typeof PROJECT_TYPES)[number]) : 0)
        }
      }
    } else if (e.key === "Escape") {
      if (isSelectOpen) {
        e.preventDefault()
        setIsSelectOpen(false)
      }
    } else if (e.key === "Tab") {
      setIsSelectOpen(false)
    }
  }

  const selectOption = (type: string) => {
    setSelectedSubject(type)
    setIsSelectOpen(false)
    selectButtonRef.current?.focus()
  }

  const email = PROFILE_DATA.personalInfo.email || "contact@karthiklal.in"

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
        subject: (formData.get("subject") as string) || selectedSubject,
        message: formData.get("message") as string,
        website: formData.get("website") as string,
      }

      if (!data.name?.trim() || !data.email?.trim() || !data.subject?.trim() || !data.message?.trim()) {
        throw new Error("All fields are required")
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
      if (!response.ok) throw new Error(responseData.error || "Failed to submit message")

      setSenderName(data.name)
      setShowSuccessModal(true)
      setSelectedSubject("")
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
          <p className="mt-4 max-w-2xl font-sans text-base md:text-lg text-muted-foreground font-light leading-relaxed">
            Have an IT project, security vulnerability assessment, or full-stack web build inquiry? Submit a message below or email directly.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Info Column */}
          <div className="paper-sheet lg:col-span-5 border-2 border-foreground bg-card p-8 space-y-8 flex flex-col justify-between font-mono text-xs">
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

          {/* Right Form Column - Airmail Styling */}
          <div className="paper-sheet paper-folded-corner paper-airmail lg:col-span-7 bg-card p-8 md:p-10">
            <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-6">
              <span className="paper-tag">TRANSMISSION MEMO</span>
              <span className="paper-postal-stamp">REGISTERED DISPATCH // IST</span>
            </div>

              <form onSubmit={handleSubmit} onReset={() => setSelectedSubject("")} className="space-y-6 font-mono text-xs">
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-name" className="block uppercase tracking-wider text-muted-foreground mb-2 font-mono text-xs">YOUR NAME *</label>
                  <input
                    id="contact-name"
                    name="name"
                    required
                    type="text"
                    autoComplete="name"
                    maxLength={80}
                    placeholder="Enter your full name"
                    className="w-full bg-background border-2 border-border p-3.5 text-foreground focus:outline-none focus:border-foreground"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block uppercase tracking-wider text-muted-foreground mb-2 font-mono text-xs">YOUR EMAIL *</label>
                  <input
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
                <label
                  id="contact-subject-label"
                  htmlFor="contact-subject"
                  className="block uppercase tracking-wider text-muted-foreground mb-2 font-mono text-xs cursor-pointer select-none"
                >
                  PROJECT TYPE *
                </label>
                <div ref={selectContainerRef} className="relative">
                  <button
                    ref={selectButtonRef}
                    type="button"
                    id="contact-subject"
                    aria-labelledby="contact-subject-label"
                    aria-haspopup="listbox"
                    aria-expanded={isSelectOpen}
                    data-cursor-type="select"
                    onClick={() => {
                      setIsSelectOpen((prev) => !prev)
                      if (!isSelectOpen) {
                        setHighlightedIndex(selectedSubject ? PROJECT_TYPES.indexOf(selectedSubject as (typeof PROJECT_TYPES)[number]) : 0)
                      }
                    }}
                    onKeyDown={handleSelectKeyDown}
                    className={`w-full bg-background border-2 p-3.5 text-foreground flex items-center justify-between font-mono text-xs transition-colors focus:outline-none select-none cursor-pointer ${
                      isSelectOpen ? "border-foreground" : "border-border hover:border-foreground/70 focus:border-foreground"
                    }`}
                  >
                    <span className={selectedSubject ? "text-foreground font-bold uppercase tracking-wider" : "text-muted-foreground uppercase tracking-wider"}>
                      {selectedSubject || "Select a project type"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-foreground transition-transform duration-200 shrink-0 ml-2 ${
                        isSelectOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <input
                    type="hidden"
                    name="subject"
                    value={selectedSubject}
                    required
                  />

                  {isSelectOpen && (
                    <ul
                      role="listbox"
                      aria-labelledby="contact-subject-label"
                      className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 bg-card border-2 border-foreground shadow-2xl py-1 divide-y divide-border/60 max-h-64 overflow-y-auto font-mono text-xs animate-in fade-in-0 duration-150"
                    >
                      {PROJECT_TYPES.map((type, idx) => {
                        const isSelected = selectedSubject === type
                        const isHighlighted = highlightedIndex === idx
                        return (
                          <li
                            key={type}
                            role="option"
                            aria-selected={isSelected}
                            data-cursor-type="button"
                            onClick={() => selectOption(type)}
                            onMouseEnter={() => setHighlightedIndex(idx)}
                            className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-colors select-none ${
                              isSelected
                                ? "bg-foreground text-background font-bold uppercase tracking-wider"
                                : isHighlighted
                                ? "bg-muted text-foreground uppercase tracking-wider font-semibold"
                                : "text-foreground hover:bg-muted/60 uppercase tracking-wider"
                            }`}
                          >
                            <span>{type}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-2" />}
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="block uppercase tracking-wider text-muted-foreground mb-2 font-mono text-xs">MESSAGE DETAILS *</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    maxLength={5000}
                  rows={6}
                  placeholder="Enter your message details and technical requirements..."
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

        <ContactSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          name={senderName}
        />
      </div>
    </div>
  )
}
