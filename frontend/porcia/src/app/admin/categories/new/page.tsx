"use client";
import { AdminSimpleForm } from "@/features/admin/AdminCrudPage";
export default function NewCategoryPage() {
  return (
    <AdminSimpleForm title="Category" apiPath="/cms/categories" backPath="/admin/categories" fields={[
      { name: "name", label: "Name", required: true },
      { name: "slug", label: "Slug", required: true },
      { name: "description", label: "Description", multiline: true },
    ]} />
  );
}
