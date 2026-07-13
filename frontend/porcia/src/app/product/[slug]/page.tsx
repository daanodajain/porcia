import { ProductDetailPageContent } from "@/features/shop/ProductDetailPageContent";
import { SiteShell } from "@/features/site/layout-new";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <SiteShell>
      <ProductDetailPageContent slug={slug} />
    </SiteShell>
  );
}
