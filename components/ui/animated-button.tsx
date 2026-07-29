"use client";

import React from "react";
import Link from "next/link";
import SmoothLink from "@/components/smooth-link";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/ui/magnetic-button";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  variant?: "primary" | "outline";
  className?: string;
  icon?: React.ReactNode;
}

export const AnimatedButton = ({
  children,
  href,
  target,
  rel,
  variant = "primary",
  className,
  icon,
  ...props
}: AnimatedButtonProps) => {
  const isPrimary = variant === "primary";

  const baseStyles = "group inline-flex items-center justify-center gap-2 rounded-none px-6 py-3.5 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 select-none cursor-pointer";
  
  // Primary: Solid fill -> Inverts cleanly on hover
  const primaryStyles = "border-2 border-foreground bg-foreground text-background hover:bg-background hover:text-foreground";
  
  // Outline: Glass/Card fill -> Inverts cleanly on hover
  const outlineStyles = "border-2 border-border bg-card text-foreground hover:border-foreground hover:bg-foreground hover:text-background";

  const content = (
    <span className="relative z-10 flex items-center gap-2 text-inherit">
      {icon}
      {children}
    </span>
  );

  const isExternal = href?.startsWith("http");

  let element: React.ReactNode;

  if (href) {
    if (href.startsWith("/#")) {
      element = (
        <SmoothLink href={href} className={cn(baseStyles, isPrimary ? primaryStyles : outlineStyles, className)}>
          {content}
        </SmoothLink>
      );
    } else if (isExternal) {
      element = (
        <a href={href} target={target} rel={rel} className={cn(baseStyles, isPrimary ? primaryStyles : outlineStyles, className)}>
          {content}
        </a>
      );
    } else {
      element = (
        <Link href={href} target={target} rel={rel} className={cn(baseStyles, isPrimary ? primaryStyles : outlineStyles, className)}>
          {content}
        </Link>
      );
    }
  } else {
    element = (
      <button className={cn(baseStyles, isPrimary ? primaryStyles : outlineStyles, className)} {...props}>
        {content}
      </button>
    );
  }

  return <MagneticButton>{element}</MagneticButton>;
};
