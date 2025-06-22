"use client"

import { useRef, useEffect } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Download, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function AboutSection() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section id="about" className="py-20 md:py-32 bg-secondary/10">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
        >
          {/* Image column */}
          <motion.div variants={itemVariants} className="relative mx-auto lg:mx-0 max-w-sm lg:max-w-full">
            <div className="relative">
              <div className="absolute -left-4 -top-4 w-24 h-24 bg-primary/10 rounded-lg"></div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/20 rounded-lg"></div>
              <div className="relative rounded-lg overflow-hidden border-2 border-primary/20 shadow-xl">
                <Image
                  src="/placeholder.svg?height=600&width=500"
                  alt="Karthik Lal"
                  width={500}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Content column */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <motion.span variants={itemVariants} className="inline-block text-primary font-medium mb-2">
                About Me
              </motion.span>
              <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-gradient">Hey there!</span>
              </motion.h2>
            </div>

            <motion.p variants={itemVariants} className="text-muted-foreground leading-relaxed">
              Driven IT Manager and developer with a strong background in cybersecurity and network management. With 6.8+ years of experience in IT operations, I currently manage infrastructure at IHCL, focusing on network security, guest connectivity, and in-room technology solutions.
            </motion.p>

            <motion.p variants={itemVariants} className="text-muted-foreground leading-relaxed">
              Passionate about building secure, scalable systems and improving digital experiences for users. Experienced in leading IT operations for hospitality, designing modern web applications, and delivering hands-on support. Always learning, currently pursuing MCA to expand technical and leadership skills.
            </motion.p>

            {/* Personal details grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-sm text-muted-foreground">Name:</p>
                <p className="font-medium">Karthik Lal</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email:</p>
                <p className="font-medium">dev@karthiklal.in</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location:</p>
                <p className="font-medium">Kerala, India</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone:</p>
                <p className="font-medium">+91 8129624036</p>
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg" className="interactive rounded-full">
                <Link href="/contact">
                  Let's Talk
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="interactive rounded-full">
                <Link href="#" download>
                  Download CV
                  <Download className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

