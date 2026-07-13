"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

export default function CouponFormPage() {
  const params = useParams();
  const router = useRouter();
  const isEdit = Boolean(params && params.id && params.id !== "new");
  const couponId = isEdit ? (params?.id as string) : null;

  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: 0,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    usageLimit: 0,
    expiresAt: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    if (isEdit && couponId) {
      const token = localStorage.getItem("adminAuthToken");
      api.get(`/cms/coupons/${couponId}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          const c = res.data.data;
          setForm({
            code: c.code,
            discountType: c.discountType,
            discountValue: c.discountValue,
            minOrderAmount: c.minOrderAmount || 0,
            maxDiscountAmount: c.maxDiscountAmount || 0,
            usageLimit: c.usageLimit || 0,
            expiresAt: c.expiresAt ? c.expiresAt.split("T")[0] : "",
            description: c.description || "",
            isActive: c.isActive,
          });
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [isEdit, couponId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const token = localStorage.getItem("adminAuthToken");

    try {
      const payload = {
        ...form,
        discountValue: parseFloat(form.discountValue.toString()),
        minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount.toString()) : null,
        maxDiscountAmount: form.maxDiscountAmount ? parseFloat(form.maxDiscountAmount.toString()) : null,
        usageLimit: form.usageLimit || null,
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
      };

      if (isEdit && couponId) {
        await api.put(`/cms/coupons/${couponId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await api.post(`/cms/coupons`, payload, { headers: { Authorization: `Bearer ${token}` } });
      }
      router.push("/admin/coupons");
    } catch {
      alert("Error saving coupon");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div style={{ padding: 48, textAlign: "center" }}><Loader2 size={24} color="#9ca3af" /></div>;

  return (
    <div>
      <Link href="/admin/coupons" style={{ display: "flex", alignItems: "center", gap: 8, color: "#3b82f6", marginBottom: 16, textDecoration: "none", fontSize: 14 }}>
        <ArrowLeft size={16} /> Back
      </Link>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24, maxWidth: 600 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{isEdit ? "Edit Coupon" : "New Coupon"}</h1>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Code *</label>
            <input type="text" required disabled={isEdit} value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, background: isEdit ? "#f9fafb" : "#fff" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Type *</label>
              <select required value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}>
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed (€)</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Value *</label>
              <input type="number" required step="0.01" min="0" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: parseFloat(e.target.value) })} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Min Order Amount (€)</label>
            <input type="number" step="0.01" min="0" value={form.minOrderAmount} onChange={e => setForm({ ...form, minOrderAmount: parseFloat(e.target.value) })} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Max Discount Amount (€)</label>
            <input type="number" step="0.01" min="0" value={form.maxDiscountAmount} onChange={e => setForm({ ...form, maxDiscountAmount: parseFloat(e.target.value) })} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Usage Limit</label>
            <input type="number" min="0" value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: parseInt(e.target.value) })} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Expires At</label>
            <input type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, minHeight: 80 }} />
          </div>

          {isEdit && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} style={{ width: 18, height: 18 }} />
              <label style={{ fontSize: 14 }}>Active</label>
            </div>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button type="submit" disabled={isSaving} style={{ flex: 1, padding: "10px 16px", borderRadius: 8, background: "#111827", color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
              {isSaving ? "Saving..." : isEdit ? "Update" : "Create"}
            </button>
            <Link href="/admin/coupons" style={{ flex: 1, padding: "10px 16px", borderRadius: 8, background: "#f3f4f6", color: "#374151", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, textAlign: "center", textDecoration: "none" }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
