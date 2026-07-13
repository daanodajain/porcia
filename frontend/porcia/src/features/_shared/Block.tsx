import type { ReactNode } from "react";
import { Container } from "@/components/ui";

export function Block({ title, children, className = "" }: { title: string; children?: ReactNode; className?: string }) {
  return <section className={className}><Container><div className="lux-card rounded-[var(--lux-r-3)] p-6"><p className="lux-small lux-mono mb-3 uppercase tracking-[0.3em]">{title}</p>{children}</div></Container></section>;
}

export const makeBlock = (title: string) => function BlockShell() { return <Block title={title} />; };
