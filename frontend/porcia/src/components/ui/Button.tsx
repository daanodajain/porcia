import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "luxury";
  size?: "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", fullWidth = false, className = "", children, disabled, ...props }, ref) => {
    const baseStyles = "porcia-btn-base porcia-focus inline-flex items-center justify-center font-medium transition-all duration-250";
    
    const variants = {
      primary: "bg-porcia-black text-porcia-white hover:bg-porcia-charcoal active:scale-[0.98]",
      secondary: "bg-porcia-gold text-porcia-white hover:bg-porcia-gold-dark active:scale-[0.98]",
      outline: "border border-porcia-border bg-transparent hover:bg-porcia-ivory hover:border-porcia-fg active:scale-[0.98]",
      ghost: "bg-transparent hover:bg-porcia-border-light active:scale-[0.98]",
      luxury: "bg-gradient-to-br from-porcia-gold-light to-porcia-gold text-porcia-white shadow-lg hover:shadow-xl active:scale-[0.98]",
    };
    
    const sizes = {
      sm: "h-9 px-4 text-sm gap-2",
      md: "h-11 px-6 text-base gap-2",
      lg: "h-13 px-8 text-base gap-3",
      xl: "h-16 px-10 text-lg gap-3",
    };
    
    const widthClass = fullWidth ? "w-full" : "";
    
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
