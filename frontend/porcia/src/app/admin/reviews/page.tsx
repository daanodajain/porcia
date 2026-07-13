"use client";
import { useCallback, useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import api from "@/lib/api";

interface Review {
  id: number;
  productId: number;
  customerName: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  PENDING:  { bg: "#fef9c3", color: "#854d0e" },
  APPROVED: { bg: "#dcfce7", color: "#16a34a" },
  REJECTED: { bg: "#fee2e2", color: "#dc2626" },
};

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchReviews = useCallback(() => {
    setIsLoading(true);
    api.get(`/cms/reviews?page=${page}&size=20&status=${filter}`)
      .then(res => { setReviews(res.data.data?.content ?? []); setTotalPages(res.data.data?.totalPages ?? 0); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [filter, page]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const moderate = async (id: number, status: string) => {
    await api.patch(`/cms/reviews/${id}/moderate`, { status });
    fetchReviews();
  };

  const th: React.CSSProperties = { padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" };
  const td: React.CSSProperties = { padding: "12px 14px", fontSize: 14, color: "#374151", borderBottom: "1px solid #f3f4f6" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Reviews</h1>
        <div style={{ display: "flex", gap: 8 }}>
          {["PENDING", "APPROVED", "REJECTED"].map(s => (
            <button key={s} onClick={() => { setFilter(s); setPage(0); }}
              style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13,
                background: filter === s ? "#111827" : "#fff", color: filter === s ? "#fff" : "#374151", cursor: "pointer" }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        {isLoading ? (
          <div style={{ padding: 48, textAlign: "center" }}><Loader2 size={24} color="#9ca3af" /></div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["Customer", "Product ID", "Rating", "Comment", "Status", "Date", "Actions"].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>No reviews.</td></tr>
              ) : reviews.map(r => {
                const s = STATUS_COLORS[r.status] ?? { bg: "#f3f4f6", color: "#374151" };
                return (
                  <tr key={r.id}>
                    <td style={{ ...td, fontWeight: 500 }}>{r.customerName}</td>
                    <td style={{ ...td, color: "#6b7280" }}>#{r.productId}</td>
                    <td style={td}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</td>
                    <td style={{ ...td, maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.comment ?? "—"}</td>
                    <td style={td}><span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 999, background: s.bg, color: s.color }}>{r.status}</span></td>
                    <td style={{ ...td, color: "#6b7280", fontSize: 13 }}>{new Date(r.createdAt).toLocaleDateString("en-GB")}</td>
                    <td style={{ ...td, display: "flex", gap: 6 }}>
                      {r.status !== "APPROVED" && (
                        <button onClick={() => moderate(r.id, "APPROVED")} title="Approve"
                          style={{ background: "#f0fdf4", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer" }}>
                          <CheckCircle size={16} color="#16a34a" />
                        </button>
                      )}
                      {r.status !== "REJECTED" && (
                        <button onClick={() => moderate(r.id, "REJECTED")} title="Reject"
                          style={{ background: "#fef2f2", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer" }}>
                          <XCircle size={16} color="#dc2626" />
                        </button>
                      )}
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
