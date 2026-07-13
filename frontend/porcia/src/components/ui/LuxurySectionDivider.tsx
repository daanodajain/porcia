"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "@/animation/useScrollReveal";

interface LuxurySectionDividerProps {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  className?: string;
}

export function LuxurySectionDivider({
  title,
  subtitle,
  eyebrow,
  className = "",
}: LuxurySectionDividerProps) {
  const containerRef = useScrollReveal({
    duration: 0.8,
    distance: 40,
    direction: "up",
  });

  return (
    <motion.section
      ref={containerRef}
      className={`py-16 md:py-24 border-t border-b border-porcia-border ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        {eyebrow && (
          <motion.p
            data-reveal
            className="text-xs uppercase tracking-[0.2em] text-porcia-text-muted mb-4"
          >
            {eyebrow}
          </motion.p>
        )}

        {title && (
          <motion.h2
            data-reveal
            className="text-3xl md:text-5xl font-light tracking-tight mb-4 text-porcia-fg"
          >
            {title}
          </motion.h2>
        )}

        {subtitle && (
          <motion.p
            data-reveal
            className="text-base md:text-lg text-porcia-text-secondary leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Decorative line */}
        <motion.div
          className="w-12 h-px bg-porcia-gold mx-auto mt-8"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        />
      </div>
    </motion.section>
  );
}
