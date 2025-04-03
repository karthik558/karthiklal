"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import type * as THREE from "three"
import { Button } from "@/components/ui/button"
import { ArrowDown, Download, ExternalLink } from "lucide-react"
import Link from "next/link"

// Simplified 3D components to avoid potential issues
function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null)

  return (
    <points ref={particlesRef}>
      <sphereGeometry args={[2, 32, 32]} />
      <pointsMaterial size={0.05} color="#00ff99" sizeAttenuation transparent />
    </points>
  )
}

function ProfileSphere() {
  return (
    <mesh position={[0, 0, -1]}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial color="#00cc88" roughness={0.6} metalness={0.4} />
    </mesh>
  )
}

export default function HeroSection() {
  // Simplified without intersection observer

  return (
    <section className="relative min-h-screen flex items-center">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <ProfileSphere />
          <ParticleField />
          <Environment preset="city" />
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        </Canvas>
      </div>

      {/* Content */}
      <div className="container relative z-10 mt-24 lg:mt-0">
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
              <span className="bg-primary/20 text-primary text-sm font-semibold px-4 py-2 rounded-full">
                Full-Stack Developer
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold"
            >
              Hi, I'm <span className="text-primary">Karthik Lal</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-xl text-muted-foreground max-w-xl"
            >
              I create immersive digital experiences with modern web technologies, focusing on interactive design and
              seamless functionality.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Button asChild size="lg" className="rounded-full">
                <Link href="#portfolio">
                  View My Work
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link href="#" download>
                  Download CV
                  <Download className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <div className="hidden lg:block">{/* The 3D element serves as the visual here */}</div>
        </div>
      </div>

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
          <span className="text-sm mb-2">Scroll Down</span>
          <ArrowDown className="h-5 w-5 animate-bounce" />
        </Link>
      </motion.div>
    </section>
  )
}

