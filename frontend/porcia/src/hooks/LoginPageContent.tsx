"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card, Container } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";

export function LoginPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/auth/customer/login", { email, password });
      const token = response.data.data.accessToken;
      if (token) {
        login(token);
        router.push("/account");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError("Invalid email or password.");
      console.error(err);
    }
  };

  return (
    <Container className="flex min-h-[60vh] items-center justify-center py-24">
      <Card className="w-full max-w-md p-8">
        <h1 className="lux-h2 text-center">Customer Login</h1>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-6">
          <div className="grid gap-2">
            <label className="lux-small uppercase tracking-[0.2em]">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 rounded-full border border-[var(--lux-border)] bg-transparent px-5 outline-none focus:border-[var(--lux-gold)]"
            />
          </div>
          <div className="grid gap-2">
            <label className="lux-small uppercase tracking-[0.2em]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 rounded-full border border-[var(--lux-border)] bg-transparent px-5 outline-none focus:border-[var(--lux-gold)]"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" size="lg">
            Sign In
          </Button>
          <p className="text-center text-sm text-[var(--lux-muted)]">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline hover:text-[var(--lux-fg)]">Create one</Link>
          </p>
        </form>
      </Card>
    </Container>
  );
}
