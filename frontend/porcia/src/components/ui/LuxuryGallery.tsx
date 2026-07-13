"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "@/animation/useScrollReveal";
import Image from "next/image";

interface GalleryItem {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
}

interface LuxuryGalleryProps {
  items: GalleryItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function LuxuryGallery({
  items,
  columns = 3,
  className = "",
}: LuxuryGalleryProps) {
  const containerRef = useScrollReveal({
    duration: 0.8,
    stagger: 0.15,
    distance: 50,
    direction: "up",
  });

  const gridColsMap = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };

  return (
    <div
      ref={containerRef}
      className={`grid grid-cols-1 gap-6 ${gridColsMap[columns]} ${className}`}
    >
      {items.map((item) => (
        <motion.div
          key={item.id}
          data-reveal
          className="group cursor-pointer"
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {/* Image Container */}
          <div className="relative overflow-hidden rounded-sm mb-4 aspect-square bg-porcia-ivory">
            <motion.div
              className="w-full h-full"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>

            {/* Overlay */}
            <motion.div
              className="absolute inset-0 bg-porcia-black/0 flex items-center justify-center"
              whileHover={{ backgroundColor: "rgba(0,0,0,0.2)" }}
              transition={{ duration: 0.3 }}
            >
              <motion.span
                className="text-porcia-white text-sm font-medium tracking-wider uppercase"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                Explore
              </motion.span>
            </motion.div>
          </div>

          {/* Text */}
          <motion.div
            animate={{ y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-sm font-medium mb-1">{item.title}</h3>
            {item.subtitle && (
              <p className="text-xs text-porcia-text-muted">{item.subtitle}</p>
            )}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
