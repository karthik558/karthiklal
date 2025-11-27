"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import SmoothLink from "@/components/smooth-link";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "outline";
  className?: string;
  icon?: React.ReactNode;
}

export const AnimatedButton = ({
  children,
  href,
  variant = "primary",
  className,
  icon,
  ...props
}: AnimatedButtonProps) => {
  const isPrimary = variant === "primary";

  const baseStyles = "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 text-base font-medium transition-all duration-300 hover:scale-105 active:scale-95";
  
  // Primary: Gradient background or solid primary with glow
  const primaryStyles = "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 border border-primary/20";
  
  // Outline: Glassmorphism style
  const outlineStyles = "border border-primary/20 bg-background/50 backdrop-blur-sm text-foreground hover:border-primary/50 hover:bg-primary/5";

  const content = (
    <>
      {/* Gradient overlay for primary */}
      {isPrimary && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
      )}
      
      <span className="relative z-10 flex items-center gap-2">
        {children}
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          {icon === undefined ? <ArrowRight className="h-4 w-4" /> : icon}
        </span>
      </span>
    </>
  );

  if (href) {
    if (href.startsWith("/#")) {
      return (
        <SmoothLink href={href} className={cn(baseStyles, isPrimary ? primaryStyles : outlineStyles, className)}>
          {content}
        </SmoothLink>
      );
    }
    return (
      <Link href={href} className={cn(baseStyles, isPrimary ? primaryStyles : outlineStyles, className)}>
        {content}
      </Link>
    );
  }

  return (
    <button className={cn(baseStyles, isPrimary ? primaryStyles : outlineStyles, className)} {...props}>
      {content}
    </button>
  );
};
