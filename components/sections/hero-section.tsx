"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF, MeshDistortMaterial } from "@react-three/drei"
import type * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, Download, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import SmoothLink from "@/components/smooth-link"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface PersonalInfo {
  name: string
  title: string
  professionalSummary: string
}

interface ProfileData {
  personalInfo: PersonalInfo
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null)

  useEffect(() => {
    if (!particlesRef.current) return

    const animate = () => {
      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.001
      }
      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <points ref={particlesRef}>
      <sphereGeometry args={[3, 64, 64]} />
      <pointsMaterial size={0.015} color="#4466ff" sizeAttenuation transparent opacity={0.6} />
    </points>
  )
}

function ProfileSphere() {
  const meshRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    if (!meshRef.current) return

    const animate = () => {
      if (meshRef.current) {
        meshRef.current.rotation.x += 0.002
        meshRef.current.rotation.y += 0.003
      }
      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <MeshDistortMaterial
        color="#4466ff"
        roughness={0.3}
        metalness={0.8}
        distort={0.4}
        speed={2}
      />
    </mesh>
  )
}

export default function HeroSection() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const [profileData, setProfileData] = useState<PersonalInfo | null>(null)

  // Mouse movement for 3D tilt effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - left) / width - 0.5
    const y = (e.clientY - top) / height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 })
  
  // Parallax movement
  const moveX1 = useSpring(useTransform(mouseX, [-0.5, 0.5], [-25, 25]), { stiffness: 150, damping: 20 })
  const moveY1 = useSpring(useTransform(mouseY, [-0.5, 0.5], [-25, 25]), { stiffness: 150, damping: 20 })
  
  const moveX2 = useSpring(useTransform(mouseX, [-0.5, 0.5], [25, -25]), { stiffness: 150, damping: 20 })
  const moveY2 = useSpring(useTransform(mouseY, [-0.5, 0.5], [25, -25]), { stiffness: 150, damping: 20 })

  // Glare effect
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"])
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/data/profile.json')
        const data: ProfileData = await response.json()
        setProfileData(data.personalInfo)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      }
    }

    fetchProfile()
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background z-0" />

      {/* Animated background particles */}
      <div className="absolute inset-0 z-0">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <ProfileSphere />
          <ParticleField />
          <Environment preset="city" />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="container relative z-10 mt-24 lg:mt-0"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative inline-block"
            >
              <Badge variant="outline" className="glass text-primary px-6 py-2 border-primary/20 bg-primary/5">
                {profileData?.title || "Loading..."}
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold flex flex-wrap items-center gap-x-3"
            >
              <span>Hi, I'm</span>
              <Image
                src="/hero_name.svg"
                alt="Karthik Lal"
                width={300}
                height={80}
                className="h-12 md:h-16 lg:h-20 w-auto"
                priority
              />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-xl text-muted-foreground max-w-xl glass p-4 rounded-lg"
            >
              {profileData?.professionalSummary || "Loading professional summary..."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Button asChild size="lg" className="rounded-full glass hover:shadow-primary/20 hover:shadow-lg">
                <SmoothLink href="/#portfolio-gallery">
                  View Design Portfolio
                  <ExternalLink className="ml-2 h-4 w-4" />
                </SmoothLink>
              </Button>

              {/* Download CV Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="lg" className="group relative rounded-full glass border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 hover:border-primary/50 transition-all duration-300 overflow-hidden">
                    <span className="relative z-10 flex items-center">
                      <Download className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                      Download CV
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-56 p-3 z-50 bg-popover border border-border shadow-lg rounded-lg"
                  side="bottom"
                  align="center"
                  sideOffset={12}
                  avoidCollisions={true}
                  collisionPadding={20}
                  style={{ zIndex: 9999 }}
                >
                  <div className="flex flex-col gap-2">
                    <Button asChild variant="ghost" size="sm" className="justify-start hover:bg-accent">
                      <a href="https://drive.google.com/file/d/1y1PklhkLbM9iFLGCOP4dFPj6DzDIzd7u/view?usp=sharing" target="_blank" rel="noopener noreferrer">
                        Open in New Tab
                      </a>
                    </Button>
                    <Button asChild variant="ghost" size="sm" className="justify-start hover:bg-accent">
                      <a href="https://drive.google.com/uc?export=download&id=1y1PklhkLbM9iFLGCOP4dFPj6DzDIzd7u">
                        Download (Same Tab)
                      </a>
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </motion.div>
          </motion.div>

          <div 
            className="hidden lg:flex relative h-[600px] items-center justify-center perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div 
              className="relative w-[500px] h-[600px]"
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Animated Background Blob */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#74261a]/40 via-[#963e30]/30 to-[#b55242]/40 blur-[100px] animate-pulse" />

              {/* Main Hero Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: [0, -10, 0] 
                }}
                transition={{ 
                  opacity: { duration: 1, delay: 0.2 },
                  scale: { duration: 1, delay: 0.2 },
                  y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                }}
                style={{
                  x: moveX1,
                  y: moveY1,
                  z: 50,
                }}
                whileHover={{ scale: 1.02, z: 80 }}
                className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl shadow-[#74261a]/30 border border-white/10 bg-background/5 backdrop-blur-sm group"
              >
                <Image src="/user/hero1.png" alt="Hero art" fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
                
                {/* Glare Overlay */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.2) 25%, transparent 30%)",
                    backgroundSize: "200% 100%",
                    backgroundPositionX: glareX
                  }}
                />
              </motion.div>

              {/* Decorative Elements - Clean & Minimal */}
              <motion.div 
                style={{ x: moveX2, y: moveY2, z: 20 }}
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full border border-white/10 bg-[#74261a]/10 backdrop-blur-md"
              />
              <motion.div 
                style={{ x: moveX1, y: moveY1, z: 30 }}
                className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-[#963e30]/20 blur-2xl"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity: scrollIndicatorOpacity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <Link href="#about" className="block group">
          <ArrowDown className="h-6 w-6 text-primary/70 group-hover:text-primary animate-bounce transition-colors duration-300" />
        </Link>
      </motion.div>
    </section>
  )
}

