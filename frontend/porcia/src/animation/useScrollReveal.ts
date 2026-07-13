"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
  distance?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const {
    duration = 0.8,
    delay = 0,
    stagger = 0.1,
    ease = "power2.out",
    distance = 60,
    direction = "up",
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll("[data-reveal]");
    if (elements.length === 0) return;

    const directionMap = {
      up: { y: distance, x: 0 },
      down: { y: -distance, x: 0 },
      left: { x: distance, y: 0 },
      right: { x: -distance, y: 0 },
    };

    const fromValues = directionMap[direction];

    gsap.fromTo(
      elements,
      {
        opacity: 0,
        ...fromValues,
      },
      {
        opacity: 1,
        y: 0,
        x: 0,
        duration,
        delay,
        stagger,
        ease,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [duration, delay, stagger, ease, distance, direction]);

  return containerRef;
}
