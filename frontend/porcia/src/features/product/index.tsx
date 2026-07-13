import { Card, Container } from "@/components/ui";

const accordion = [
  { title: "Description", copy: "Double-faced wool and silk with hand-finished seams." },
  { title: "Shipping", copy: "White-glove delivery and boutique pickup available." },
  { title: "Care", copy: "Dry clean only with storage garment bag included." },
] as const;

export function ProductPageContent() {
  return (
    <div className="py-16">
      <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-6 lg:sticky lg:top-28 lg:self-start">
          <div className="lux-ratio-portrait rounded-[var(--lux-r-3)] border border-[var(--lux-border)] bg-[linear-gradient(180deg,#f2ebe3,#b89a7d_60%,#54433a)]" />
          <div className="grid gap-4 grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="lux-ratio-square rounded-[var(--lux-r-2)] border border-[var(--lux-border)] bg-[var(--lux-card)]" />
            ))}
          </div>
        </div>
        <div className="grid gap-8">
          <div>
            <p className="lux-small uppercase tracking-[0.3em]">Product Page</p>
            <h1 className="lux-h1 mt-4 text-[clamp(2.5rem,6vw,4.5rem)]">Atelier Silk Coat</h1>
            <p className="lux-lead mt-4">Architectural outerwear with fluid structure, calm detailing, and couture-inspired finish.</p>
            <p className="mt-6 text-xl">EUR 2,400</p>
          </div>
          <Card className="p-6">
            <p className="lux-small uppercase tracking-[0.3em]">Variants</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {["Black", "Bone", "Espresso"].map((item) => <button key={item} className="rounded-full border border-[var(--lux-border)] px-4 py-2">{item}</button>)}
            </div>
            <p className="lux-small mt-6 uppercase tracking-[0.3em]">Size</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {["XS", "S", "M", "L"].map((item) => <button key={item} className="rounded-full border border-[var(--lux-border)] px-4 py-2">{item}</button>)}
            </div>
          </Card>
          <div className="grid gap-4">
            {accordion.map((item) => (
              <Card key={item.title} className="p-6">
                <p className="text-lg">{item.title}</p>
                <p className="lux-small mt-3">{item.copy}</p>
              </Card>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {["Related Products", "Cross Sell", "Recently Viewed"].map((title) => (
              <Card key={title} className="p-6">
                <p className="lux-small uppercase tracking-[0.3em]">{title}</p>
                <div className="lux-ratio-square mt-4 rounded-[var(--lux-r-2)] bg-[var(--lux-card)]" />
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

export const Gallery = ProductPageContent;
export const StickyImages = ProductPageContent;
export const Zoom = ProductPageContent;
export const Variants = ProductPageContent;
export const Size = ProductPageContent;
export const Color = ProductPageContent;
export const Description = ProductPageContent;
export const Accordion = ProductPageContent;
export const Reviews = ProductPageContent;
export const RelatedProducts = ProductPageContent;
export const CrossSell = ProductPageContent;
export const RecentlyViewed = ProductPageContent;
export const LuxuryAnimation = ProductPageContent;
