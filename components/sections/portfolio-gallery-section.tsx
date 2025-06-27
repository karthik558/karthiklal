"use client"

import { useState, useEffect } from "react"
import { Component } from "@/components/ui/circular-gallery";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface Social {
  name: string
  url: string
}

interface SocialsData {
  socials: Social[]
}

// Portfolio items showcasing design works
const portfolioItems = [
  {
    image: "https://mir-s3-cdn-cf.behance.net/project_modules/fs/00634e215516589.67cb14067e350.jpeg",
  },
  {
    image: "https://mir-s3-cdn-cf.behance.net/project_modules/fs/06a1c6198005031.664f4d2c07e1a.png",
  },
  {
    image: `https://mir-s3-cdn-cf.behance.net/project_modules/fs/2b8ef1198005031.663a25afab140.png`,
  },
  {
    image: `https://mir-s3-cdn-cf.behance.net/project_modules/fs/0300da198005031.663b38c0e793d.png`,
  },
  {
    image: `https://mir-s3-cdn-cf.behance.net/project_modules/fs/bd3b4d174168173.649d2364da5e0.png`,
  },
  {
    image: `https://mir-s3-cdn-cf.behance.net/project_modules/fs/8ca4ef174167957.649d222d7535e.png`,
  },
  {
    image: `https://mir-s3-cdn-cf.behance.net/project_modules/fs/94f398149008519.62e286d4a6d9a.png`,
  },
  {
    image: `https://mir-s3-cdn-cf.behance.net/project_modules/fs/41f9c5149008519.62dfe2d31023a.png`,
  },
  {
    image: `https://mir-s3-cdn-cf.behance.net/project_modules/fs/138959140295881.623ef4a205c5d.png`,
  },
  {
    image: `https://mir-s3-cdn-cf.behance.net/project_modules/fs/946118139026885.623bf32779298.png`,
  },
  {
    image: `https://mir-s3-cdn-cf.behance.net/project_modules/fs/e22062188246697.66a9d29dc9560.png`,
  },
  {
    image: `https://mir-s3-cdn-cf.behance.net/project_modules/fs/a79652134749859.61dbf42a779fb.jpg`,
  },
  {
    image: `https://mir-s3-cdn-cf.behance.net/project_modules/fs/f1df08134749859.620251784767a.png`,
  },
  {
    image: `https://mir-s3-cdn-cf.behance.net/project_modules/fs/60449a174168051.649d22bb84335.png`,
  },
  {
    image: `https://mir-s3-cdn-cf.behance.net/project_modules/fs/0ef99e139027447.62482ffc0e5e7.png`,
  },
];

const PortfolioGallerySection = () => {
  const [behanceUrl, setBehanceUrl] = useState<string>("#")

  useEffect(() => {
    const fetchBehanceUrl = async () => {
      try {
        const response = await fetch('/data/socials.json')
        const data: SocialsData = await response.json()
        const behance = data.socials.find(social => social.name === 'Behance')
        if (behance) {
          setBehanceUrl(behance.url)
        }
      } catch (error) {
        console.error('Failed to fetch socials:', error)
      }
    }

    fetchBehanceUrl()
  }, [])
  return (
    <section 
      id="portfolio-gallery" 
      className="py-20 md:py-32 bg-background relative z-10"
    >
      <div className="container">
        <div className="text-center mb-16">
          <span className="inline-block text-primary font-medium mb-2 animate-item">
            Design Portfolio
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-item">
            <span className="text-gradient">Featured Works</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-item">
            Explore my creative journey through various design projects, from web development 
            to cybersecurity solutions. Each piece represents innovation and attention to detail.
          </p>
        </div>
        
        <div className="flex w-full h-[80vh] justify-center items-center">
          <div 
            className="w-full max-w-screen-xl mx-auto h-full overflow-hidden relative border-none shadow-none"
          >
            <Component 
              items={portfolioItems} 
              bend={2} 
              textColor="#ffffff" 
              borderRadius={0.05} 
              font="bold 24px DM Sans"
            />
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link href={behanceUrl}>
            <Button 
              size="lg" 
              className="rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              View All Designs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PortfolioGallerySection;
