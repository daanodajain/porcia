"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ShoppingBag, Minus, Plus } from "lucide-react";
import { Button, Container, MediaAsset } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import api from "@/lib/api";
import { resolveBestMediaUrl } from "@/lib/media";

interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  displayOrder: number;
  type?: string | null;
  poster?: string | null;
}

interface ProductVariant {
  id: string;
  sku: string;
  color: string | null;
  size: string | null;
  price: number;
  stockQuantity: number;
  isActive: boolean;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  shortDescription?: string | null;
  note?: string | null;
  mrp: number;
  sellingPrice: number;
  stockQuantity: number;
  isActive: boolean;
  status: string;
  category: { id: string; name: string; slug: string } | null;
  brand: { id: string; name: string } | null;
  images: ProductImage[];
  variants: ProductVariant[];
  image?: string | null;
  imageUrl?: string | null;
  featuredImage?: string | null;
  mediaUrl?: string | null;
  mediaType?: string | null;
}

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-[var(--porcia-border)]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-4 text-left text-sm uppercase tracking-[0.28em] text-[var(--porcia-fg)]"
      >
        {title}
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-5 text-sm leading-relaxed text-[var(--porcia-text-secondary)]">{children}</div>}
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="bg-[linear-gradient(180deg,#fbf8f4_0%,#fff_100%)] py-16 lg:py-24">
      <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-6">
          <div className="aspect-[4/5] animate-pulse rounded-[2rem] bg-[linear-gradient(180deg,#e7ddd1,#c1aa95)]" />
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-square animate-pulse rounded-[1rem] bg-[rgba(0,0,0,0.08)]" />
            ))}
          </div>
        </div>
        <div className="grid gap-6">
          <div className="h-4 w-1/3 animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
          <div className="h-12 w-2/3 animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
          <div className="h-8 w-1/4 animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
          <div className="h-12 w-full animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
        </div>
      </Container>
    </div>
  );
}

interface Props {
  slug: string;
}

