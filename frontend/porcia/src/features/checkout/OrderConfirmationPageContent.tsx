"use client";

import { Button, Container } from "@/components/ui";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export function OrderConfirmationPageContent({ orderNumber }: { orderNumber: string }) {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <CheckCircle className="h-16 w-16 text-green-500" />
      <h1 className="lux-h1 mt-6">Thank you for your order!</h1>
      <p className="lux-lead mt-4">
        Your order <span className="font-bold">#{orderNumber}</span> has been placed successfully.
      </p>
      <p className="mt-2">
        You will receive an email confirmation shortly. You can also view your order details in your account.
      </p>
      <div className="mt-10 flex gap-4">
        <Link href="/shop">
          <Button variant="ghost">Continue Shopping</Button>
        </Link>
        <Link href="/account/orders">
          <Button>View My Orders</Button>
        </Link>
      </div>
    </Container>
  );
}
