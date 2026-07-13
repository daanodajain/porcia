"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";

interface Order { id: number; orderNumber: string; orderStatus: string; grandTotal: number; createdAt: string; }

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  PENDING:    { bg: "#fef9c3", color: "#854d0e" },
  CONFIRMED:  { bg: "#dbeafe", color: "#1d4ed8" },
  SHIPPED:    { bg: "#e0e7ff", color: "#4338ca" },
  DELIVERED:  { bg: "#dcfce7", color: "#16a34a" },
  CANCELLED:  { bg: "#fee2e2", color: "#dc2626" },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("adminAuthToken");
    setIsLoading(true);
    api.get(`/cms/orders?page=${page}&size=15`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => { setOrders(res.data.data?.content ?? []); setTotalPages(res.data.data?.totalPages ?? 0); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [page]);

  const th = { padding: "10px 14px", textAlign: "left" as const, fontSize: 12, fontWeight: 600 as const, textTransform: "uppercase" as const, letterSpacing: "0.05em", color: "#6b7280", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" };
  const td = { padding: "12px 14px", fontSize: 14, color: "#374151", borderBottom: "1px solid #f3f4f6" };

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 24 }}>Orders</h1>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        {isLoading ? (
          <div style={{ padding: 48, textAlign: "center" }}><Loader2 size={24} color="#9ca3af" /></div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["Order #", "Status", "Total", "Date"].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>No orders yet.</td></tr>
              ) : orders.map(o => {
                const s = STATUS_COLORS[o.orderStatus] ?? { bg: "#f3f4f6", color: "#374151" };
                return (
                  <tr key={o.id}>
                    <td style={{ ...td, fontWeight: 500 }}>
                      <Link href={`/admin/orders/${o.id}`} style={{ color: "#4f46e5", textDecoration: "none" }}>{o.orderNumber}</Link>
                    </td>
                    <td style={td}><span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 999, background: s.bg, color: s.color }}>{o.orderStatus}</span></td>
                    <td style={td}>EUR {Number(o.grandTotal).toFixed(2)}</td>
                    <td style={{ ...td, color: "#6b7280", fontSize: 13 }}>{o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-GB") : "—"}</td>
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
