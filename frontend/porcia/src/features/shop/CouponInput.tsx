"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import api from "@/lib/api";
import { getStoredCustomerToken } from "@/config/auth";

interface CouponInputProps {
  onApply: () => void;
  appliedCode?: string;
}

export function CouponInput({ onApply, appliedCode }: CouponInputProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = getStoredCustomerToken();
      const res = await api.post(
        "/cart/coupon/apply",
        { code: code.toUpperCase() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(`Coupon applied! Discount: EUR ${res.data.data?.discountAmount.toFixed(2)}`);
      setCode("");
      onApply();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(message || "Invalid coupon code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    setIsLoading(true);
    try {
      const token = getStoredCustomerToken();
      await api.delete("/cart/coupon/remove", { headers: { Authorization: `Bearer ${token}` } });
      setSuccess(null);
      onApply();
    } catch {
      setError("Error removing coupon");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {appliedCode ? (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
          <span className="text-sm font-medium text-green-800">
            Coupon applied: <strong>{appliedCode}</strong>
          </span>
          <button
            onClick={handleRemove}
            disabled={isLoading}
            className="text-green-600 hover:text-green-800 transition disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter coupon code"
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            disabled={isLoading}
            className="flex-1 px-3 py-2 border border-[var(--lux-border)] rounded text-sm outline-none focus:border-[var(--lux-fg)] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !code.trim()}
            className="px-4 py-2 bg-[var(--lux-fg)] text-[var(--lux-bg)] rounded text-sm font-medium hover:opacity-80 transition disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
          </button>
        </form>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {success && (
        <p className="text-sm text-green-600">{success}</p>
      )}
    </div>
  );
}
