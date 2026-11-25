"use client"

import React, { useEffect } from 'react'
import { X, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ContactSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  name?: string
}

export function ContactSuccessModal({ isOpen, onClose, name }: ContactSuccessModalProps) {
  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden' // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Editorial Modal Container */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md border border-border bg-card p-8 md:p-10 shadow-lg overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 grid h-10 w-10 place-items-center border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground z-20"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative z-10 flex flex-col items-start text-left">
              <div className="mb-5 grid h-11 w-11 place-items-center border border-primary/40 bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <p className="studio-label">MESSAGE RECEIVED</p>

              <h2 className="mt-2 mb-4 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Thank you for reaching out{name ? `, ${name}` : ""}.
              </h2>

              <p className="mb-6 border-y border-border py-4 text-sm leading-relaxed text-muted-foreground">
                Your message has been received safely. I will review your requirements and get back to you within 1–2 business days.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="review-toggle"
              >
                Back to contact <span>→</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
