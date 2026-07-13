"use client";
import { AdminSimpleForm } from "@/features/admin/AdminCrudPage";
import { use } from "react";
export default function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <AdminSimpleForm title="Brand" apiPath="/cms/brands" backPath="/admin/brands" itemId={id} fields={[
      { name: "name", label: "Name", required: true },
      { name: "slug", label: "Slug", required: true },
      { name: "description", label: "Description", multiline: true },
      { name: "logo", label: "Logo URL" },
    ]} />
  );
}
