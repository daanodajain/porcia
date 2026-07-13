"use client";
import { AdminCrudPage } from "@/features/admin/AdminCrudPage";

interface BrandRow { id: string; name: string; slug: string; description: string; isActive?: boolean; }

export default function BrandsPage() {
  return (
    <AdminCrudPage<BrandRow>
      title="Brands"
      apiPath="/cms/brands"
      editPath="/admin/brands"
      columns={[
        { label: "Name", render: r => <span style={{ fontWeight: 500 }}>{r.name}</span> },
        { label: "Slug", render: r => <code style={{ fontSize: 12, color: "#6b7280" }}>{r.slug}</code> },
        { label: "Description", render: r => <span style={{ color: "#6b7280" }}>{r.description ?? "—"}</span> },
        { label: "Status", render: r => (
          <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 999, background: r.isActive ? "#dcfce7" : "#fee2e2", color: r.isActive ? "#16a34a" : "#dc2626" }}>
            {r.isActive ? "Active" : "Inactive"}
          </span>
        )},
      ]}
    />
  );
}
