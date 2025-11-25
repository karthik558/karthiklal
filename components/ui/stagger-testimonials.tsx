"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const SQRT_5000 = Math.sqrt(5000);

interface Testimonial {
  tempId: number;
  testimonial: string;
  by: string;
  imgSrc: string;
}

interface TestimonialCardProps {
  position: number;
  testimonial: Testimonial;
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  position, 
  testimonial, 
  handleMove, 
  cardSize 
}) => {
  const isCenter = position === 0;
  const [showModal, setShowModal] = useState(false);
  
  // Calculate spacing based on card size for better responsive design
  const spacing = cardSize * 0.65;

  return (
    <>
      <div
        onClick={() => handleMove(position)}
        className={cn(
          "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out",
          isCenter 
            ? "z-10 bg-primary text-primary-foreground border-primary" 
            : "z-0 bg-card text-card-foreground border-border hover:border-primary/50"
        )}
        style={{
          width: cardSize,
          height: cardSize,
          clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
          transform: `
            translate(-50%, -50%) 
            translateX(${spacing * position}px)
            translateY(${isCenter ? -65 : position % 2 ? (cardSize < 320 ? 25 : 15) : (cardSize < 320 ? -25 : -15)}px)
            rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
          `,
          boxShadow: isCenter ? "0px 8px 0px 4px hsl(var(--border))" : "0px 0px 0px 0px transparent"
        }}
      >
        <span
          className="absolute block origin-top-right rotate-45 bg-border"
          style={{
            right: -2,
            top: 48,
            width: SQRT_5000,
            height: 2
          }}
        />
        <div
          className={cn(
            "mb-4 h-14 w-12 flex items-center justify-center font-bold text-lg",
            isCenter 
              ? "bg-white/20 text-white dark:bg-primary-foreground/20 dark:text-primary-foreground" 
              : "bg-muted text-foreground"
          )}
          style={{
            boxShadow: "3px 3px 0px hsl(var(--background))"
          }}
        >
          {testimonial.by.charAt(0).toUpperCase()}
        </div>
        <h3 className={cn(
          "text-base sm:text-lg font-medium overflow-hidden",
          isCenter ? "text-white dark:text-primary-foreground" : "text-foreground"
        )}
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          lineHeight: '1.4em',
          height: '4.2em'
        }}>
          "{testimonial.testimonial}"
        </h3>
        
        {/* Read Full Button - only show on center card */}
        {isCenter && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            className="absolute bottom-14 right-8 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 dark:bg-primary-foreground/20 dark:hover:bg-primary-foreground/30 flex items-center justify-center transition-all duration-200 group"
            aria-label="Read full testimonial"
          >
            <span className="text-xs font-bold text-white dark:text-primary-foreground group-hover:scale-110 transition-transform">⋯</span>
          </button>
        )}
        
        <p className={cn(
          "absolute bottom-8 left-8 right-8 mt-2 text-sm italic",
          isCenter ? "text-white/90 dark:text-primary-foreground/80" : "text-muted-foreground"
        )}>
          - {testimonial.by}
        </p>
      </div>

      {/* Modal for full testimonial */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowModal(false)}
            />
            
            {/* Modal content */}
            <motion.div 
              className="relative bg-card border border-border/50 rounded-2xl shadow-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto"
              initial={{ 
                opacity: 0, 
                scale: 0.9, 
                y: 20 
              }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0 
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.9, 
                y: 20 
              }}
              transition={{ 
                duration: 0.3, 
                ease: "easeOut",
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
            >
              {/* Close button */}
              <motion.button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-all duration-200 group"
                aria-label="Close"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-muted-foreground group-hover:text-foreground text-xl font-light">×</span>
              </motion.button>
              
              <div className="pr-8">
                {/* Header */}
                <motion.div 
                  className="flex items-center gap-4 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center font-bold text-lg text-primary">
                    {testimonial.by.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{testimonial.by}</h3>
                    <p className="text-sm text-muted-foreground">Client Testimonial</p>
                  </div>
                </motion.div>
                
                {/* Quote */}
                <motion.div 
                  className="relative mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <div className="absolute -top-2 -left-2 text-4xl text-primary/30 font-serif">"</div>
                  <blockquote className="text-foreground leading-relaxed text-base pl-6 pr-4">
                    {testimonial.testimonial}
                  </blockquote>
                  <div className="absolute -bottom-2 -right-2 text-4xl text-primary/30 font-serif">"</div>
                </motion.div>
                
                {/* Attribution */}
                <motion.div 
                  className="text-right"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full">
                    <span className="text-sm text-muted-foreground">—</span>
                    <span className="text-sm font-medium text-foreground">{testimonial.by}</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Load testimonials from JSON
    fetch('/data/testimonials.json')
      .then(res => res.json())
      .then(data => {
        const formattedTestimonials: Testimonial[] = data.testimonials.map((item: any, index: number) => ({
          tempId: Date.now() + index, // Use timestamp to avoid conflicts
          testimonial: item.content,
          by: item.name,
          imgSrc: item.avatar
        }));
        setTestimonialsList(formattedTestimonials);
        setIsLoading(false);
      })
      .catch(error => {
        console.log('Failed to load testimonials:', error);
        setIsLoading(false);
        // Show error state instead of fallback
      });
  }, []);

  const handleMove = (steps: number) => {
    setTestimonialsList((prevList) => {
      const newList = [...prevList];
      if (steps > 0) {
        for (let i = steps; i > 0; i--) {
          const item = newList.shift();
          if (!item) return prevList;
          newList.push({ ...item, tempId: Math.random() });
        }
      } else {
        for (let i = steps; i < 0; i++) {
          const item = newList.pop();
          if (!item) return prevList;
          newList.unshift({ ...item, tempId: Math.random() });
        }
      }
      return newList;
    });
  };

  // Auto-scroll effect
  useEffect(() => {
    if (isLoading || testimonialsList.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      handleMove(1);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [isLoading, testimonialsList.length, isPaused]);

  useEffect(() => {
    const updateSize = () => {
      const { matches: isSm } = window.matchMedia("(min-width: 640px)");
      const { matches: isLg } = window.matchMedia("(min-width: 1024px)");
      
      if (isLg) {
        setCardSize(365);
      } else if (isSm) {
        setCardSize(320);
      } else {
        setCardSize(280);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden bg-transparent mx-auto"
      style={{ height: 600, maxWidth: '1200px' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-muted-foreground">Loading testimonials...</div>
        </div>
      ) : testimonialsList.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-muted-foreground">No testimonials available</div>
        </div>
      ) : (
        <>
          {testimonialsList.map((testimonial, index) => {
            // Calculate position relative to center for proper centering
            const centerIndex = Math.floor(testimonialsList.length / 2);
            const position = index - centerIndex;
            
            // Only show visible cards to improve performance
            const isVisible = Math.abs(position) <= 2;
            
            if (!isVisible) return null;
            
            return (
              <TestimonialCard
                key={testimonial.tempId}
                testimonial={testimonial}
                handleMove={handleMove}
                position={position}
                cardSize={cardSize}
              />
            );
          })}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            <button
              onClick={() => handleMove(-1)}
              className={cn(
                "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
                "bg-background border-2 border-border hover:bg-primary hover:text-primary-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              )}
              aria-label="Previous testimonial"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => handleMove(1)}
              className={cn(
                "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
                "bg-background border-2 border-border hover:bg-primary hover:text-primary-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              )}
              aria-label="Next testimonial"
            >
              <ChevronRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
