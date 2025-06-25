"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import { wrap } from "@motionone/utils";
import { cn } from "@/lib/utils";

type MarqueeAnimationProps = {
  children: string;
  className?: string;
  direction?: "left" | "right";
  baseVelocity: number;
};

function MarqueeAnimation({
  children,
  className,
  direction = "left",
  baseVelocity = 10,
}: MarqueeAnimationProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 0], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (direction == "left") {
      directionFactor.current = 1;
    } else if (direction == "right") {
      directionFactor.current = -1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden w-full text-nowrap flex-nowrap flex relative">
      <motion.div
        className={cn(
          "font-bold uppercase text-4xl md:text-5xl lg:text-6xl flex flex-nowrap text-nowrap whitespace-nowrap",
          className
        )}
        style={{ x }}
      >
        <span className="block mr-8 md:mr-12 lg:mr-16">{children}</span>
        <span className="block mr-8 md:mr-12 lg:mr-16">{children}</span>
        <span className="block mr-8 md:mr-12 lg:mr-16">{children}</span>
        <span className="block mr-8 md:mr-12 lg:mr-16">{children}</span>
        <span className="block mr-8 md:mr-12 lg:mr-16">{children}</span>
      </motion.div>
    </div>
  );
}

export { MarqueeAnimation };
