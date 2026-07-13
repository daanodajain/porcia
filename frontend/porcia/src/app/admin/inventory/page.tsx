"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, AlertTriangle } from "lucide-react";
import api from "@/lib/api";

interface Product {
  id: number;
  name: string;
  sku: string;
  stockQuantity: number;
  sellingPrice: number;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState("all"); // all, low, out

  const fetchProducts = useCallback(() => {
    const token = localStorage.getItem("adminAuthToken");
    setIsLoading(true);
    api.get(`/cms/products?page=${page}&size=20`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        let data = res.data.data?.content ?? [];
        if (filter === "low") data = data.filter((p: Product) => p.stockQuantity > 0 && p.stockQuantity <= 10);
        if (filter === "out") data = data.filter((p: Product) => p.stockQuantity === 0);
        setProducts(data);
        setTotalPages(res.data.data?.totalPages ?? 0);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [filter, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const th = { padding: "10px 14px", textAlign: "left" as const, fontSize: 12, fontWeight: 600 as const, textTransform: "uppercase" as const, letterSpacing: "0.05em", color: "#6b7280", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" };
  const td = { padding: "12px 14px", fontSize: 14, color: "#374151", borderBottom: "1px solid #f3f4f6" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Inventory</h1>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "low", "out"].map(f => (
            <button key={f} onClick={() => { setFilter(f); setPage(0); }} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, background: filter === f ? "#111827" : "#fff", color: filter === f ? "#fff" : "#374151", cursor: "pointer" }}>
              {f === "all" ? "All" : f === "low" ? "Low Stock" : "Out of Stock"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        {isLoading ? (
          <div style={{ padding: 48, textAlign: "center" }}><Loader2 size={24} color="#9ca3af" /></div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["Product", "SKU", "Price", "Stock", "Status", "Action"].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>No products.</td></tr>
              ) : products.map(p => {
                const isLow = p.stockQuantity > 0 && p.stockQuantity <= 10;
                const isOut = p.stockQuantity === 0;
                return (
                  <tr key={p.id}>
                    <td style={{ ...td, fontWeight: 500 }}>{p.name}</td>
                    <td style={{ ...td, color: "#6b7280", fontSize: 13 }}>{p.sku}</td>
                    <td style={{ ...td, fontWeight: 500 }}>EUR {Number(p.sellingPrice).toFixed(2)}</td>
                    <td style={{ ...td, fontWeight: 500 }}>{p.stockQuantity}</td>
                    <td style={td}>
                      <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 999, background: isOut ? "#fee2e2" : isLow ? "#fef9c3" : "#dcfce7", color: isOut ? "#dc2626" : isLow ? "#854d0e" : "#16a34a", display: "inline-flex", alignItems: "center", gap: 4 }}>
                        {isOut && <AlertTriangle size={12} />}
                        {isOut ? "Out" : isLow ? "Low" : "OK"}
                      </span>
                    </td>
                    <td style={td}>
                      <Link href={`/admin/products/${p.id}`} style={{ color: "#111827", textDecoration: "underline", fontSize: 13 }}>
                        Edit product
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: 14 }}>← Prev</button>
          <span style={{ padding: "6px 14px", fontSize: 14, color: "#6b7280" }}>{page + 1} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: 14 }}>Next →</button>
        </div>
      )}
    </div>
  );
}
