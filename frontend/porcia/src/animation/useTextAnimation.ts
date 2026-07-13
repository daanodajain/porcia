"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TextAnimationOptions {
  type?: "words" | "chars" | "lines";
  duration?: number;
  stagger?: number;
  ease?: string;
  delay?: number;
  triggerOnScroll?: boolean;
}

export function useTextAnimation(options: TextAnimationOptions = {}) {
  const {
    type = "words",
    duration = 0.6,
    stagger = 0.05,
    ease = "power2.out",
    delay = 0,
    triggerOnScroll = true,
  } = options;

  const textRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const element = textRef.current;
    const text = element.textContent || "";

    // Split text based on type
    let splitText: string[];
    if (type === "words") {
      splitText = text.split(" ");
    } else if (type === "chars") {
      splitText = text.split("");
    } else {
      splitText = text.split("\n");
    }

    // Clear and rebuild with spans
    element.innerHTML = splitText
      .map((item) => `<span class="inline-block" style="opacity: 0;">${item}</span>`)
      .join(type === "words" || type === "lines" ? " " : "");

    const spans = element.querySelectorAll("span");

    const animationConfig = {
      opacity: 1,
      duration,
      stagger,
      ease,
      delay,
    };

    if (triggerOnScroll) {
      gsap.to(spans, {
        ...animationConfig,
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    } else {
      gsap.to(spans, animationConfig);
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [type, duration, stagger, ease, delay, triggerOnScroll]);

  return textRef;
}
