import { OrderDetailPageContent } from "@/features/shop/OrderDetailPageContent";

export default async function OrderDetailPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  return <OrderDetailPageContent orderNumber={orderNumber} />;
}
