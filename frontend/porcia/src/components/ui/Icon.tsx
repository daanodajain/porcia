import * as React from "react";
import type { LucideIcon } from "lucide-react";

export function Icon({
  IconComponent,
  className = "",
  size = 20,
}: {
  IconComponent: LucideIcon;
  className?: string;
  size?: number;
}) {
  return <IconComponent className={className} size={size} strokeWidth={1.75} />;
}
