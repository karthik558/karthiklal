"use client"

import Link from "next/link"
import { Home, ArrowLeft, Search, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function NotFoundPage() {
  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/'
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* 404 Text */}
        <div className="space-y-4">
          <h1 className="text-8xl md:text-9xl font-bold text-primary/20">404</h1>
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold">Page Not Found</h2>
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold mb-4">What would you like to do?</h3>
            
            <div className="space-y-3">
              <Button asChild className="w-full justify-start" size="lg">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Homepage
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full justify-start" size="lg">
                <Link href="/projects">
                  <Search className="h-4 w-4 mr-2" />
                  Browse Projects
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full justify-start" size="lg">
                <Link href="/contact">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Me
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Popular Links */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Popular Pages</h3>
          <div className="flex flex-wrap justify-center gap-2">
            <Link 
              href="/#about" 
              className="text-sm text-primary hover:underline px-2 py-1 rounded bg-primary/5"
            >
              About
            </Link>
            <Link 
              href="/#services" 
              className="text-sm text-primary hover:underline px-2 py-1 rounded bg-primary/5"
            >
              Services
            </Link>
            <Link 
              href="/#experience" 
              className="text-sm text-primary hover:underline px-2 py-1 rounded bg-primary/5"
            >
              Experience
            </Link>
            <Link 
              href="/#skills" 
              className="text-sm text-primary hover:underline px-2 py-1 rounded bg-primary/5"
            >
              Skills
            </Link>
          </div>
        </div>

        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={handleGoBack}
          className="text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
        
      </div>
    </div>
  )
}