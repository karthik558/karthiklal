"use client"

import React, { useEffect } from 'react'
import { X, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from './button'
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
          {/* Deep Blur Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-xl"
            onClick={onClose}
          />
          
          {/* Clean Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl overflow-hidden"
          >
            {/* Subtle glow behind the icon */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute right-6 top-6 p-2 rounded-full hover:bg-muted transition-colors z-20 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* 3D Success Icon */}
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.1 }}
                className="relative mb-8"
              >
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                <div className="relative w-24 h-24 rounded-full border border-primary/20 bg-background flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-12 h-12 text-primary" />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -top-2 -right-2"
                  >
                    <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
                  </motion.div>
                </div>
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-display font-bold text-foreground mb-4"
              >
                Message <span className="text-gradient">Sent!</span>
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground mb-8 leading-relaxed"
              >
                {name ? `Thanks, ${name}!` : 'Thanks for reaching out.'} I've received your message and will get back to you as soon as possible.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full space-y-4 mb-8 bg-muted/50 rounded-2xl p-4 border border-border"
              >
                <div className="flex items-center gap-3 text-sm text-foreground/80">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>Email confirmation sent</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground/80">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>Expect a response within 24 hours</span>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full"
              >
                <AnimatedButton 
                  onClick={onClose}
                  className="w-full h-14 rounded-xl"
                  variant="primary"
                >
                  Close
                </AnimatedButton>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
