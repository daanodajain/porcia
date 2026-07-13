"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import api from "@/lib/api";

interface Category { id: string; name: string; }
interface Brand { id: string; name: string; }
interface Collection { id: string; name: string; }

interface ProductFormData {
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  brandId: string;
  collectionId: string;
  description: string;
  mrp: string;
  sellingPrice: string;
  stockQuantity: string;
  isActive: boolean;
  status: string;
}

const DEFAULT_FORM: ProductFormData = {
  name: "", slug: "", sku: "", categoryId: "", brandId: "", collectionId: "",
  description: "", mrp: "", sellingPrice: "", stockQuantity: "", isActive: true, status: "DRAFT",
};

const STATUS_OPTIONS = ["DRAFT", "PUBLISHED", "ARCHIVED"];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function AdminProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const isEdit = !!productId;

  const [form, setForm] = useState<ProductFormData>(DEFAULT_FORM);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("adminAuthToken") : null;
  const authHeaders = { Authorization: `Bearer ${token}` };

  // Fetch dropdown data
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [catRes, brandRes, colRes] = await Promise.all([
          api.get("/cms/categories?page=0&size=100", { headers: authHeaders }),
          api.get("/cms/brands?page=0&size=100", { headers: authHeaders }),
          api.get("/cms/collections?page=0&size=100", { headers: authHeaders }),
        ]);
        setCategories(catRes.data.data?.content ?? []);
        setBrands(brandRes.data.data?.content ?? []);
        setCollections(colRes.data.data?.content ?? []);
      } catch {
        // non-fatal — dropdowns may be empty
      }
    };
    fetchMeta();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch existing product on edit
  useEffect(() => {
    if (!isEdit || !productId) return;
    setIsFetching(true);
    api.get(`/cms/products/${productId}`, { headers: authHeaders })
      .then(res => {
        const p = res.data.data;
        setForm({
          name: p.name ?? "",
          slug: p.slug ?? "",
          sku: p.sku ?? "",
          categoryId: p.category?.id ?? "",
          brandId: p.brand?.id ?? "",
          collectionId: p.collection?.id ?? "",
          description: p.description ?? "",
          mrp: p.mrp?.toString() ?? "",
          sellingPrice: p.sellingPrice?.toString() ?? "",
          stockQuantity: p.stockQuantity?.toString() ?? "",
          isActive: p.isActive ?? true,
          status: p.status ?? "DRAFT",
        });
      })
      .catch(() => setError("Could not load product."))
      .finally(() => setIsFetching(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const set = (field: keyof ProductFormData, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleNameChange = (name: string) => {
    set("name", name);
    if (!isEdit) set("slug", slugify(name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    const payload = {
      name: form.name,
      slug: form.slug,
      sku: form.sku,
      categoryId: form.categoryId ? Number(form.categoryId) : null,
      brandId: form.brandId ? Number(form.brandId) : null,
      collectionId: form.collectionId ? Number(form.collectionId) : null,
      description: form.description || null,
      mrp: parseFloat(form.mrp) || 0,
      sellingPrice: parseFloat(form.sellingPrice) || 0,
      stockQuantity: parseInt(form.stockQuantity) || 0,
      isActive: form.isActive,
      status: form.status,
    };

    try {
      if (isEdit) {
        await api.put(`/cms/products/${productId}`, payload, { headers: authHeaders });
        setSuccessMsg("Product updated successfully.");
      } else {
        const res = await api.post("/cms/products", payload, { headers: authHeaders });
        setSuccessMsg("Product created successfully.");
        setTimeout(() => router.push(`/admin/products/${res.data.data?.id}`), 1200);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? "Failed to save product. Please check all fields.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  const inputCls = "h-10 w-full rounded-lg border border-gray-200 bg-transparent px-3 text-sm outline-none transition focus:border-black";
  const labelCls = "block text-xs font-medium uppercase tracking-wider text-gray-500 mb-1.5";
  const sectionCls = "rounded-xl bg-white p-6 shadow-sm";

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/products" className="flex items-center gap-1 text-sm text-gray-500 hover:text-black">
          <ArrowLeft size={16} /> Products
        </Link>
        <h1 className="text-xl font-bold">{isEdit ? "Edit Product" : "New Product"}</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-600">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6">

        {/* Basic Info */}
        <div className={sectionCls}>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Basic Information</h2>
          <div className="grid gap-4">
            <div>
              <label className={labelCls}>Product Name *</label>
              <input
                className={inputCls}
                value={form.name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="e.g. Atelier Silk Coat"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Slug *</label>
                <input
                  className={inputCls}
                  value={form.slug}
                  onChange={e => set("slug", e.target.value)}
                  placeholder="atelier-silk-coat"
                  required
                />
              </div>
              <div>
                <label className={labelCls}>SKU *</label>
                <input
                  className={inputCls}
                  value={form.sku}
                  onChange={e => set("sku", e.target.value)}
                  placeholder="PRC-001"
                  required
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea
                className={`${inputCls} h-28 resize-none py-2`}
                value={form.description}
                onChange={e => set("description", e.target.value)}
                placeholder="Short product description…"
              />
            </div>
          </div>
        </div>

        {/* Taxonomy */}
        <div className={sectionCls}>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Taxonomy</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Category *</label>
              <select
                className={`${inputCls} cursor-pointer`}
                value={form.categoryId}
                onChange={e => set("categoryId", e.target.value)}
                required
              >
                <option value="">Select…</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Brand *</label>
              <select
                className={`${inputCls} cursor-pointer`}
                value={form.brandId}
                onChange={e => set("brandId", e.target.value)}
                required
              >
                <option value="">Select…</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Collection</label>
              <select
                className={`${inputCls} cursor-pointer`}
                value={form.collectionId}
                onChange={e => set("collectionId", e.target.value)}
              >
                <option value="">None</option>
                {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className={sectionCls}>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Pricing & Inventory</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>MRP (EUR) *</label>
              <input
                className={inputCls}
                type="number"
                min="0"
                step="0.01"
                value={form.mrp}
                onChange={e => set("mrp", e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className={labelCls}>Selling Price (EUR) *</label>
              <input
                className={inputCls}
                type="number"
                min="0"
                step="0.01"
                value={form.sellingPrice}
                onChange={e => set("sellingPrice", e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className={labelCls}>Stock Qty</label>
              <input
                className={inputCls}
                type="number"
                min="0"
                value={form.stockQuantity}
                onChange={e => set("stockQuantity", e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Status & Visibility */}
        <div className={sectionCls}>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Publication Status</label>
              <select
                className={`${inputCls} cursor-pointer`}
                value={form.status}
                onChange={e => set("status", e.target.value)}
              >
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex cursor-pointer items-center gap-3">
                <div
                  role="checkbox"
                  aria-checked={form.isActive}
                  onClick={() => set("isActive", !form.isActive)}
                  className={`relative h-5 w-9 rounded-full transition ${form.isActive ? "bg-black " : "bg-gray-300"}`}
                >
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${form.isActive ? "left-[1.125rem]" : "left-0.5"}`} />
                </div>
                <span className="text-sm">{form.isActive ? "Active (visible in shop)" : "Inactive (hidden)"}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link href="/admin/products" className="text-sm text-gray-500 hover:text-black">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg bg-black px-6 py-2.5 text-sm text-white transition hover:bg-gray-800 disabled:opacity-50 "
          >
            {isLoading && <Loader2 size={14} className="animate-spin" />}
            {isLoading ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
