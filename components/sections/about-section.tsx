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

  if (!profileData) {
    return <div>Loading...</div>
  }
  return (
    <section id="about" className="py-16 md:py-24 bg-secondary/10 relative z-10">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image column */}
          <div className="relative mx-auto lg:mx-0 max-w-xs lg:max-w-sm" data-speed="1.1">
            <div className="relative group">
              {/* Elegant image container with glow effect */}
              <div className="relative">
                {/* Glow effect background */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-purple-500/20 to-primary/30 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Main image container */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/20 bg-background">
                  <img
                    src={profileData.personalInfo.avatar || "/user/1.jpg"}
                    alt={`${profileData.personalInfo.name} - About Picture`}
                    width={300}
                    height={360}
                    className="w-full h-auto object-cover animate-item transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                    data-speed="1.0"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Decorative corner accents */}
                  <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-primary/60 rounded-tl-lg"></div>
                  <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-primary/60 rounded-tr-lg"></div>
                  <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-primary/60 rounded-bl-lg"></div>
                  <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-primary/60 rounded-br-lg"></div>
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
              <Button asChild size="default" className="interactive rounded-full button bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/contact">
                  Let's Talk
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="default" className="interactive rounded-full button border-2 hover:bg-primary/10 transition-all duration-300">
                <Link href="https://drive.google.com/file/d/1y1PklhkLbM9iFLGCOP4dFPj6DzDIzd7u/view?usp=sharing" download>
                  Download CV
                  <Download className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

