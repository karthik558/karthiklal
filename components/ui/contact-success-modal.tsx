"use client"

import React, { useEffect } from 'react'
import { X, CheckCircle, Mail, ArrowRight } from 'lucide-react'
import { Button } from './button'

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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in-0 duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in-0 duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md transform rounded-2xl bg-white dark:bg-card border border-border shadow-2xl transition-all animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-green-400 to-green-600 opacity-20 animate-pulse" />
              <div className="relative rounded-full bg-gradient-to-r from-green-400 to-green-600 p-4 animate-in zoom-in-0 duration-500 delay-150">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white animate-in slide-in-from-bottom-2 duration-500 delay-200">
            Message Sent Successfully! 🚀
          </h2>

          {/* Subtitle */}
          <p className="mb-6 text-gray-600 dark:text-gray-300 leading-relaxed animate-in slide-in-from-bottom-2 duration-500 delay-300">
            {name ? `Thanks ${name}!` : 'Thanks!'} I've received your message and will get back to you as soon as possible.
          </p>

          {/* Features */}
          <div className="mb-8 space-y-3 animate-in slide-in-from-bottom-2 duration-500 delay-400">
            <div className="flex items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <Mail className="h-4 w-4 text-primary" />
              <span>Email confirmation sent</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <ArrowRight className="h-4 w-4 text-primary" />
              <span>Expect a response within 24 hours</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-500 delay-500">
            <Button 
              onClick={onClose}
              className="w-full bg-gradient-to-r from-primary to-accent-custom hover:from-primary/90 hover:to-accent-custom/90 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              Perfect! Continue Browsing
            </Button>
            
            <button
              onClick={() => {
                window.open('mailto:dev@karthiklal.in', '_blank')
                onClose()
              }}
              className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
            >
              Send another message
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
