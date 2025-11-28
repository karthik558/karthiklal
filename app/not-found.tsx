"use client"

import Link from "next/link"
import { Home, ArrowLeft, Search, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function NotFoundPage() {
  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/'
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-lg w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8"
        >
          {/* 404 Text */}
          <div className="space-y-2">
            <motion.h1
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/20 select-none"
            >
              404
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold mb-2">Page Not Found</h2>
              <p className="text-muted-foreground text-lg">
                Oops! The page you're looking for seems to have vanished into the digital void.
              </p>
            </motion.div>
          </div>

          {/* Quick Actions Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-background/60 backdrop-blur-xl border-border/50 shadow-2xl">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <Button asChild className="w-full justify-start h-12 text-base" size="lg">
                    <Link href="/">
                      <Home className="h-5 w-5 mr-3" />
                      Return Home
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="w-full justify-start h-12 text-base bg-background/50 hover:bg-background/80" size="lg">
                    <Link href="/projects">
                      <Search className="h-5 w-5 mr-3" />
                      Explore Projects
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="w-full justify-start h-12 text-base bg-background/50 hover:bg-background/80" size="lg">
                    <Link href="/contact">
                      <Mail className="h-5 w-5 mr-3" />
                      Contact Support
                    </Link>
                  </Button>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <Button
                    variant="ghost"
                    onClick={handleGoBack}
                    className="text-muted-foreground hover:text-foreground w-full"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}