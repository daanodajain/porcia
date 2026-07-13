"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui";
import api from "@/lib/api";

interface OrderItem {
  id: number;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Address {
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  fullName: string;
  phone: string;
}

interface OrderDetails {
  id: number;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  grandTotal: number;
  subtotal: number;
  shippingCharge: number;
  discountAmount: number;
  createdAt: string;
  shippingAddress: Address;
  items: OrderItem[];
}

export function OrderDetailPageContent({ orderNumber }: { orderNumber: string }) {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/orders/${orderNumber}`);
        setOrder(response.data.data);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderNumber]);

  if (isLoading) {
    return <p>Loading order details...</p>;
  }

  if (!order) {
    return <p>Order not found.</p>;
  }

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="lux-h2">Order #{order.orderNumber}</h1>
        <p className="lux-lead">Placed on {new Date(order.createdAt).toLocaleString()}</p>
      </div>

      <Card className="p-8">
        <h3 className="lux-h3">Items Ordered</h3>
        <div className="mt-6 grid gap-6 divide-y divide-[var(--lux-border)] border-t border-[var(--lux-border)] pt-6">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 pt-6 first:pt-0">
              <div className="h-24 w-24 flex-shrink-0 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="flex-grow">
                <p className="font-semibold">{item.productName}</p>
                <p className="lux-small">SKU: {item.sku}</p>
                <p className="lux-small">
                  {item.quantity} x EUR {item.unitPrice.toFixed(2)}
                </p>
              </div>
              <p className="font-semibold">EUR {item.totalPrice.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="p-8">
          <h3 className="lux-h3">Shipping Address</h3>
          <div className="mt-6 border-t border-[var(--lux-border)] pt-6">
            <p className="font-semibold">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
            <p>Phone: {order.shippingAddress.phone}</p>
          </div>
        </Card>
        <Card className="p-8">
          <h3 className="lux-h3">Payment Summary</h3>
          <div className="mt-6 grid gap-3 border-t border-[var(--lux-border)] pt-6">
            <div className="flex justify-between"><span>Subtotal:</span> <span>EUR {order.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping:</span> <span>EUR {order.shippingCharge.toFixed(2)}</span></div>
            {order.discountAmount > 0 && <div className="flex justify-between"><span>Discount:</span> <span>-EUR {order.discountAmount.toFixed(2)}</span></div>}
            <div className="mt-4 flex justify-between border-t border-[var(--lux-border)] pt-4 font-bold"><span>Grand Total:</span> <span>EUR {order.grandTotal.toFixed(2)}</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
}