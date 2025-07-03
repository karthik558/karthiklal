"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, ExternalLink } from "lucide-react"
import Link from "next/link"

interface PersonalInfo {
  name: string
  title: string
  dateOfBirth: string
  location: string
  email: string
  linkedin: string
  github: string
  website: string
  avatar: string
  bio: string
  professionalSummary: string
}

interface ProfileData {
  personalInfo: PersonalInfo
  languages: string[]
  interests: string[]
  availability: string
}

export default function AboutSection() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Array of images to cycle through
  const images = [
    "/user/1.jpg",
    "/user/2.jpg", 
    "/user/3.jpg",
    "/user/4.jpg",
    "/user/5.jpg"
  ]

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/data/profile.json')
        const data: ProfileData = await response.json()
        setProfileData(data)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      }
    }

    fetchProfile()
  }, [])

  // Auto-rotate images every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
        setIsTransitioning(false)
      }, 300) // Transition duration
    }, 3500) // Change every 3.5 seconds

    return () => clearInterval(interval)
  }, [images.length])

  if (!profileData) {
    return <div>Loading...</div>
  }
  return (
    <section id="about" className="py-16 md:py-24 bg-secondary/10 relative z-10">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image column */}
          <div className="relative mx-auto lg:mx-0 w-full max-w-sm lg:max-w-md" data-speed="1.1">
            <div className="relative group">
              {/* Elegant image container with glow effect */}
              <div className="relative">
                {/* Glow effect background */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-purple-500/20 to-primary/30 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Main image container */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/20 bg-background">
                  {/* Image carousel */}
                  <div className="relative w-full aspect-[3/4]">
                    {images.map((image, index) => (
                      <img
                        key={image}
                        src={image}
                        alt={`${profileData.personalInfo.name} - About Picture ${index + 1}`}
                        width={400}
                        height={500}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
                          index === currentImageIndex 
                            ? 'opacity-100 scale-100' 
                            : 'opacity-0 scale-105'
                        } ${
                          isTransitioning && index === currentImageIndex 
                            ? 'animate-pulse' 
                            : ''
                        }`}
                        style={{
                          transform: index === currentImageIndex 
                            ? 'scale(1)' 
                            : 'scale(1.05)',
                          filter: index === currentImageIndex 
                            ? 'brightness(1)' 
                            : 'brightness(0.8)'
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  
                  {/* Decorative corner accents */}
                  <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-primary/60 rounded-tl-lg z-10"></div>
                  <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-primary/60 rounded-tr-lg z-10"></div>
                  <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-primary/60 rounded-bl-lg z-10"></div>
                  <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-primary/60 rounded-br-lg z-10"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Content column */}
          <div className="space-y-6" data-speed="0.95">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-primary uppercase tracking-wider animate-item">
                About Me
              </h3>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight animate-item">
                <span className="text-gradient">Hey there!</span>
              </h2>
            </div>

            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed animate-item">
                {profileData.personalInfo.bio}
              </p>

              <p className="text-muted-foreground leading-relaxed animate-item">
                {profileData.personalInfo.professionalSummary}
              </p>
            </div>

            {/* Personal details cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 animate-item">
              <div className="p-3 rounded-lg bg-background/50 border border-border/50 backdrop-blur-sm hover:bg-background/80 transition-colors">
                <p className="text-xs text-muted-foreground mb-1">Name</p>
                <p className="font-semibold text-foreground">{profileData.personalInfo.name}</p>
              </div>
              <div className="p-3 rounded-lg bg-background/50 border border-border/50 backdrop-blur-sm hover:bg-background/80 transition-colors">
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <a href={`mailto:${profileData.personalInfo.email}`} className="font-semibold text-primary hover:underline transition-colors text-sm">{profileData.personalInfo.email}</a>
              </div>
              <div className="p-3 rounded-lg bg-background/50 border border-border/50 backdrop-blur-sm hover:bg-background/80 transition-colors col-span-1 sm:col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Location</p>
                <p className="font-semibold text-foreground">{profileData.personalInfo.location}</p>
              </div>
            </div>

            {/* Signature */}
            <div className="flex justify-start animate-item pt-2">
              <div className="relative p-3 rounded-lg bg-background/30 border border-border/30 backdrop-blur-sm">
                <img
                  src="/signature/signature-light.png"
                  alt={`${profileData.personalInfo.name} Signature`}
                  className="h-10 w-auto dark:hidden opacity-80"
                />
                <img
                  src="/signature/signature-dark.png"
                  alt={`${profileData.personalInfo.name} Signature`}
                  className="h-10 w-auto hidden dark:block opacity-80"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 animate-item">
              <Button asChild size="lg" className="interactive rounded-full button bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/contact">
                  Let's Talk
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