export function ProductDetailPageContent({ slug }: Props) {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const colors = [...new Set((product?.variants ?? []).map((v) => v.color).filter(Boolean))] as string[];
  const sizes = [...new Set((product?.variants ?? []).map((v) => v.size).filter(Boolean))] as string[];

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.get(`/products/${slug}`);
        const p: Product = res.data.data;
        setProduct(p);
        if (p.variants?.length > 0) {
          setSelectedVariant(p.variants[0]);
          setSelectedColor(p.variants[0].color ?? null);
          setSelectedSize(p.variants[0].size ?? null);
        }
      } catch {
        setError("Product not found or could not be loaded.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    const match = product.variants.find((v) => v.color === selectedColor && v.size === selectedSize);
    if (match) setSelectedVariant(match);
  }, [selectedColor, selectedSize, product]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!product) return;
    setAddingToCart(true);
    setCartError(null);
    try {
      await addToCart(product.id, quantity);
      setAddedFeedback(true);
      setTimeout(() => setAddedFeedback(false), 2000);
    } catch {
      setCartError("Couldn't add this item to your cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  const displayPrice = selectedVariant?.price ?? product?.sellingPrice ?? 0;
  const originalPrice = product?.mrp ?? 0;
  const hasDiscount = originalPrice > displayPrice;
  const inStock = (selectedVariant?.stockQuantity ?? product?.stockQuantity ?? 0) > 0;
  const heroImage =
    resolveBestMediaUrl(
      product?.images?.[selectedImage]?.url,
      product?.mediaUrl,
      product?.image,
      product?.imageUrl,
      product?.featuredImage
    );
  const heroMediaKind = product?.images?.[selectedImage]?.type ?? product?.mediaType ?? undefined;

  if (isLoading) return <ProductSkeleton />;

  if (error || !product) {
    return (
      <div className="bg-[linear-gradient(180deg,#fbf8f4_0%,#fff_100%)]">
        <Container className="py-32 text-center">
          <p className="text-[11px] uppercase tracking-[0.34em] text-[var(--porcia-text-muted)]">Product</p>
          <h1 className="mt-6 font-serif text-[clamp(2.5rem,6vw,4.8rem)] font-light leading-[0.98] tracking-[-0.04em]">
            Product Not Found
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[1rem] leading-8 text-[var(--porcia-text-secondary)]">
            {error ?? "This product does not exist."}
          </p>
          <Button className="mt-8" onClick={() => router.push("/shop")}>Back to Shop</Button>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-[linear-gradient(180deg,#fbf8f4_0%,#fff_100%)] py-10 lg:py-16">
      <Container className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="grid gap-5 lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-[var(--porcia-border)] bg-[linear-gradient(180deg,#eadfd0,#b6a089_40%,#151515)] shadow-[0_30px_90px_rgba(0,0,0,0.14)]">
            {heroImage ? (
              <MediaAsset
                src={heroImage}
                alt={product.name}
                kind={heroMediaKind === "video" ? "video" : "auto"}
                autoPlay={heroMediaKind === "video"}
                muted={heroMediaKind === "video"}
                loop={heroMediaKind === "video"}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_22%,rgba(0,0,0,0.12)_60%,rgba(0,0,0,0.68)_100%)]" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <p className="text-xs uppercase tracking-[0.34em] text-white/70">{product.category?.name ?? "Ready-to-Wear"}</p>
              <p className="mt-3 max-w-sm text-sm leading-7 text-white/80">
                Product imagery is read from the backend image URL, so you can upload an image or paste a URL in admin and the storefront will render it.
              </p>
            </div>
          </div>

          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square overflow-hidden rounded-[1rem] border transition ${
                    selectedImage === i ? "border-[var(--porcia-fg)]" : "border-transparent"
                  }`}
                >
                  {img.url ? (
                    <MediaAsset
                      src={img.url}
                      alt={img.altText ?? product.name}
                      kind={img.type === "video" ? "video" : "auto"}
                      autoPlay={img.type === "video"}
                      muted={img.type === "video"}
                      loop={img.type === "video"}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-[rgba(0,0,0,0.08)]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start">
          <div className="grid gap-4">
            {product.category && (
              <p className="text-[11px] uppercase tracking-[0.34em] text-[var(--porcia-text-muted)]">
                {product.category.name}
              </p>
            )}
            <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] font-light leading-[0.96] tracking-[-0.05em]">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-3">
              <p className="text-2xl font-medium">EUR {Number(displayPrice).toFixed(2)}</p>
              {hasDiscount && (
                <p className="text-base text-[var(--porcia-text-muted)] line-through">
                  EUR {Number(originalPrice).toFixed(2)}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[var(--porcia-border)] bg-white/75 p-6">
            <div className="grid gap-5">
              {product.shortDescription && (
                <p className="text-[1rem] leading-8 text-[var(--porcia-text-secondary)]">
                  {product.shortDescription}
                </p>
              )}

              {colors.length > 0 && (
                <div>
                  <p className="text-[11px] uppercase tracking-[0.34em] text-[var(--porcia-text-muted)]">
                    Colour{selectedColor ? `: ${selectedColor}` : ""}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                          selectedColor === c
                            ? "border-[var(--porcia-fg)] bg-[var(--porcia-black)] text-white"
                            : "border-[var(--porcia-border)] hover:border-[var(--porcia-fg)]"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {sizes.length > 0 && (
                <div>
                  <p className="text-[11px] uppercase tracking-[0.34em] text-[var(--porcia-text-muted)]">
                    Size
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                          selectedSize === s
                            ? "border-[var(--porcia-fg)] bg-[var(--porcia-black)] text-white"
                            : "border-[var(--porcia-border)] hover:border-[var(--porcia-fg)]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  <p className="text-[11px] uppercase tracking-[0.34em] text-[var(--porcia-text-muted)]">Qty</p>
                  <div className="flex items-center gap-3 rounded-full border border-[var(--porcia-border)] px-4 py-2">
                    <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="transition hover:opacity-60">
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm">{quantity}</span>
                    <button onClick={() => setQuantity((q) => q + 1)} className="transition hover:opacity-60">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {!inStock && <p className="text-sm text-red-500">Out of stock</p>}

                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={addingToCart || !inStock}
                  className="flex items-center gap-2"
                >
                  <ShoppingBag size={18} />
                  {addedFeedback ? "Added!" : addingToCart ? "Adding..." : "Add to Cart"}
                </Button>

                {cartError && <p className="text-sm text-red-500">{cartError}</p>}

                <Button size="lg" variant="ghost">
                  Private Appointment
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[var(--porcia-border)] bg-white/75 p-6">
            <AccordionItem title="Description">
              {product.description ?? product.note ?? "No description available."}
            </AccordionItem>
            <AccordionItem title="Details & Care">
              Crafted with exceptional materials and finished to the highest standard. Dry clean only.
              Store in the provided garment bag.
            </AccordionItem>
            <AccordionItem title="Shipping & Returns">
              White-glove delivery within 3-5 business days. Free returns within 14 days of receipt.
            </AccordionItem>
          </div>

          {(product.brand || product.sku) && (
            <div className="flex gap-6 border-t border-[var(--porcia-border)] pt-4 text-xs text-[var(--porcia-text-muted)]">
              {product.brand && <span>Brand: {product.brand.name}</span>}
              {product.sku && <span>SKU: {product.sku}</span>}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
