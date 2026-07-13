"use client";
import { AdminSimpleForm } from "@/features/admin/AdminCrudPage";
import { use } from "react";
export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <AdminSimpleForm title="Category" apiPath="/cms/categories" backPath="/admin/categories" itemId={id} fields={[
      { name: "name", label: "Name", required: true },
      { name: "slug", label: "Slug", required: true },
      { name: "description", label: "Description", multiline: true },
    ]} />
  );
}
