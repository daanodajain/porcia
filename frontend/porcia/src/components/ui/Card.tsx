import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "glass" | "outlined" | "luxury";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", padding = "md", hover = false, className = "", children, ...props }, ref) => {
    const baseStyles = "porcia-transition";
    
    const variants = {
      default: "bg-porcia-white border border-porcia-border",
      elevated: "bg-porcia-white shadow-porcia-shadow-soft",
      glass: "porcia-glass border border-porcia-border",
      outlined: "bg-transparent border border-porcia-fg",
      luxury: "bg-gradient-to-br from-porcia-ivory to-porcia-white shadow-porcia-shadow-luxury border border-porcia-gold/20",
    };
    
    const paddings = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
      xl: "p-12",
    };
    
    const hoverClass = hover ? "porcia-hover-lift cursor-pointer" : "";
    
    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${hoverClass} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
