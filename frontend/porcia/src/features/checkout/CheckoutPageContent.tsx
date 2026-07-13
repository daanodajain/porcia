"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Container } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import api from "@/lib/api";

interface Address {
  id: string;
  addressType: string | null;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  postalCode: string;
}

export function CheckoutPageContent() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { cart, isLoading: isCartLoading, fetchCart } = useCart();
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchAddresses = async () => {
        try {
          const response = await api.get("/customer/addresses");
          setAddresses(response.data.data);
          if (response.data.data.length > 0) {
            setSelectedAddressId(response.data.data[0].id);
          }
        } catch (error) {
          console.error("Failed to fetch addresses:", error);
        }
      };
      fetchAddresses();
    }
  }, [isAuthenticated]);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError("Please select a shipping address.");
      return;
    }
    setIsPlacingOrder(true);
    setError("");

    try {
      const createOrderResponse = await api.post("/orders", {
        shippingAddressId: selectedAddressId,
        paymentMethod,
      });

      const order = createOrderResponse.data.data;
      if (!order || !order.orderNumber) {
        throw new Error("Failed to create order.");
      }

      await api.post(`/orders/${order.orderNumber}/payment`, { paymentMethod });
      await fetchCart();
      router.push(`/checkout/success/${order.orderNumber}`);
    } catch (err) {
      console.error("Failed to place order:", err);
      setError("An error occurred while placing your order. Please try again.");
      setIsPlacingOrder(false);
    }
  };

  if (isAuthLoading || isCartLoading) {
    return <Container className="py-24">Loading checkout...</Container>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container className="py-24 text-center">
        <h1 className="lux-h2">Your Cart is Empty</h1>
        <p className="lux-lead mt-4">You cannot proceed to checkout with an empty cart.</p>
        <Button onClick={() => router.push("/shop")} className="mt-8">
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-24">
      <h1 className="lux-h1">Checkout</h1>
      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_400px]">
        <div className="grid gap-8">
          {/* Address Selection */}
          <Card className="p-8">
            <h2 className="lux-h3">Shipping Address</h2>
            <div className="mt-6 grid gap-4">
              {addresses.length === 0 ? (
                <p className="lux-small text-[var(--lux-muted)]">No saved addresses. Please add an address in your account.</p>
              ) : (
                addresses.map((address) => (
                  <label
                    key={address.id}
                    className={`block cursor-pointer rounded-lg border p-4 ${
                      selectedAddressId === address.id
                        ? "border-black ring-2 ring-black dark:border-white dark:ring-white"
                        : "border-[var(--lux-border)]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      className="hidden"
                      checked={selectedAddressId === address.id}
                      onChange={() => setSelectedAddressId(address.id)}
                    />
                    <p className="font-semibold">{address.fullName}</p>
                    <p className="lux-small text-[var(--lux-muted)]">
                      {address.addressLine1}, {address.city}, {address.state} {address.postalCode}
                    </p>
                  </label>
                ))
              )}
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-8">
            <h2 className="lux-h3">Payment Method</h2>
            <div className="mt-6 grid gap-3">
              {["COD", "CARD", "UPI"].map((method) => (
                <label
                  key={method}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${
                    paymentMethod === method
                      ? "border-black ring-2 ring-black dark:border-white dark:ring-white"
                      : "border-[var(--lux-border)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="hidden"
                  />
                  <span>{method === "COD" ? "Cash on Delivery" : method === "CARD" ? "Credit / Debit Card" : "UPI"}</span>
                </label>
              ))}
            </div>
          </Card>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        {/* Order Summary */}
        <aside className="self-start lg:sticky lg:top-28">
          <Card className="p-8">
            <h2 className="lux-h3">Order Summary</h2>
            <div className="mt-6 grid gap-3">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.productName} × {item.quantity}</span>
                  <span>EUR {item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-2 border-t border-[var(--lux-border)] pt-4 text-sm">
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
            <div className="mt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>EUR {cart.grandTotal.toFixed(2)}</span>
            </div>
            <Button
              size="lg"
              className="mt-8 w-full"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? "Placing Order..." : "Place Order"}
            </Button>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
