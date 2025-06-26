"use client"

import { useRef, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF, MeshDistortMaterial } from "@react-three/drei"
import type * as THREE from "three"
import { Button } from "@/components/ui/button"
import { ArrowDown, Download, ExternalLink } from "lucide-react"
import Link from "next/link"

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
              <span className="glass text-primary text-sm font-semibold px-6 py-3 rounded-full">
                IT Manager, Full Stack Developer, Cybersecurity Enthusiast
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold"
            >
              Hi, I'm <span className="hero-name">Karthik Lal</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-xl text-muted-foreground max-w-xl glass p-4 rounded-lg"
            >
              IT Manager with 6.8+ years in network management, cybersecurity, and full-stack development. Currently managing IT operations at IHCL, delivering secure, scalable IT solutions aligned with business goals.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Button asChild size="lg" className="rounded-full glass hover:shadow-primary/20 hover:shadow-lg">
                <Link href="#portfolio">
                  View My Work
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="rounded-full glass border-primary/20">
                <Link href="#" download>
                  Download CV
                  <Download className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <div className="hidden lg:block relative h-[600px]">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent-foreground/20 rounded-full blur-3xl opacity-20" />
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "mirror",
          repeatDelay: 0.5,
        }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
      >
        <Link
          href="#about"
          className="flex flex-col items-center text-foreground/70 hover:text-primary transition-colors"
        >
          <span className="text-sm mb-2 glass px-4 py-2 rounded-full">Scroll Down</span>
          <ArrowDown className="h-5 w-5 animate-bounce" />
        </Link>
      </motion.div>
    </section>
  )
}

