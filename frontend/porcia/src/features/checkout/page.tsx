import { OrderConfirmationPageContent } from "@/features/checkout/OrderConfirmationPageContent";

export default function OrderSuccessPage({ params }: { params: { orderNumber: string } }) {
  return <OrderConfirmationPageContent orderNumber={params.orderNumber} />;
}
