export function LoadingFallback({ label = "Loading…" }: { label?: string }) {
  return <div className="lux-container py-12"><div className="lux-small lux-mono">{label}</div></div>;
}
