"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import api from "@/lib/api";

interface Order {
  id: number;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  grandTotal: number;
  createdAt: string;
}

interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export function OrderHistoryPageContent() {
  const [orders, setOrders] = useState<PageResponse<Order> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = parseInt(searchParams?.get("page") || "0", 10);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/orders?page=${page}&size=5`);
        setOrders(response.data.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    router.push(`/account/orders?page=${newPage}`);
  };

  return (
    <div className="grid gap-8">
      <h1 className="lux-h2">My Orders</h1>
      {isLoading ? (
        <p>Loading orders...</p>
      ) : !orders || orders.content.length === 0 ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        <div className="grid gap-6">
          <Card className="divide-y divide-[var(--lux-border)]">
            {orders.content.map((order) => (
              <Link key={order.id} href={`/account/orders/${order.orderNumber}`} className="block p-6 hover:bg-[var(--lux-surface-hover)]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">Order #{order.orderNumber}</p>
                    <p className="lux-small">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">EUR {order.grandTotal.toFixed(2)}</p>
                    <p className="lux-small">{order.orderStatus}</p>
                  </div>
                </div>
              </Link>
            ))}
          </Card>
          {orders.totalPages > 1 && (
            <div className="flex justify-center gap-4">
              <Button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
                Previous
              </Button>
              <span className="self-center">
                Page {page + 1} of {orders.totalPages}
              </span>
              <Button onClick={() => handlePageChange(page + 1)} disabled={page + 1 >= orders.totalPages}>
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}