"use client";
import { AdminSimpleForm } from "@/features/admin/AdminCrudPage";
import { use } from "react";
export default function EditCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <AdminSimpleForm title="Collection" apiPath="/cms/collections" backPath="/admin/collections" itemId={id} fields={[
      { name: "name", label: "Name", required: true },
      { name: "slug", label: "Slug", required: true },
      { name: "description", label: "Description", multiline: true },
    ]} />
  );
}
