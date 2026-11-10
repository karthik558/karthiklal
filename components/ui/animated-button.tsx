"use client";

import React from "react";
import { buttonVariants } from "@/components/ui/button";
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

  const baseStyles = "group";
  
  // Primary: Solid fill -> Inverts cleanly on hover
  const primaryStyles = buttonVariants({ variant: "default" });
  
  // Outline: Glass/Card fill -> Inverts cleanly on hover
  const outlineStyles = buttonVariants({ variant: "outline" });

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

export default AnimatedButton;
