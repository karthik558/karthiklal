"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
        <img
          src={testimonial.imgSrc}
          alt={`${testimonial.by.split(',')[0]}`}
          className="mb-4 h-14 w-12 bg-muted object-cover object-top"
          style={{
            boxShadow: "3px 3px 0px hsl(var(--background))"
          }}
        />
        <h3 className={cn(
          "text-base sm:text-lg font-medium overflow-hidden",
          isCenter ? "text-primary-foreground" : "text-foreground"
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
            className="absolute bottom-14 right-8 w-6 h-6 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 flex items-center justify-center transition-all duration-200 group"
            aria-label="Read full testimonial"
          >
            <span className="text-xs font-bold text-primary-foreground group-hover:scale-110 transition-transform">⋯</span>
          </button>
        )}
        
        <p className={cn(
          "absolute bottom-8 left-8 right-8 mt-2 text-sm italic",
          isCenter ? "text-primary-foreground/80" : "text-muted-foreground"
        )}>
          - {testimonial.by}
        </p>
      </div>

      {/* Modal for full testimonial */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal content */}
          <div className="relative bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors z-10"
              aria-label="Close"
            >
              <span className="text-muted-foreground text-lg">×</span>
            </button>
            
            <div className="pr-8">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={testimonial.imgSrc}
                  alt={testimonial.by}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">{testimonial.by}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Client Testimonial</p>
                </div>
              </div>
              
              <blockquote className="text-foreground leading-relaxed text-sm sm:text-base mb-4">
                "{testimonial.testimonial}"
              </blockquote>
              
              <div className="text-xs sm:text-sm text-muted-foreground italic">
                - {testimonial.by}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

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
