"use client";

import Link from "next/link";
import { Button, Card, Container } from "@/components/ui";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function CartPageContent() {
  const { cart, updateItem, removeItem, isLoading } = useCart();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  if (isLoading || isAuthLoading) {
    return (
      <Container className="py-24">
        <p>Loading cart...</p>
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container className="py-24 text-center">
        <h1 className="lux-h2">Your Cart is Empty</h1>
        <p className="lux-lead mt-4">Looks like you haven&apos;t added anything to your cart yet.</p>
        <Button onClick={() => router.push("/shop")} className="mt-8">
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-24">
      <h1 className="lux-h1">Shopping Cart</h1>
      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_400px]">
        <div className="grid gap-8 divide-y divide-[var(--lux-border)]">
          {cart.items.map((item) => (
            <div key={item.id} className="flex gap-6 pt-8 first:pt-0">
              <div className="h-32 w-32 flex-shrink-0 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="flex-grow">
                <h3 className="text-lg font-medium">{item.productName}</h3>
                <p className="lux-small">SKU: {item.productSku}</p>
                <p className="mt-2 font-semibold">EUR {item.unitPrice.toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <p className="text-lg font-bold">EUR {item.totalPrice.toFixed(2)}</p>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, parseInt(e.target.value, 10))}
                    className="h-10 w-20 rounded-full border border-[var(--lux-border)] bg-transparent px-3 text-center outline-none"
                  />
                  <Button onClick={() => removeItem(item.id)} variant="ghost" size="sm">
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="self-start lg:sticky lg:top-36">
          <Card className="p-8">
            <h2 className="lux-h3">Order Summary</h2>
            <div className="mt-6 grid gap-3 border-y border-[var(--lux-border)] py-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>EUR {cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>EUR {cart.shippingCharge.toFixed(2)}</span>
              </div>
              {cart.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-EUR {cart.discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-between text-xl font-bold">
              <span>Grand Total</span>
              <span>EUR {cart.grandTotal.toFixed(2)}</span>
            </div>
            <Link href="/checkout">
              <Button size="lg" className="mt-8 w-full">Proceed to Checkout</Button>
            </Link>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
