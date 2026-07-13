import type { ReactNode } from "react";
import { ratio } from "@/design-system";

const classMap = { square: "lux-ratio-square", portrait: "lux-ratio-portrait", card: "lux-ratio-card", wide: "lux-ratio-wide", cinema: "lux-ratio-cinema" } as const;

export function MediaFrame({ children, className = "", aspect = "card" }: { children: ReactNode; className?: string; aspect?: keyof typeof ratio }) {
  return <div className={[classMap[aspect], className].join(" ")}>{children}</div>;
}
