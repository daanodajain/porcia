import { OrderConfirmationPageContent } from "@/features/checkout/OrderConfirmationPageContent";

export default async function CheckoutSuccessPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  return <OrderConfirmationPageContent orderNumber={orderNumber} />;
}
