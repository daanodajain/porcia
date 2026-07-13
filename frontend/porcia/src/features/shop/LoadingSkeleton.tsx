export function LoadingSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-[var(--lux-r-3)]">
          <div className="lux-ratio-card animate-pulse bg-[var(--lux-card)]" />
        </div>
      ))}
    </div>
  );
}