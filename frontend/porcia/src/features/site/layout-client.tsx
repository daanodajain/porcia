"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Container } from "@/components/ui";
import { LenisProvider } from "@/animation/LenisProvider";
import { MiniCart } from "@/hooks/MiniCart";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { type WordPressNavItem } from "@/lib/wordpress";

interface SiteChromeProps {
  children: ReactNode;
  navItems: WordPressNavItem[];
  footerItems: WordPressNavItem[];
}

// These are always in the nav — Shop is hardcoded as it's an app route
const SHOP_NAV = { href: "/shop", label: "Shop" };

// Account-related links shown in the mobile drawer secondary section
const accountNav = [
  { href: "/account", label: "Account" },
  { href: "/account/orders", label: "Orders" },
  { href: "/admin", label: "Admin" },
] as const;

function Header({
  navItems,
  onMenuOpen,
  onSearchOpen,
  onCartOpen,
}: {
  navItems: WordPressNavItem[];
  onMenuOpen: () => void;
  onSearchOpen: () => void;
  onCartOpen: () => void;
}) {
  const { isAuthenticated } = useAuth();
  const { itemCount } = useCart();

  // On desktop we show a curated short list inline — Collections, House, Journal, Lookbook + Shop
  const DESKTOP_NAV_SLUGS = ["collections", "house", "journal", "lookbook", "craft"];
  const desktopNav = [
    ...navItems.filter((item) => DESKTOP_NAV_SLUGS.includes(item.slug)),
    SHOP_NAV,
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--porcia-border)] bg-white/95 backdrop-blur-2xl">
      <Container>
        <div className="relative flex h-[4.5rem] items-center justify-between">

          {/* LEFT — desktop: nav links | mobile: hamburger */}
          <div className="flex items-center gap-8">
            {/* Mobile hamburger */}
            <button
              onClick={onMenuOpen}
              className="lg:hidden flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-[var(--porcia-text-muted)] transition hover:text-[var(--porcia-fg)]"
              aria-label="Open menu"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>

            {/* Desktop inline nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {desktopNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[10px] uppercase tracking-[0.32em] text-[var(--porcia-text-muted)] transition hover:text-[var(--porcia-fg)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* CENTER — Logo always centered */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 font-serif text-[1.4rem] tracking-[0.35em]"
          >
            PORCIA
          </Link>

          {/* RIGHT — icons */}
          <div className="flex items-center gap-5">
            <button onClick={onSearchOpen} className="transition hover:opacity-50" aria-label="Search">
              <Search size={18} strokeWidth={1.5} />
            </button>
            <Link href="/wishlist" className="hidden sm:block transition hover:opacity-50" aria-label="Wishlist">
              <Heart size={18} strokeWidth={1.5} />
            </Link>
            <Link href={isAuthenticated ? "/account" : "/login"} className="transition hover:opacity-50" aria-label="Account">
              <User size={18} strokeWidth={1.5} />
            </Link>
            <button onClick={onCartOpen} className="relative transition hover:opacity-50" aria-label="Cart">
              <ShoppingBag size={18} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-[1.1rem] w-[1.1rem] items-center justify-center rounded-full bg-[var(--porcia-black)] text-[9px] text-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
}

function MenuOverlay({
  open,
  navItems,
  footerItems,
  onClose,
}: {
  open: boolean;
  navItems: WordPressNavItem[];
  footerItems: WordPressNavItem[];
  onClose: () => void;
}) {
  const allMainLinks = [...navItems, SHOP_NAV];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-white overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Container>
            <div className="flex h-[4.5rem] items-center justify-between">
              <Link
                href="/"
                onClick={onClose}
                className="font-serif text-[1.4rem] tracking-[0.35em]"
              >
                PORCIA
              </Link>
              <button onClick={onClose} className="transition hover:opacity-50" aria-label="Close menu">
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>
          </Container>

          <Container>
            <div className="pb-16 pt-8">
              {/* Primary navigation */}
              <nav className="space-y-1">
                {allMainLinks.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="block py-3 font-serif text-[clamp(2rem,6vw,3.5rem)] font-light leading-tight tracking-[-0.03em] transition-opacity hover:opacity-40"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Divider */}
              <div className="my-10 border-t border-[var(--porcia-border)]" />

              {/* Footer info links — small, secondary */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {footerItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="text-sm text-[var(--porcia-text-secondary)] transition hover:text-[var(--porcia-fg)]"
                  >
                    {item.label}
                  </Link>
                ))}
                {accountNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="text-sm text-[var(--porcia-text-secondary)] transition hover:text-[var(--porcia-fg)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SearchDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="porcia-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-0 right-0 top-0 z-50 border-b border-[var(--porcia-border)] bg-white"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Container>
              <div className="flex items-center gap-4 py-8">
                <Search size={22} strokeWidth={1.5} className="text-[var(--porcia-text-muted)]" />
                <input
                  type="search"
                  placeholder="Search products, collections…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent font-serif text-[clamp(1.6rem,3vw,2.8rem)] font-light outline-none"
                  autoFocus
                />
                <button onClick={onClose} className="transition hover:opacity-50" aria-label="Close search">
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>
            </Container>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Footer({ navItems, footerItems }: { navItems: WordPressNavItem[]; footerItems: WordPressNavItem[] }) {
  return (
    <footer className="border-t border-[var(--porcia-border)] bg-[linear-gradient(180deg,#fff_0%,#f7f2ec_100%)]">
      <Container>
        <div className="grid gap-12 py-20 md:grid-cols-4">
          <div className="md:col-span-2">
            <span className="mb-4 block font-serif text-[1.4rem] tracking-[0.35em]">PORCIA</span>
            <p className="max-w-xs text-sm leading-7 text-[var(--porcia-text-secondary)]">
              Luxury clothing crafted with intention.
            </p>
          </div>

          <div>
            <p className="mb-5 text-[10px] uppercase tracking-[0.3em] text-[var(--porcia-text-muted)]">Explore</p>
            <div className="space-y-3">
              {[...navItems, SHOP_NAV].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-sm text-[var(--porcia-text-secondary)] transition hover:text-[var(--porcia-fg)]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-5 text-[10px] uppercase tracking-[0.3em] text-[var(--porcia-text-muted)]">Information</p>
            <div className="space-y-3">
              {footerItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-sm text-[var(--porcia-text-secondary)] transition hover:text-[var(--porcia-fg)]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--porcia-border)] py-8 md:flex-row">
          <p className="text-sm text-[var(--porcia-text-muted)]">
            © {new Date().getFullYear()} Porcia. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}

export function SiteChrome({ children, navItems, footerItems }: SiteChromeProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <LenisProvider>
      <Header
        navItems={navItems}
        onMenuOpen={() => setMenuOpen(true)}
        onSearchOpen={() => setSearchOpen(true)}
        onCartOpen={() => setCartOpen(true)}
      />
      <main className="min-h-screen">{children}</main>
      <Footer navItems={navItems} footerItems={footerItems} />

      <MenuOverlay
        open={menuOpen}
        navItems={navItems}
        footerItems={footerItems}
        onClose={() => setMenuOpen(false)}
      />
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MiniCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </LenisProvider>
  );
}
