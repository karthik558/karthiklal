"use client"

import PageIntro from "@/components/ui/page-intro"
import { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import { Send, Check, Copy, ChevronDown } from "lucide-react"
import { toast } from "sonner"
import { PROFILE_DATA, PUBLIC_SOCIAL_LINKS } from "@/lib/static-data"

const SUBJECT_OPTIONS = [
  "Security audit",
  "Web development",
  "IT consulting",
  "Infrastructure and cloud",
  "Design and branding",
  "General inquiry",
  "Other / Custom subject",
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
  const [customSubject, setCustomSubject] = useState("")
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [subjectError, setSubjectError] = useState(false)
  const [messageLength, setMessageLength] = useState(0)
  const selectContainerRef = useRef<HTMLDivElement>(null)
  const selectButtonRef = useRef<HTMLButtonElement>(null)
  const customInputRef = useRef<HTMLInputElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const messageInputRef = useRef<HTMLTextAreaElement>(null)

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
        setHighlightedIndex(
          selectedSubject
            ? SUBJECT_OPTIONS.indexOf(selectedSubject as (typeof SUBJECT_OPTIONS)[number])
            : 0
        )
      } else {
        setHighlightedIndex((prev) => (prev < SUBJECT_OPTIONS.length - 1 ? prev + 1 : 0))
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (!isSelectOpen) {
        setIsSelectOpen(true)
        setHighlightedIndex(
          selectedSubject
            ? SUBJECT_OPTIONS.indexOf(selectedSubject as (typeof SUBJECT_OPTIONS)[number])
            : SUBJECT_OPTIONS.length - 1
        )
      } else {
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : SUBJECT_OPTIONS.length - 1))
      }
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      if (isSelectOpen && highlightedIndex >= 0 && highlightedIndex < SUBJECT_OPTIONS.length) {
        chooseOption(SUBJECT_OPTIONS[highlightedIndex])
      } else {
        setIsSelectOpen((prev) => !prev)
        if (!isSelectOpen) {
          setHighlightedIndex(
            selectedSubject
              ? SUBJECT_OPTIONS.indexOf(selectedSubject as (typeof SUBJECT_OPTIONS)[number])
              : 0
          )
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

  const chooseOption = (option: string) => {
    setSelectedSubject(option)
    setSubjectError(false)
    setIsSelectOpen(false)
    if (option === "Other / Custom subject") {
      setTimeout(() => customInputRef.current?.focus(), 50)
    } else {
      selectButtonRef.current?.focus()
    }
  }

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
    const message = (formData.get("message") as string)?.trim() || ""
    const website = (formData.get("website") as string) || ""

    const effectiveSubject =
      selectedSubject === "Other / Custom subject"
        ? customSubject.trim()
        : selectedSubject.trim()

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

    if (!selectedSubject) {
      setSubjectError(true)
      selectButtonRef.current?.focus()
      toast.error("Subject is required", {
        description: "Please select a subject from the list.",
      })
      return
    }

    if (selectedSubject === "Other / Custom subject" && effectiveSubject.length < 2) {
      setSubjectError(true)
      customInputRef.current?.focus()
      toast.error("Custom subject required", {
        description: "Please enter your custom subject (minimum 2 characters).",
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
        subject: effectiveSubject,
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
      setSelectedSubject("")
      setCustomSubject("")
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
    <div className="contact-page page-shell">
      <div className="section-container">

        <PageIntro label="CONTACT / LET’S TALK" title="Good things start" accent="with a conversation." description="A project, a question, or an idea worth exploring. Tell me what you have in mind." />

        <div className="contact-layout">

          {/* Left Info Column */}
          <div className="contact-channels font-mono text-xs">
            <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
              <div>
                <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-6">
                  <span className="studio-label">FIND ME HERE</span>

                </div>

                <div className="space-y-4">
                  <div className="contact-channel">
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

                  <div className="contact-channel">
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
                      className="studio-text-link contact-social"
                    >
                      {s.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Message form */}
          <div className="contact-form-panel">
            <div className="relative z-10">
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-6">
                <span className="studio-label">TELL ME ABOUT IT</span>

              </div>

              <form
                onSubmit={handleSubmit}
                onReset={() => {
                  setSelectedSubject("")
                  setCustomSubject("")
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
                <label
                  id="contact-subject-label"
                  htmlFor="contact-subject"
                  className="block uppercase tracking-wider text-muted-foreground mb-2 font-mono text-xs cursor-pointer select-none"
                >
                  SUBJECT *
                </label>
                <div ref={selectContainerRef} className="relative">
                  <button
                    ref={selectButtonRef}
                    type="button"
                    id="contact-subject"
                    role="combobox"
                    aria-labelledby="contact-subject-label"
                    aria-haspopup="listbox"
                    aria-expanded={isSelectOpen}
                    aria-controls="contact-subject-list"
                    data-invalid={subjectError ? "true" : undefined}
                    aria-invalid={subjectError || undefined}
                    aria-describedby={subjectError ? "contact-subject-error" : undefined}
                    data-cursor-type="select"
                    onClick={() => {
                      setIsSelectOpen((prev) => !prev)
                      if (subjectError) setSubjectError(false)
                      if (!isSelectOpen) {
                        setHighlightedIndex(
                          selectedSubject
                            ? SUBJECT_OPTIONS.indexOf(selectedSubject as (typeof SUBJECT_OPTIONS)[number])
                            : 0
                        )
                      }
                    }}
                    onKeyDown={handleSelectKeyDown}
                    className={`w-full bg-background border-2 p-3.5 text-foreground flex items-center justify-between font-mono text-xs transition-all focus:outline-none select-none cursor-pointer ${
                      subjectError
                        ? "border-destructive ring-1 ring-destructive text-destructive"
                        : isSelectOpen
                        ? "border-foreground shadow-[4px_4px_0_hsl(var(--border))]"
                        : "border-border hover:border-foreground/80 focus:border-foreground"
                    }`}
                  >
                    <span
                      className={
                        selectedSubject
                          ? "text-foreground font-bold uppercase tracking-wider"
                          : subjectError
                          ? "text-destructive font-semibold uppercase tracking-wider"
                          : "text-muted-foreground uppercase tracking-wider"
                      }
                    >
                      {selectedSubject || "Select a subject"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 shrink-0 ml-2 ${
                        subjectError ? "text-destructive" : "text-foreground"
                      } ${isSelectOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <input
                    type="hidden"
                    name="subject"
                    value={selectedSubject === "Other / Custom subject" ? customSubject : selectedSubject}
                  />

                  {subjectError && !isSelectOpen && (
                    <p
                      id="contact-subject-error"
                      className="mt-1.5 font-mono text-[11px] font-bold text-destructive uppercase tracking-wider flex items-center gap-1"
                    >
                      * Please select or specify a subject for your inquiry
                    </p>
                  )}

                  {isSelectOpen && (
                    <ul
                      id="contact-subject-list"
                      role="listbox"
                      aria-labelledby="contact-subject-label"
                      data-lenis-prevent
                      className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-64 w-full overflow-y-auto overscroll-contain border-2 border-foreground bg-card p-1 shadow-[4px_4px_0_hsl(var(--border))] divide-y divide-border/60 font-mono text-xs animate-in fade-in-0 duration-150"
                    >
                      {SUBJECT_OPTIONS.map((option, idx) => {
                        const isSelected = selectedSubject === option
                        const isHighlighted = highlightedIndex === idx
                        return (
                          <li
                            key={option}
                            id={`contact-subject-option-${idx}`}
                            role="option"
                            aria-selected={isSelected}
                            data-cursor-type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => chooseOption(option)}
                            onMouseEnter={() => setHighlightedIndex(idx)}
                            className={`flex min-h-11 cursor-pointer items-center justify-between gap-4 px-3.5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-colors select-none ${
                              isSelected
                                ? "bg-foreground text-background"
                                : isHighlighted
                                ? "bg-muted text-foreground"
                                : "text-foreground hover:bg-muted/60"
                            }`}
                          >
                            <span>{option}</span>
                            {isSelected && <Check aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />}
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>

                {/* Custom Subject Input - smoothly revealed when "Other / Custom subject" is selected */}
                {selectedSubject === "Other / Custom subject" && (
                  <div className="mt-3 animate-in fade-in-0 slide-in-from-top-1 duration-150">
                    <label
                      htmlFor="custom-subject"
                      className="block uppercase tracking-wider text-muted-foreground mb-1.5 font-mono text-[11px]"
                    >
                      SPECIFY CUSTOM SUBJECT *
                    </label>
                    <input
                      ref={customInputRef}
                      id="custom-subject"
                      name="custom_subject"
                      required
                      type="text"
                      minLength={2}
                      maxLength={120}
                      value={customSubject}
                      onChange={(e) => {
                        setCustomSubject(e.target.value)
                        if (subjectError) setSubjectError(false)
                      }}
                      placeholder="Enter your custom subject..."
                      className="w-full bg-background border-2 border-border p-3.5 text-foreground font-mono text-xs focus:outline-none focus:border-foreground"
                    />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="contact-message" className="block uppercase tracking-wider text-muted-foreground font-mono text-xs">
                    YOUR MESSAGE *
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
                  placeholder="What are you working on? Tell me a little about it."
                  className="w-full bg-background border-2 border-border p-3.5 text-foreground focus:outline-none focus:border-foreground"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="paper-button w-full py-4 bg-foreground text-background font-mono text-xs font-bold uppercase tracking-wider border-2 border-foreground hover:bg-background hover:text-foreground transition-all duration-300 flex items-center justify-center gap-2 select-none cursor-pointer"
              >
                  {isLoading ? "SENDING MESSAGE..." : "SEND MESSAGE"} <Send className="w-4 h-4" />
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
