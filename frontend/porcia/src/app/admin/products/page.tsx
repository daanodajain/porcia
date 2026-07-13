"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Loader2 } from "lucide-react";
import api from "@/lib/api";

interface Product { id: number; name: string; sku: string; sellingPrice: number; stockQuantity: number; status: string; isActive: boolean; }

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProducts = async (p = 0) => {
    setIsLoading(true);
    const token = localStorage.getItem("adminAuthToken");
    try {
      const res = await api.get(`/cms/products?page=${p}&size=15`, { headers: { Authorization: `Bearer ${token}` } });
      setProducts(res.data.data?.content ?? []);
      setTotalPages(res.data.data?.totalPages ?? 0);
    } catch { setProducts([]); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchProducts(page); }, [page]);

  const th = { padding: "10px 14px", textAlign: "left" as const, fontSize: 12, fontWeight: 600 as const, textTransform: "uppercase" as const, letterSpacing: "0.05em", color: "#6b7280", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" };
  const td = { padding: "12px 14px", fontSize: 14, color: "#374151", borderBottom: "1px solid #f3f4f6" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Products</h1>
        <Link href="/admin/products/new" style={{ display: "flex", alignItems: "center", gap: 6, background: "#111827", color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 14, textDecoration: "none", fontWeight: 500 }}>
          <Plus size={15} /> New Product
        </Link>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        {isLoading ? (
          <div style={{ padding: 48, textAlign: "center" }}><Loader2 size={24} style={{ animation: "spin 1s linear infinite", color: "#9ca3af" }} /></div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Name", "SKU", "Price (EUR)", "Stock", "Status"].map(h => <th key={h} style={th}>{h}</th>)}
                <th style={{ ...th, width: 60 }}>Edit</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>No products yet.</td></tr>
              ) : products.map(p => (
                <tr key={p.id}>
                  <td style={{ ...td, fontWeight: 500 }}>{p.name}</td>
                  <td style={{ ...td }}><code style={{ fontSize: 12, color: "#6b7280" }}>{p.sku}</code></td>
                  <td style={td}>EUR {Number(p.sellingPrice).toFixed(2)}</td>
                  <td style={td}>{p.stockQuantity}</td>
                  <td style={td}>
                    <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 999,
                      background: p.status === "PUBLISHED" ? "#dcfce7" : p.status === "ARCHIVED" ? "#fee2e2" : "#fef9c3",
                      color: p.status === "PUBLISHED" ? "#16a34a" : p.status === "ARCHIVED" ? "#dc2626" : "#854d0e" }}>
                      {p.status ?? "DRAFT"}
                    </span>
                  </td>
                  <td style={td}>
                    <Link href={`/admin/products/${p.id}`} style={{ display: "inline-flex", padding: "4px 8px", background: "#f3f4f6", borderRadius: 6 }}>
                      <Pencil size={14} color="#374151" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: 14, opacity: page === 0 ? 0.4 : 1 }}>← Prev</button>
          <span style={{ padding: "6px 14px", fontSize: 14, color: "#6b7280" }}>{page + 1} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
            style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: 14, opacity: page >= totalPages - 1 ? 0.4 : 1 }}>Next →</button>
        </div>
      )}
    </div>
  );
}
