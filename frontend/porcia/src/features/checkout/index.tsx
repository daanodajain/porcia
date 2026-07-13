"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Container, Button } from "@/components/ui";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";

interface Address {
  id: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  isDefault: boolean;
}

type Step = "cart" | "address" | "payment";

export function CheckoutPageContent() {
  const router = useRouter();
  const { cart, updateItem, removeItem, isLoading: cartLoading } = useCart();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState<Step>("cart");
  const [showSuccess, setShowSuccess] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/customer");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (step === "address" && isAuthenticated) {
      api.get("/customer/addresses").then(res => {
        const addrs: Address[] = res.data.data || [];
        setAddresses(addrs);
        const def = addrs.find(a => a.isDefault);
        if (def) setSelectedAddressId(def.id);
      }).catch(() => setAddresses([]));
    }
  }, [step, isAuthenticated]);

  const placeOrder = async () => {
    if (!selectedAddressId) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await api.post("/orders", {
        shippingAddressId: selectedAddressId,
        paymentMethod: "CREDIT_CARD",
      });
      setOrderNumber(res.data.data.orderNumber);
      setShowSuccess(true);
    } catch {
      setError("Order placement failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || cartLoading) {
    return (
      <div className="py-16">
        <Container>
          <div className="h-96 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
        </Container>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="py-24">
        <Container className="max-w-lg text-center">
          <p className="lux-small uppercase tracking-[0.3em] text-green-600">Order Confirmed</p>
          <h1 className="lux-h2 mt-4">Thank you for your order.</h1>
          <p className="lux-lead mt-4">Order #{orderNumber}</p>
          <p className="mt-2 text-sm text-gray-500">A confirmation will be sent to your email.</p>
          <Button className="mt-8" onClick={() => router.push("/customer")}>View My Orders</Button>
        </Container>
      </div>
    );
  }

  const steps: Step[] = ["cart", "address", "payment"];
  const stepLabels = ["Cart", "Address", "Payment"];

  return (
    <div className="py-16">
      <Container className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <section className="grid gap-6">
          {/* Step indicators */}
          <div className="flex gap-4">
            {steps.map((s, i) => (
              <button
                key={s}
                onClick={() => setStep(s)}
                className={`flex items-center gap-2 text-sm ${step === s ? "font-medium" : "text-gray-400"}`}
              >
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${step === s ? "bg-black text-white dark:bg-white dark:text-black" : "border border-gray-300"}`}>
                  {i + 1}
                </span>
                {stepLabels[i]}
              </button>
            ))}
          </div>

          {/* Cart Step */}
          {step === "cart" && (
            <Card className="p-6">
              <p className="lux-small uppercase tracking-[0.3em]">Your Cart</p>
              {!cart || cart.items.length === 0 ? (
                <p className="mt-6 text-gray-500">Your cart is empty.</p>
              ) : (
                <div className="mt-6 grid gap-4">
                  {cart.items.map(item => (
                    <div key={item.id} className="flex items-center gap-4 border-b border-gray-100 pb-4 dark:border-gray-800">
                      <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900" />
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-500">EUR {item.unitPrice?.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateItem(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="flex h-7 w-7 items-center justify-center rounded-full border text-sm disabled:opacity-30">−</button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button onClick={() => updateItem(item.id, item.quantity + 1)} className="flex h-7 w-7 items-center justify-center rounded-full border text-sm">+</button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-sm text-red-500 hover:underline">Remove</button>
                    </div>
                  ))}
                  <Button onClick={() => setStep("address")} className="mt-2 w-full">Continue to Address</Button>
                </div>
              )}
            </Card>
          )}

          {/* Address Step */}
          {step === "address" && (
            <Card className="p-6">
              <p className="lux-small uppercase tracking-[0.3em]">Delivery Address</p>
              {addresses.length === 0 ? (
                <p className="mt-4 text-gray-500">No saved addresses. Please add one in your account.</p>
              ) : (
                <div className="mt-6 grid gap-4">
                  {addresses.map(addr => (
                    <label key={addr.id} className={`flex cursor-pointer gap-4 rounded-lg border p-4 transition ${selectedAddressId === addr.id ? "border-black dark:border-white" : "border-gray-200 dark:border-gray-700"}`}>
                      <input type="radio" name="address" checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} className="mt-1" />
                      <div>
                        <p className="font-medium">{addr.addressLine1}</p>
                        {addr.addressLine2 && <p className="text-sm text-gray-500">{addr.addressLine2}</p>}
                        <p className="text-sm text-gray-500">{addr.city}, {addr.country}</p>
                        {addr.isDefault && <span className="mt-1 inline-block text-xs text-green-600">Default</span>}
                      </div>
                    </label>
                  ))}
                  <Button onClick={() => setStep("payment")} disabled={!selectedAddressId} className="w-full">Continue to Payment</Button>
                </div>
              )}
            </Card>
          )}

          {/* Payment Step */}
          {step === "payment" && (
            <Card className="p-6">
              <p className="lux-small uppercase tracking-[0.3em]">Payment</p>
              <div className="mt-6 grid gap-4">
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <p className="text-sm font-medium">Credit / Debit Card</p>
                  <div className="mt-4 grid gap-3">
                    <input className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 text-sm dark:border-gray-700" placeholder="Card number" />
                    <div className="grid grid-cols-2 gap-3">
                      <input className="h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm dark:border-gray-700" placeholder="MM / YY" />
                      <input className="h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm dark:border-gray-700" placeholder="CVV" />
                    </div>
                  </div>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button onClick={placeOrder} disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Placing Order…" : "Place Order"}
                </Button>
              </div>
            </Card>
          )}
        </section>

        {/* Order Summary Sidebar */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <Card className="p-6">
            <p className="lux-small uppercase tracking-[0.3em]">Order Summary</p>
            <div className="mt-6 grid gap-3 text-sm">
              {cart?.items.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{item.productName} ×{item.quantity}</span>
                  <span>EUR {item.totalPrice?.toFixed(2)}</span>
                </div>
              ))}
              <div className="mt-2 border-t border-gray-100 pt-3 dark:border-gray-800">
                <div className="flex justify-between"><span>Subtotal</span><span>EUR {cart?.subtotal?.toFixed(2) ?? "0.00"}</span></div>
                <div className="flex justify-between text-gray-500"><span>Shipping</span><span>Complimentary</span></div>
                {(cart?.discountAmount ?? 0) > 0 && (
                  <div className="flex justify-between text-green-600"><span>Discount</span><span>−EUR {cart?.discountAmount?.toFixed(2)}</span></div>
                )}
              </div>
              <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
                <div className="flex justify-between font-medium"><span>Total</span><span>EUR {cart?.grandTotal?.toFixed(2) ?? "0.00"}</span></div>
              </div>
            </div>
          </Card>
        </aside>
      </Container>
    </div>
  );
}

export const Cart = CheckoutPageContent;
export const Checkout = CheckoutPageContent;
export const Address = CheckoutPageContent;
export const Payment = CheckoutPageContent;
export const OrderSuccess = CheckoutPageContent;
