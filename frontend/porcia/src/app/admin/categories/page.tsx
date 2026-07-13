"use client";
import { AdminCrudPage } from "@/features/admin/AdminCrudPage";

interface CategoryRow { id: string; name: string; slug: string; description: string; isActive?: boolean; }

export default function CategoriesPage() {
  return (
    <AdminCrudPage<CategoryRow>
      title="Categories"
      apiPath="/cms/categories"
      editPath="/admin/categories"
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
