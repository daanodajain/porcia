"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card, Container } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const set = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/customer/auth/register", form);
      const token = response.data.data.accessToken;
      if (token) {
        await login(token);
        router.push("/account");
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? "Registration failed. Please try again.");
    }
  };

  const inputCls = "h-12 rounded-full border border-[var(--lux-border)] bg-transparent px-5 outline-none focus:border-[var(--lux-gold)]";

  return (
    <Container className="flex min-h-[60vh] items-center justify-center py-24">
      <Card className="w-full max-w-md p-8">
        <h1 className="lux-h2 text-center">Create Account</h1>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="lux-small uppercase tracking-[0.2em]">First Name</label>
              <input className={inputCls} value={form.firstName} onChange={(e) => set("firstName", e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <label className="lux-small uppercase tracking-[0.2em]">Last Name</label>
              <input className={inputCls} value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
            </div>
          </div>
          <div className="grid gap-2">
            <label className="lux-small uppercase tracking-[0.2em]">Email Address</label>
            <input type="email" className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <label className="lux-small uppercase tracking-[0.2em]">Phone</label>
            <input type="tel" className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <label className="lux-small uppercase tracking-[0.2em]">Password</label>
            <input type="password" className={inputCls} value={form.password} onChange={(e) => set("password", e.target.value)} required minLength={8} />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" size="lg">Create Account</Button>
          <p className="text-center text-sm text-[var(--lux-muted)]">
            Already have an account?{" "}
            <Link href="/login" className="underline hover:text-[var(--lux-fg)]">Sign in</Link>
          </p>
        </form>
      </Card>
    </Container>
  );
}
