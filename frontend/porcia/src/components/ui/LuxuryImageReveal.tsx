"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

interface LuxuryImageRevealProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  duration?: number;
  delay?: number;
}

export function LuxuryImageReveal({
  src,
  alt,
  width = 800,
  height = 600,
  className = "",
  duration = 1,
  delay = 0,
}: LuxuryImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !imageRef.current) return;

    gsap.fromTo(
      imageRef.current,
      {
        opacity: 0,
        scale: 1.05,
        clipPath: "inset(0 0 100% 0)",
      },
      {
        opacity: 1,
        scale: 1,
        clipPath: "inset(0 0 0% 0)",
        duration,
        delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [duration, delay]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      style={{ aspectRatio: `${width}/${height}` }}
    >
      <div ref={imageRef} className="w-full h-full">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-full object-cover"
          priority={false}
        />
      </div>
    </div>
  );
}
