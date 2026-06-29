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

function FlowerSeparator() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 512 512"
      className="mx-5 h-[0.62em] w-[0.62em] shrink-0 opacity-70 md:mx-7"
      fill="currentColor"
    >
      <path d="M256.004,222.135c-18.702,0-33.868,15.166-33.868,33.868c0,18.694,15.166,33.86,33.868,33.86 c18.695,0,33.86-15.166,33.86-33.86C289.864,237.302,274.698,222.135,256.004,222.135z" />
      <path d="M237.354,196.038c2.05,8.402,9.618,14.648,18.65,14.648c9.024,0,16.592-6.246,18.65-14.648l37.344-123.4 c1.239-4.715,1.9-9.648,1.9-14.738c0-31.983-25.917-57.9-57.893-57.9c-31.976,0-57.9,25.917-57.9,57.9 c0,5.09,0.668,10.023,1.899,14.738L237.354,196.038z" />
      <path d="M274.653,315.946c-2.057-8.401-9.626-14.632-18.65-14.632c-9.032,0-16.6,6.231-18.65,14.632l-37.352,123.422 c-1.231,4.708-1.899,9.64-1.899,14.738c0,31.969,25.924,57.894,57.9,57.894c31.976,0,57.893-25.925,57.893-57.894 c0-5.098-0.66-10.03-1.9-14.738L274.653,315.946z" />
      <path d="M86.746,165.932l113.669,60.859c7.403,4.482,17.164,3.559,23.552-2.823c6.382-6.396,7.313-16.15,2.831-23.552 L165.939,86.746c-2.456-4.197-5.473-8.161-9.085-11.765c-22.606-22.614-59.26-22.614-81.874,0 c-22.614,22.606-22.614,59.267,0,81.873C78.585,160.451,82.549,163.484,86.746,165.932z" />
      <path d="M425.254,346.061l-113.67-60.859c-7.395-4.49-17.155-3.552-23.537,2.83c-6.396,6.396-7.327,16.15-2.845,23.552 l60.866,113.67c2.455,4.204,5.466,8.161,9.076,11.756c22.614,22.615,59.268,22.615,81.874,0c22.621-22.598,22.614-59.26,0-81.866 C433.415,351.542,429.466,348.516,425.254,346.061z" />
      <path d="M196.046,274.653c8.402-2.057,14.64-9.626,14.64-18.65c0-9.032-6.239-16.6-14.64-18.658L72.638,200.002 c-4.714-1.238-9.648-1.899-14.738-1.899c-31.976,0-57.9,25.924-57.9,57.9c0,31.976,25.925,57.893,57.9,57.893 c5.09,0,10.024-0.668,14.738-1.9L196.046,274.653z" />
      <path d="M454.106,198.103c-5.098,0-10.03,0.66-14.738,1.899l-123.414,37.344c-8.394,2.058-14.64,9.626-14.64,18.658 c0,9.024,6.246,16.592,14.64,18.65l123.414,37.344c4.708,1.232,9.64,1.9,14.738,1.9c31.976,0,57.894-25.917,57.894-57.893 C512,224.02,486.083,198.103,454.106,198.103z" />
      <path d="M223.967,288.032c-6.389-6.382-16.15-7.32-23.552-2.83L86.746,346.061c-4.197,2.455-8.161,5.481-11.765,9.084 c-22.614,22.606-22.614,59.268,0,81.866c22.614,22.615,59.268,22.615,81.874,0c3.596-3.596,6.629-7.552,9.077-11.756l60.866-113.67 C231.28,304.182,230.349,294.428,223.967,288.032z" />
      <path d="M288.047,223.953c6.382,6.396,16.142,7.32,23.537,2.838l113.67-60.851c4.212-2.456,8.161-5.474,11.764-9.085 c22.614-22.606,22.621-59.267,0-81.873c-22.606-22.614-59.267-22.614-81.874,0c-3.611,3.604-6.622,7.568-9.076,11.765 l-60.866,113.669C280.72,207.818,281.651,217.571,288.047,223.953z" />
    </svg>
  )
}

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
  const items = children.split("•").map((item) => item.trim()).filter(Boolean);

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

  const sequence = (
    <span className="mr-8 inline-flex items-center md:mr-12 lg:mr-16">
      {items.map((item, index) => (
        <span key={`${item}-${index}`} className="inline-flex items-center">
          <span>{item}</span>
          {index < items.length - 1 ? <FlowerSeparator /> : null}
        </span>
      ))}
    </span>
  )

  return (
    <div className="overflow-hidden w-full text-nowrap flex-nowrap flex relative">
      <motion.div
        className={cn(
          "font-bold uppercase text-4xl md:text-5xl lg:text-6xl flex flex-nowrap text-nowrap whitespace-nowrap",
          className
        )}
        style={{ x }}
      >
        {sequence}
        {sequence}
        {sequence}
        {sequence}
        {sequence}
      </motion.div>
    </div>
  );
}

export { MarqueeAnimation };
