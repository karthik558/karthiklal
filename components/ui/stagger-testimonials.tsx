"use client"

import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Quote, ExternalLink, Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import testimonialsData from '@/public/data/testimonials.json';

interface Testimonial {
  id: number;
  content: string;
  name: string;
  company: string;
  position: string;
  avatar: string;
  rating: number;
  website?: string;
}

const TestimonialCard = ({ testimonial, isHovered, onHover, onLeave, onClick }: { testimonial: Testimonial, isHovered: boolean, onHover: () => void, onLeave: () => void, onClick: () => void }) => {
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={cn(
        "relative w-[350px] md:w-[450px] shrink-0 rounded-3xl border border-border bg-card p-6 md:p-8 transition-all duration-500 overflow-hidden group whitespace-normal cursor-pointer",
        isHovered ? "shadow-xl border-primary/30 bg-card/80 scale-[1.02] z-10" : "shadow-sm scale-100 z-0 opacity-70 hover:opacity-100"
      )}
    >
      {/* Decorative gradient blob */}
      <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/10 rounded-full blur-[30px] group-hover:bg-primary/20 transition-colors duration-500" />
      
      <div className="relative z-10 flex flex-col h-full justify-between gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1">
              {[...Array(testimonial.rating || 5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <Quote className="w-8 h-8 text-primary/20 group-hover:text-primary/40 transition-colors duration-500" />
          </div>
          <p className="text-foreground/90 text-sm md:text-base leading-relaxed italic line-clamp-3">
            "{testimonial.content}"
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center font-bold text-lg text-primary shadow-inner">
              {testimonial.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm">{testimonial.name}</h4>
              <p className="text-xs text-muted-foreground">{testimonial.position}, {testimonial.company}</p>
            </div>
          </div>
          {testimonial.website && (
            <a 
              href={testimonial.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

const MarqueeRow = ({ items, direction = 1, speed = 40, onSelect }: { items: Testimonial[], direction?: number, speed?: number, onSelect: (t: Testimonial) => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const baseX = useMotionValue(0);
  
  // Create a spring to handle velocity smoothly when pausing on hover
  const springVelocity = useSpring(direction * speed, {
    damping: 50,
    stiffness: 400
  });

  // Calculate the total width of the content once it's mounted
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      // Approximate width based on card size + gap. 
      // 350px (mobile) to 450px (desktop) + 24px gap. We'll use a conservative estimate.
      const isMobile = window.innerWidth < 768;
      const cardWidth = isMobile ? 350 : 450;
      const gap = 24; // gap-6
      setContentWidth((cardWidth + gap) * items.length);
    }
  }, [items]);

  useAnimationFrame((time, delta) => {
    // If hovering, slow down to 0 smoothly. Otherwise, speed up to target speed.
    const targetVelocity = hoveredId !== null ? 0 : direction * speed;
    springVelocity.set(targetVelocity);
    
    let moveBy = springVelocity.get() * (delta / 1000);
    
    // Move the base X value
    let newX = baseX.get() + moveBy;
    
    // Wrap around logic using the measured content width
    if (contentWidth > 0) {
      if (direction === -1 && newX <= -contentWidth) {
        newX = 0;
      } else if (direction === 1 && newX >= 0) {
        newX = -contentWidth;
      }
    }

    baseX.set(newX);
  });

  const x = useTransform(baseX, (v) => `${v}px`);

  return (
    <div className="relative flex overflow-hidden py-4" ref={containerRef}>
      <motion.div className="flex gap-6 whitespace-nowrap px-3" style={{ x }}>
        {/* We render the items multiple times to ensure seamless infinite looping */}
        {[...items, ...items, ...items, ...items].map((testimonial, i) => (
          <TestimonialCard 
            key={`${testimonial.id}-${i}`} 
            testimonial={testimonial} 
            isHovered={hoveredId === i}
            onHover={() => setHoveredId(i)}
            onLeave={() => setHoveredId(null)}
            onClick={() => onSelect(testimonial)}
          />
        ))}
      </motion.div>
    </div>
  )
}

export const StaggerTestimonials: React.FC = () => {
  const testimonials = testimonialsData.testimonials as Testimonial[];
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  
  if (!testimonials || testimonials.length === 0) return null;

  // Split testimonials for two rows, or reverse the second row for a nice effect
  const row1 = [...testimonials];
  const row2 = [...testimonials].reverse();

  return (
    <>
      <div className="relative w-full overflow-hidden mx-auto flex flex-col gap-4 py-8">
        {/* Marquee Rows */}
        <MarqueeRow items={row1} direction={-1} speed={40} onSelect={setSelectedTestimonial} />
        <MarqueeRow items={row2} direction={1} speed={30} onSelect={setSelectedTestimonial} />
      </div>

      <AnimatePresence>
        {selectedTestimonial && (
          <motion.div 
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedTestimonial(null)}
            />
            
            {/* Modal content */}
            <motion.div 
              className="relative bg-background/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden z-10 flex flex-col"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut", type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Header with Close Button */}
              <div className="flex items-start justify-between p-6 md:p-8 border-b border-border/40 bg-secondary/20">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center font-bold text-xl md:text-2xl text-primary shadow-inner">
                    {selectedTestimonial.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg md:text-xl">{selectedTestimonial.name}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">{selectedTestimonial.position}, {selectedTestimonial.company}</p>
                    <div className="flex gap-1 mt-1.5">
                      {[...Array(selectedTestimonial.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Close button - Fixed in header, won't scroll */}
                <motion.button
                  onClick={() => setSelectedTestimonial(null)}
                  className="w-10 h-10 rounded-full bg-background border border-border/50 hover:bg-secondary flex items-center justify-center transition-colors duration-200 text-muted-foreground hover:text-foreground shrink-0 shadow-sm"
                  aria-label="Close"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 md:p-10 overflow-y-auto">
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  <Quote className="absolute -top-6 -left-4 w-12 h-12 text-primary/10 rotate-180" />
                  <blockquote className="text-foreground/90 leading-relaxed text-base md:text-lg italic font-serif relative z-10 pl-6 border-l-2 border-primary/20">
                    "{selectedTestimonial.content}"
                  </blockquote>
                </motion.div>
              </div>
              
              {/* Footer/Link (if available) */}
              {selectedTestimonial.website && (
                <motion.div 
                  className="p-6 bg-secondary/10 border-t border-border/40 flex justify-end"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <a 
                    href={selectedTestimonial.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300 font-medium text-sm shadow-md hover:shadow-primary/20"
                  >
                    Visit Project <ExternalLink className="w-4 h-4" />
                  </a>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
