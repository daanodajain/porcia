"use client";

import { Container } from "@/components/ui";
import { AccountSidebar } from "@/features/shop/AccountSidebar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return <Container className="py-24">Loading account...</Container>;
  }

  return (
    <Container className="grid gap-10 py-24 lg:grid-cols-[280px_1fr]">
      <AccountSidebar />
      <main>{children}</main>
    </Container>
  );
}