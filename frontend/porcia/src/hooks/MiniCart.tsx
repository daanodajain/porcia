"use client";

import { X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui";
import Link from "next/link";

interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MiniCart({ isOpen, onClose }: MiniCartProps) {
  const { cart, itemCount, removeItem } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform bg-[var(--lux-bg)] shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          <header className="flex items-center justify-between border-b border-[var(--lux-border)] p-6">
            <h2 className="lux-h3">Shopping Cart ({itemCount})</h2>
            <button
              onClick={onClose}
              className="rounded-full border border-[var(--lux-border)] p-2 transition-all hover:bg-[var(--lux-surface)]"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </header>

          <div className="flex-grow overflow-y-auto p-6">
            {cart && cart.items.length > 0 ? (
              <ul className="grid gap-6">
                {cart.items.map((item) => (
                  <li key={item.id} className="flex gap-4">
                    <div className="h-24 w-24 flex-shrink-0 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="flex-grow">
                      <p className="font-medium">{item.productName}</p>
                      <p className="lux-small">Qty: {item.quantity}</p>
                      <p className="lux-small mt-1">EUR {item.totalPrice.toFixed(2)}</p>
                    </div>
                    <Button onClick={() => removeItem(item.id)} size="sm" variant="ghost">
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex h-full items-center justify-center text-center">
                <p>Your cart is empty.</p>
              </div>
            )}
          </div>

          {cart && cart.items.length > 0 && (
            <footer className="border-t border-[var(--lux-border)] p-6">
              <div className="flex justify-between text-lg font-medium">
                <span>Subtotal</span>
                <span>EUR {cart.subtotal.toFixed(2)}</span>
              </div>
              <Link href="/checkout" onClick={onClose}>
                <Button size="lg" className="mt-4 w-full">
                  Proceed to Checkout
                </Button>
              </Link>
            </footer>
          )}
        </div>
      </div>
    </>
  );
}
