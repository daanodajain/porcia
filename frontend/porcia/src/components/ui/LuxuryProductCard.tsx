"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";

interface LuxuryProductCardProps {
  name: string;
  price: string;
  image: string;
  note?: string;
  onWishlist?: () => void;
  isWishlisted?: boolean;
}

export function LuxuryProductCard({
  name,
  price,
  image,
  note,
  onWishlist,
  isWishlisted = false,
}: LuxuryProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="group cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-sm mb-4 aspect-square bg-porcia-ivory">
        <motion.div
          className="w-full h-full"
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </motion.div>

        {/* Overlay Actions */}
        <motion.div
          className="absolute inset-0 bg-porcia-black/0 flex items-center justify-center"
          animate={{ backgroundColor: isHovered ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0)" }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            className="px-6 py-2 bg-porcia-white text-porcia-black text-xs font-medium tracking-wider uppercase"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.3 }}
          >
            View Details
          </motion.button>
        </motion.div>

        {/* Wishlist Button */}
        <motion.button
          onClick={onWishlist}
          className="absolute top-4 right-4 p-2 rounded-full bg-porcia-white/90 backdrop-blur-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart
            size={18}
            className={isWishlisted ? "fill-porcia-error text-porcia-error" : "text-porcia-black"}
          />
        </motion.button>
      </div>

      {/* Product Info */}
      <motion.div
        animate={{ y: isHovered ? -4 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-xs uppercase tracking-wider text-porcia-text-muted mb-2">
          {note || "New Arrival"}
        </p>
        <h3 className="text-sm font-medium mb-2 line-clamp-2">{name}</h3>
        <p className="text-sm font-medium text-porcia-gold">{price}</p>
      </motion.div>
    </motion.div>
  );
}
