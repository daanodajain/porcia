import { HTMLAttributes, forwardRef } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "default" | "narrow" | "wide";
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = "default", className = "", children, ...props }, ref) => {
    const sizeClasses = {
      default: "porcia-container",
      narrow: "porcia-container porcia-container-narrow",
      wide: "porcia-container porcia-container-wide",
    };
    
    return (
      <div ref={ref} className={`${sizeClasses[size]} ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";
