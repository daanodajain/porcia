"use client";
import { AdminSimpleForm } from "@/features/admin/AdminCrudPage";
export default function NewCollectionPage() {
  return (
    <AdminSimpleForm title="Collection" apiPath="/cms/collections" backPath="/admin/collections" fields={[
      { name: "name", label: "Name", required: true },
      { name: "slug", label: "Slug", required: true },
      { name: "description", label: "Description", multiline: true },
    ]} />
  );
}
