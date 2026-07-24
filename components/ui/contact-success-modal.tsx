"use client"

import React, { useEffect } from 'react'
import { X, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedButton } from './animated-button'

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
          
          {/* Sharp Brutalist Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-md border-2 border-foreground bg-card p-8 md:p-10 shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 border-2 border-border bg-background text-foreground hover:border-foreground hover:bg-foreground hover:text-background transition-colors z-20"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Badge Icon */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mb-6 p-4 border-2 border-foreground bg-foreground text-background"
              >
                <ShieldCheck className="h-8 w-8" />
              </motion.div>

              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-2">
                TRANSMISSION ACKNOWLEDGED // [200 OK]
              </div>

              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4 font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground"
              >
                MESSAGE TRANSMITTED
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8 font-sans text-sm leading-relaxed text-muted-foreground font-light border-y border-border py-4"
              >
                {name ? `Thank you for reaching out, ${name}!` : 'Thank you for reaching out!'} Your message has been received safely. I will review your requirements and get back to you promptly.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full"
              >
                <AnimatedButton 
                  onClick={onClose}
                  className="h-12 w-full font-mono text-xs font-bold uppercase tracking-wider"
                  variant="primary"
                >
                  ACKNOWLEDGE & RETURN
                </AnimatedButton>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
