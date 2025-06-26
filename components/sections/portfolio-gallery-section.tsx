"use client"

import { Component } from "@/components/ui/circular-gallery";

// Portfolio items showcasing design works
const portfolioItems = [
  {
    image: "/1.jpg", // Use your existing image
  },
  {
    image: "/2.jpg", // Use your existing image
  },
  {
    image: `https://picsum.photos/seed/portfolio1/800/600?grayscale`,
  },
  {
    image: `https://picsum.photos/seed/portfolio2/800/600?grayscale`,
  },
  {
    image: `https://picsum.photos/seed/portfolio3/800/600?grayscale`,
  },
  {
    image: `https://picsum.photos/seed/portfolio4/800/600?grayscale`,
  },
  {
    image: `https://picsum.photos/seed/portfolio5/800/600?grayscale`,
  },
  {
    image: `https://picsum.photos/seed/portfolio6/800/600?grayscale`,
  },
  {
    image: `https://picsum.photos/seed/portfolio7/800/600?grayscale`,
  },
  {
    image: `https://picsum.photos/seed/portfolio8/800/600?grayscale`,
  },
  {
    image: `https://picsum.photos/seed/portfolio9/800/600?grayscale`,
  },
  {
    image: `https://picsum.photos/seed/portfolio10/800/600?grayscale`,
  },
];

const PortfolioGallerySection = () => {
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
      </div>
    </section>
  );
};

export default PortfolioGallerySection;
