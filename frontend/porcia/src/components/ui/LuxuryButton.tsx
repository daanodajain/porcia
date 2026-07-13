"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface LuxuryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function LuxuryButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
}: LuxuryButtonProps) {
  const baseStyles =
    "relative overflow-hidden font-medium tracking-wider uppercase transition-all duration-300";

  const variantStyles = {
    primary:
      "bg-porcia-black text-porcia-white hover:bg-porcia-charcoal active:scale-95",
    secondary:
      "bg-porcia-ivory text-porcia-black border border-porcia-border hover:bg-porcia-white",
    ghost:
      "text-porcia-black border border-porcia-border hover:bg-porcia-ivory/50",
    gold: "bg-porcia-gold text-porcia-white hover:bg-porcia-gold-dark",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Luxury shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
        animate={{ x: ["100%", "-100%"] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
