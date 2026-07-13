"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container, MediaAsset } from "@/components/ui";
import api from "@/lib/api";
import { resolveBestMediaUrl } from "@/lib/media";

const SORT_OPTIONS = [
  { label: "Newest First", value: "createdAt,desc" },
  { label: "Price: Low to High", value: "sellingPrice,asc" },
  { label: "Price: High to Low", value: "sellingPrice,desc" },
] as const;

interface Product {
  id: string;
  name: string;
  slug: string;
  sellingPrice: number;
  mrp: number;
  category: { id: string; name: string; slug: string } | null;
  images: { url: string; type?: string | null; poster?: string | null }[];
  image?: string | null;
  imageUrl?: string | null;
  featuredImage?: string | null;
  mediaUrl?: string | null;
  mediaType?: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

function ProductCard({ product }: { product: Product }) {
  const image = resolveBestMediaUrl(
    product.images?.[0]?.url,
    product.mediaUrl,
    product.image,
    product.imageUrl,
    product.featuredImage
  );
  const hasDiscount = product.mrp > product.sellingPrice;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <article className="grid gap-4">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-[var(--porcia-border)] bg-[linear-gradient(180deg,#e9ded1,#b89d83_45%,#1a1715)] shadow-[0_20px_70px_rgba(0,0,0,0.08)]">
          {image ? (
            <MediaAsset
              src={image}
              alt={product.name}
              kind="auto"
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(0,0,0,0.55)_100%)]" />
        </div>

        <div className="grid gap-1 px-1">
          {product.category && (
            <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--porcia-text-muted)]">
              {product.category.name}
            </p>
          )}
          <h3 className="font-serif text-xl font-light tracking-[-0.02em] transition group-hover:translate-x-1">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 text-sm">
            <span className="font-medium">EUR {Number(product.sellingPrice).toFixed(0)}</span>
            {hasDiscount && (
              <span className="text-[var(--porcia-text-muted)] line-through">
                EUR {Number(product.mrp).toFixed(0)}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

export function ShopPageContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sort, setSort] = useState<string>(SORT_OPTIONS[0].value);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const PAGE_SIZE = 12;

  useEffect(() => {
    api.get("/cms/categories?page=0&size=50")
      .then((res) => setCategories(res.data.data?.content ?? []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(0);
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: String(0),
        size: String(PAGE_SIZE),
        sort,
      });

      if (searchTerm) params.set("search", searchTerm);
      if (selectedCategory) params.set("category", selectedCategory);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);

      api.get(`/products?${params.toString()}`)
        .then((res) => {
          const data = res.data.data;
          setProducts(data?.content ?? []);
          setTotalPages(data?.totalPages ?? 0);
          setTotalElements(data?.totalElements ?? 0);
        })
        .catch(() => setError("Unable to load products. Please try again later."))
        .finally(() => setIsLoading(false));
    }, 250);

    return () => clearTimeout(t);
  }, [searchTerm, selectedCategory, minPrice, maxPrice, sort]);

  useEffect(() => {
    if (page === 0) return;
    setIsLoading(true);
    setError(null);
    const params = new URLSearchParams({
      page: String(page),
      size: String(PAGE_SIZE),
      sort,
    });
    if (searchTerm) params.set("search", searchTerm);
    if (selectedCategory) params.set("category", selectedCategory);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    api.get(`/products?${params.toString()}`)
      .then((res) => {
        const data = res.data.data;
        setProducts(data?.content ?? []);
        setTotalPages(data?.totalPages ?? 0);
        setTotalElements(data?.totalElements ?? 0);
      })
      .catch(() => setError("Unable to load products. Please try again later."))
      .finally(() => setIsLoading(false));
  }, [page, maxPrice, minPrice, searchTerm, selectedCategory, sort]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSort(SORT_OPTIONS[0].value);
    setMinPrice("");
    setMaxPrice("");
    setPage(0);
  };

  const hasFilters = Boolean(searchTerm || selectedCategory || minPrice || maxPrice);
  const title = selectedCategory
    ? categories.find((c) => c.slug === selectedCategory)?.name ?? "Products"
    : "Ready-to-Wear";

  return (
    <div className="bg-[linear-gradient(180deg,#fbf8f4_0%,#fff_100%)] py-12 md:py-16 lg:py-24">
      <Container>
        <section className="mb-14 grid gap-8 border-b border-[var(--porcia-border)] pb-10 lg:grid-cols-[1fr_0.65fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.34em] text-[var(--porcia-text-muted)]">Collections</p>
            <h1 className="mt-5 font-serif text-[clamp(3rem,8vw,6.5rem)] font-light leading-[0.94] tracking-[-0.05em]">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-[1rem] leading-8 text-[var(--porcia-text-secondary)]">
              Curated pieces, presented with the restraint of a luxury house and the clarity of a modern storefront.
            </p>
          </div>

          <div className="grid gap-3 rounded-[1.5rem] border border-[var(--porcia-border)] bg-white/70 p-5">
            <input
              type="search"
              placeholder="Search pieces"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 w-full rounded-full border border-[var(--porcia-border)] bg-transparent px-5 text-sm outline-none transition focus:border-[var(--porcia-fg)]"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="h-12 rounded-full border border-[var(--porcia-border)] bg-transparent px-5 text-sm outline-none transition focus:border-[var(--porcia-fg)]"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="h-12 rounded-full border border-[var(--porcia-border)] bg-transparent px-5 text-sm outline-none transition focus:border-[var(--porcia-fg)]"
              />
            </div>
          </div>
        </section>

        <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-12">
          <aside className="space-y-8">
            <div className="rounded-[1.5rem] border border-[var(--porcia-border)] bg-white/70 p-6">
              <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--porcia-text-muted)]">Sort</p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="mt-4 h-12 w-full rounded-full border border-[var(--porcia-border)] bg-transparent px-4 text-sm outline-none transition focus:border-[var(--porcia-fg)]"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="rounded-[1.5rem] border border-[var(--porcia-border)] bg-white/70 p-6">
              <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--porcia-text-muted)]">Category</p>
              <div className="mt-4 grid gap-3">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === ""}
                    onChange={() => setSelectedCategory("")}
                  />
                  <span className="text-sm text-[var(--porcia-text-secondary)]">All</span>
                </label>
                {categories.map((cat) => (
                  <label key={cat.id} className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat.slug}
                      onChange={() => setSelectedCategory(cat.slug)}
                    />
                    <span className="text-sm text-[var(--porcia-text-secondary)]">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {hasFilters && (
              <button
                onClick={resetFilters}
                className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--porcia-border)] px-6 text-xs uppercase tracking-[0.3em] transition hover:border-[var(--porcia-fg)]"
              >
                Reset Filters
              </button>
            )}
          </aside>

          <section>
            <div className="mb-8 flex items-center justify-between">
              <p className="text-sm text-[var(--porcia-text-muted)]">
                {!isLoading && totalElements > 0 ? `${totalElements} items` : ""}
              </p>
            </div>

            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="grid gap-4">
                    <div className="aspect-[4/5] animate-pulse rounded-[2rem] bg-[linear-gradient(180deg,#e7ddd1,#c7b09a)]" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-[rgba(0,0,0,0.08)]" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-[1.5rem] border border-[var(--porcia-border)] bg-white/70 p-10 text-center text-sm text-red-500">
                {error}
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-[1.5rem] border border-[var(--porcia-border)] bg-white/70 p-12 text-center">
                <p className="font-serif text-3xl font-light">No products found</p>
                {hasFilters && (
                  <button onClick={resetFilters} className="mt-4 text-xs uppercase tracking-[0.3em] text-[var(--porcia-gold)]">
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-16 flex items-center justify-center gap-4">
                    <button
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="h-12 rounded-full border border-[var(--porcia-border)] px-6 text-xs uppercase tracking-[0.3em] transition hover:border-[var(--porcia-fg)] disabled:opacity-30"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-[var(--porcia-text-muted)]">
                      Page {page + 1} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={page >= totalPages - 1}
                      className="h-12 rounded-full border border-[var(--porcia-border)] px-6 text-xs uppercase tracking-[0.3em] transition hover:border-[var(--porcia-fg)] disabled:opacity-30"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </Container>
    </div>
  );
}

export const CollectionPage = ShopPageContent;
export const Category = ShopPageContent;
export const Brand = ShopPageContent;
export const Filter = ShopPageContent;
export const Sort = ShopPageContent;
export const InfiniteScroll = ShopPageContent;
export const Search = ShopPageContent;
export const LuxuryProductGrid = ShopPageContent;
