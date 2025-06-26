"use client"

import { Component } from "@/components/ui/circular-gallery";

const demoItems = [
  {
    image: `https://picsum.photos/seed/1/800/600?grayscale`,
    text: "Bridge",
  },
  {
    image: `https://picsum.photos/seed/2/800/600?grayscale`,
    text: "Desk Setup",
  },
  {
    image: `https://picsum.photos/seed/3/800/600?grayscale`,
    text: "Waterfall",
  },
  {
    image: `https://picsum.photos/seed/4/800/600?grayscale`,
    text: "Strawberries",
  },
  {
    image: `https://picsum.photos/seed/5/800/600?grayscale`,
    text: "Deep Diving",
  },
  {
    image: `https://picsum.photos/seed/16/800/600?grayscale`,
    text: "Train Track",
  },
  {
    image: `https://picsum.photos/seed/17/800/600?grayscale`,
    text: "Santorini",
  },
  {
    image: `https://picsum.photos/seed/8/800/600?grayscale`,
    text: "Blurry Lights",
  },
  {
    image: `https://picsum.photos/seed/9/800/600?grayscale`,
    text: "New York",
  },
  {
    image: `https://picsum.photos/seed/10/800/600?grayscale`,
    text: "Good Boy",
  },
  {
    image: `https://picsum.photos/seed/21/800/600?grayscale`,
    text: "Coastline",
  },
  {
    image: `https://picsum.photos/seed/12/800/600?grayscale`,
    text: "Palm Trees",
  },
];

const DemoOne = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center bg-black">
      <div 
        className="w-full max-w-screen-xl mx-auto h-[80vh] overflow-hidden relative bg-black border-none shadow-none"
      >
        <Component 
          items={demoItems} 
          bend={3} 
          textColor="#ffffff" 
          borderRadius={0.05} 
        />
      </div>
    </div>
  );
};

export { DemoOne };
