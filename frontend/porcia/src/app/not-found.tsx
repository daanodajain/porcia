"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--porcia-bg)] text-[var(--porcia-fg)] px-4 text-center">
      <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--porcia-text-muted)] mb-4">404 — Page Not Found</p>
      <h1 className="font-serif text-3xl md:text-4xl font-light tracking-tight mb-8 text-[var(--porcia-fg)] max-w-md leading-relaxed">
        The page you are looking for does not exist.
      </h1>
      <Link
        href="/"
        className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--porcia-black)] text-white px-8 text-[10px] uppercase tracking-[0.3em] hover:opacity-80 transition-opacity"
      >
        Return Home
      </Link>
    </div>
  );
}
