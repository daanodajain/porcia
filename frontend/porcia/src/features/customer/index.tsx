"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Container, Button } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { setStoredCustomerToken } from "@/config/auth";

type Section = "profile" | "orders" | "addresses" | "wishlist";

interface Order {
  id: number;
  orderNumber: string;
  orderStatus: string;
  grandTotal: number;
  createdAt: string;
}

interface Address {
  id: number;
  addressLine1: string;
  city: string;
  country: string;
  isDefault: boolean;
}

export function CustomerPageContent() {
  const router = useRouter();
  const { isAuthenticated, user, logout, isLoading: authLoading } = useAuth();
  const [section, setSection] = useState<Section>("profile");
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Login state (shown when not authenticated)
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (section === "orders") {
        setIsLoading(true);
        api.get("/orders").then(res => setOrders(res.data.data?.content || [])).catch(() => {}).finally(() => setIsLoading(false));
      }
      if (section === "addresses") {
        setIsLoading(true);
        api.get("/customer/addresses").then(res => setAddresses(res.data.data || [])).catch(() => {}).finally(() => setIsLoading(false));
      }
    }
  }, [section, isAuthenticated, authLoading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setLoginError(null);
    try {
      const res = await api.post("/auth/customer/login", { email: loginEmail, password: loginPassword });
      const token = res.data.data?.accessToken;
      if (token) {
        setStoredCustomerToken(token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        window.location.reload();
      }
    } catch {
      setLoginError("Invalid email or password.");
    } finally {
      setIsLoginLoading(false);
    }
  };

  const navItems: { key: Section; label: string }[] = [
    { key: "profile", label: "Profile" },
    { key: "orders", label: "Order History" },
    { key: "addresses", label: "Addresses" },
    { key: "wishlist", label: "Wishlist" },
  ];

  if (authLoading) {
    return (
      <div className="py-16">
        <Container><div className="h-64 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" /></Container>
      </div>
    );
  }

  // Not logged in — show login form
  if (!isAuthenticated) {
    return (
      <div className="py-24">
        <Container className="max-w-md">
          <p className="lux-small uppercase tracking-[0.3em]">Private Client</p>
          <h1 className="lux-h2 mt-4">Sign in to your account.</h1>
          <form onSubmit={handleLogin} className="mt-10 grid gap-4">
            <input
              className="h-12 w-full rounded-full border border-[var(--lux-border)] bg-transparent px-5 text-sm outline-none"
              type="email" placeholder="Email address"
              value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required
            />
            <input
              className="h-12 w-full rounded-full border border-[var(--lux-border)] bg-transparent px-5 text-sm outline-none"
              type="password" placeholder="Password"
              value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required
            />
            {loginError && <p className="text-sm text-red-500">{loginError}</p>}
            <Button type="submit" disabled={isLoginLoading} className="w-full">
              {isLoginLoading ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-16">
      <Container className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="grid gap-2 self-start lg:sticky lg:top-28">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              className={`rounded-lg px-4 py-3 text-left text-sm transition ${section === item.key ? "bg-black text-white dark:bg-white dark:text-black" : "hover:bg-gray-50 dark:hover:bg-gray-900"}`}
            >
              {item.label}
            </button>
          ))}
          <button onClick={logout} className="mt-2 rounded-lg px-4 py-3 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950">
            Sign Out
          </button>
        </aside>

        <section className="grid gap-6">
          {/* Profile */}
          {section === "profile" && (
            <Card className="p-8">
              <p className="lux-small uppercase tracking-[0.3em]">Profile</p>
              <h2 className="lux-h2 mt-4">{user?.firstName} {user?.lastName}</h2>
              <p className="lux-lead mt-2">{user?.email}</p>
              {user?.phone && <p className="mt-1 text-sm text-gray-500">{user.phone}</p>}
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {[
                  { label: "Orders", action: () => setSection("orders") },
                  { label: "Addresses", action: () => setSection("addresses") },
                  { label: "Wishlist", action: () => setSection("wishlist") },
                ].map(item => (
                  <button key={item.label} onClick={item.action} className="rounded-lg border border-gray-200 p-6 text-left transition hover:border-gray-400 dark:border-gray-700">
                    <p className="font-medium">{item.label}</p>
                    <p className="mt-1 text-sm text-gray-500">View {item.label.toLowerCase()}</p>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Orders */}
          {section === "orders" && (
            <Card className="p-6">
              <p className="lux-small uppercase tracking-[0.3em]">Order History</p>
              {isLoading ? (
                <div className="mt-6 space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />)}
                </div>
              ) : orders.length === 0 ? (
                <p className="mt-6 text-gray-500">No orders yet.</p>
              ) : (
                <div className="mt-6 grid gap-4">
                  {orders.map(order => (
                    <div key={order.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-4 dark:border-gray-800">
                      <div>
                        <p className="font-medium">#{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{order.orderStatus}</p>
                        <p className="font-medium">EUR {order.grandTotal.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Addresses */}
          {section === "addresses" && (
            <Card className="p-6">
              <p className="lux-small uppercase tracking-[0.3em]">Saved Addresses</p>
              {isLoading ? (
                <div className="mt-6 space-y-4">
                  {[1,2].map(i => <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />)}
                </div>
              ) : addresses.length === 0 ? (
                <p className="mt-6 text-gray-500">No saved addresses.</p>
              ) : (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {addresses.map(addr => (
                    <div key={addr.id} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <p className="font-medium">{addr.addressLine1}</p>
                      <p className="text-sm text-gray-500">{addr.city}, {addr.country}</p>
                      {addr.isDefault && <span className="mt-2 inline-block text-xs text-green-600">Default address</span>}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Wishlist */}
          {section === "wishlist" && (
            <Card className="p-6">
              <p className="lux-small uppercase tracking-[0.3em]">Wishlist</p>
              <p className="mt-6 text-gray-500">Browse the collection and save your favourite pieces.</p>
              <Button className="mt-6" onClick={() => router.push("/shop")}>Explore Collection</Button>
            </Card>
          )}
        </section>
      </Container>
    </div>
  );
}

export const Login = CustomerPageContent;
export const Register = CustomerPageContent;
export const Orders = CustomerPageContent;
export const Profile = CustomerPageContent;
export const Address = CustomerPageContent;
