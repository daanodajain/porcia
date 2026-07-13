"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { Container, MediaAsset } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { resolveBestMediaUrl } from "@/lib/media";

interface WishlistProduct {
  id: number;
  slug?: string;
  name: string;
  price?: number;
  salePrice?: number | null;
  images?: { url?: string; imageUrl?: string; alt?: string }[];
}

export function WishlistPageContent() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<WishlistProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    const loadWishlist = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/wishlist");
        setItems(response.data.data ?? []);
      } catch {
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, [authLoading, isAuthenticated]);

  if (authLoading || isLoading) {
    return (
      <Container className="py-24">
        <p className="text-xs uppercase tracking-[0.34em] text-[var(--porcia-text-muted)]">
          Loading wishlist
        </p>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container className="py-24">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.34em] text-[var(--porcia-text-muted)]">
            Wishlist
          </p>
          <h1 className="mt-5 font-serif text-[clamp(3rem,8vw,6rem)] font-light leading-none tracking-[-0.05em]">
            Save pieces privately.
          </h1>
          <p className="mt-6 text-base leading-8 text-[var(--porcia-text-secondary)]">
            Log in to keep a saved edit across visits.
          </p>
          <Link
            href="/login"
            className="mt-10 inline-flex rounded-full bg-[var(--porcia-black)] px-8 py-4 text-sm uppercase tracking-[0.28em] text-white"
          >
            Log in
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-24">
      <div className="mb-12 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.34em] text-[var(--porcia-text-muted)]">
          Wishlist
        </p>
        <h1 className="mt-5 font-serif text-[clamp(3rem,8vw,6rem)] font-light leading-none tracking-[-0.05em]">
          Your saved edit.
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[2rem] border border-[var(--porcia-border)] bg-white p-10">
          <Heart className="text-[var(--porcia-text-muted)]" strokeWidth={1.4} />
          <h2 className="mt-6 font-serif text-3xl font-light">No saved pieces yet.</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--porcia-text-secondary)]">
            Browse the shop and save products you want to revisit.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--porcia-black)] px-7 py-3 text-xs uppercase tracking-[0.28em] text-white"
          >
            <ShoppingBag size={14} />
            Open shop
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((product) => {
            const image = resolveBestMediaUrl(product.images?.[0]?.url ?? product.images?.[0]?.imageUrl);
            const href = `/product/${product.slug ?? product.id}`;
            const price = product.salePrice ?? product.price;

            return (
              <Link
                key={product.id}
                href={href}
                className="group overflow-hidden rounded-[2rem] border border-[var(--porcia-border)] bg-white"
              >
                <div className="relative aspect-[4/5] bg-[linear-gradient(180deg,#eadfd0,#b6a089)]">
                  {image ? (
                    <MediaAsset
                      src={image}
                      alt={product.images?.[0]?.alt ?? product.name}
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  ) : null}
                </div>
                <div className="p-6">
                  <h2 className="font-serif text-2xl font-light tracking-[-0.03em]">{product.name}</h2>
                  {typeof price === "number" ? (
                    <p className="mt-3 text-sm text-[var(--porcia-text-secondary)]">
                      ₹{price.toLocaleString("en-IN")}
                    </p>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </Container>
  );
}
