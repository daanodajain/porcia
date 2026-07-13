"use client";

import { Card } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/account", label: "My Profile" },
  { href: "/account/orders", label: "My Orders" },
  { href: "/account/addresses", label: "My Addresses" },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="grid gap-6 self-start">
      <Card className="p-6">
        <nav className="grid gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm ${pathname === link.href ? "font-semibold text-[var(--lux-fg)]" : "text-[var(--lux-muted)]"}`}
            >
              {link.label}
            </Link>
          ))}
          <button onClick={logout} className="mt-4 w-full text-left text-sm text-[var(--lux-muted)]">
            Logout
          </button>
        </nav>
      </Card>
    </aside>
  );
}
