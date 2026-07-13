"use client";

import * as React from "react";
import gsap from "gsap";

export function useGsapTimeline() {
  const ctxRef = React.useRef<gsap.Context | null>(null);

  React.useEffect(() => {
    return () => {
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  }, []);

  return function createTimeline(scope: HTMLElement | null) {
    const ctx = gsap.context(() => {}, scope ?? undefined);
    ctxRef.current = ctx;
    return gsap.timeline({ defaults: { ease: "power3.out", duration: 0.4 } });
  };
}
