"use client";

import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { getStoredCustomerToken } from "@/config/auth";

interface WishlistButtonProps {
  productId: number;
  isAuthenticated: boolean;
}

export function WishlistButton({ productId, isAuthenticated }: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const checkWishlist = async () => {
      try {
        const token = getStoredCustomerToken();
        const res = await api.get("/wishlist", { headers: { Authorization: `Bearer ${token}` } });
        const wishlistIds = (res.data.data ?? []).map((p: { id: number }) => p.id);
        setIsInWishlist(wishlistIds.includes(productId));
      } catch {
        setIsInWishlist(false);
      }
    };

    checkWishlist();
  }, [productId, isAuthenticated]);

  const handleToggle = async () => {
    if (!isAuthenticated) {
      alert("Please log in to use wishlist");
      return;
    }

    setIsLoading(true);
    try {
      const token = getStoredCustomerToken();
      if (isInWishlist) {
        await api.delete(`/wishlist/${productId}`, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await api.post(`/wishlist/${productId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      }
      setIsInWishlist(!isInWishlist);
    } catch {
      alert("Error updating wishlist");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 border border-[var(--lux-border)] rounded-lg hover:border-[var(--lux-fg)] transition disabled:opacity-50"
      title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        size={18}
        className={isInWishlist ? "fill-current text-red-500" : ""}
      />
      <span className="text-sm font-medium">
        {isInWishlist ? "Saved" : "Save"}
      </span>
    </button>
  );
}
