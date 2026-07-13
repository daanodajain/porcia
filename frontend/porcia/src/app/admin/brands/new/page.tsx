"use client";
import { AdminSimpleForm } from "@/features/admin/AdminCrudPage";
export default function NewBrandPage() {
  return (
    <AdminSimpleForm title="Brand" apiPath="/cms/brands" backPath="/admin/brands" fields={[
      { name: "name", label: "Name", required: true },
      { name: "slug", label: "Slug", required: true },
      { name: "description", label: "Description", multiline: true },
      { name: "logo", label: "Logo URL" },
    ]} />
  );
}
