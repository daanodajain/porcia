import { type ReactNode } from "react";
import { AppProviders } from "@/providers/AppProviders";
import "@/app/globals.css";

export const metadata = {
  title: "PORCIA",
  description: "Luxury clothing crafted with intention.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans bg-[var(--porcia-bg)] text-[var(--porcia-fg)] min-h-screen">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
