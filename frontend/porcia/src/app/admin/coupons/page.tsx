"use client";
import { AdminCrudPage } from "@/features/admin/AdminCrudPage";

interface CouponRow {
  id: string;
  name: string;
  code: string;
  discountType: string;
  discountValue: number;
  usageLimit: number;
  usedCount: number;
  isActive?: boolean;
  expiresAt?: string;
}

export default function CouponsAdminPage() {
  return (
    <AdminCrudPage<CouponRow>
      title="Coupons"
      apiPath="/cms/coupons"
      editPath="/admin/coupons"
      columns={[
        { label: "Code", render: r => <code style={{ fontWeight: 600, fontSize: 13 }}>{r.code}</code> },
        { label: "Type", render: r => <span style={{ color: "#6b7280", fontSize: 13 }}>{r.discountType}</span> },
        { label: "Value", render: r => (
          <span style={{ fontWeight: 500 }}>
            {r.discountType === "PERCENTAGE" ? `${r.discountValue}%` : `EUR ${r.discountValue}`}
          </span>
        )},
        { label: "Used / Limit", render: r => (
          <span style={{ color: "#6b7280", fontSize: 13 }}>
            {r.usedCount ?? 0} / {r.usageLimit ?? "∞"}
          </span>
        )},
        { label: "Expires", render: r => (
          <span style={{ color: "#6b7280", fontSize: 13 }}>
            {r.expiresAt ? new Date(r.expiresAt).toLocaleDateString("en-GB") : "Never"}
          </span>
        )},
        { label: "Active", render: r => (
          <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 999,
            background: r.isActive ? "#dcfce7" : "#fee2e2",
            color: r.isActive ? "#16a34a" : "#dc2626" }}>
            {r.isActive ? "Yes" : "No"}
          </span>
        )},
      ]}
    />
  );
}
