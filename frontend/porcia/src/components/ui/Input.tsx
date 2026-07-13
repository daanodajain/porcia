import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: "default" | "luxury";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, variant = "default", className = "", ...props }, ref) => {
    const baseStyles = "w-full bg-transparent porcia-focus transition-all duration-250";
    
    const variants = {
      default: "h-12 px-4 border border-porcia-border hover:border-porcia-fg focus:border-porcia-fg",
      luxury: "h-14 px-5 border-b-2 border-porcia-border hover:border-porcia-gold focus:border-porcia-gold",
    };
    
    const errorClass = error ? "border-porcia-error" : "";
    
    return (
      <div className="w-full">
        {label && (
          <label className="porcia-label block mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`${baseStyles} ${variants[variant]} ${errorClass} ${className}`}
          {...props}
        />
        {error && (
          <p className="porcia-body-sm text-porcia-error mt-2">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
