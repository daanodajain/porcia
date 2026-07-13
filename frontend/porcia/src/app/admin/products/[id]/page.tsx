import { AdminProductForm } from "@/features/admin/AdminProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminProductForm productId={id} />;
}
