"use client";

import { createContext, useState, ReactNode, useCallback, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Cart {
  id: number;
  items: CartItem[];
  subtotal: number;
  shippingCharge: number;
  discountAmount: number;
  grandTotal: number;
}

interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  isLoading: boolean;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  fetchCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/cart");
      setCart(response.data.data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      fetchCart();
    } else if (!isAuthLoading && !isAuthenticated) {
      setCart(null);
      setIsLoading(false);
    }
  }, [isAuthenticated, isAuthLoading, fetchCart]);

  const addToCart = useCallback(async (productId: number, quantity: number) => {
    try {
      const response = await api.post("/cart/items", { productId, quantity });
      setCart(response.data.data);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    }
  }, []);

  const updateItem = useCallback(async (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    try {
      const response = await api.put(`/cart/items/${itemId}`, { quantity });
      setCart(response.data.data);
    } catch (error) {
      console.error("Failed to update cart item:", error);
    }
  }, []);

  const removeItem = useCallback(async (itemId: number) => {
    try {
      const response = await api.delete(`/cart/items/${itemId}`);
      setCart(response.data.data);
    } catch (error) {
      console.error("Failed to remove cart item:", error);
    }
  }, []);

  const value = {
    cart,
    itemCount,
    isLoading,
    addToCart,
    updateItem,
    removeItem,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}