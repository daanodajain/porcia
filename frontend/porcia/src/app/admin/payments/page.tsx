"use client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";

interface Payment {
  id: number;
  orderNumber: string;
  paymentGateway: string;
  transactionId: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  paidAt: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  PAID:        { bg: "#dcfce7", color: "#16a34a" },
  PENDING:     { bg: "#fef9c3", color: "#854d0e" },
  FAILED:      { bg: "#fee2e2", color: "#dc2626" },
  COD_PENDING: { bg: "#e0e7ff", color: "#4338ca" },
};

export default function PaymentsAdminPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    api.get(`/cms/payments?page=${page}&size=20`)
      .then(res => { setPayments(res.data.data?.content ?? []); setTotalPages(res.data.data?.totalPages ?? 0); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [page]);

  const th: React.CSSProperties = { padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" };
  const td: React.CSSProperties = { padding: "12px 14px", fontSize: 14, color: "#374151", borderBottom: "1px solid #f3f4f6" };

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 24 }}>Payments</h1>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        {isLoading ? (
          <div style={{ padding: 48, textAlign: "center" }}><Loader2 size={24} color="#9ca3af" /></div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["Order #", "Gateway", "Transaction ID", "Amount", "Status", "Paid At"].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>No payments yet.</td></tr>
              ) : payments.map(p => {
                const s = STATUS_COLORS[p.paymentStatus] ?? { bg: "#f3f4f6", color: "#374151" };
                return (
                  <tr key={p.id}>
                    <td style={{ ...td, fontWeight: 500 }}>{p.orderNumber}</td>
                    <td style={{ ...td, color: "#6b7280" }}>{p.paymentGateway ?? "—"}</td>
                    <td style={{ ...td, fontSize: 12, color: "#6b7280" }}>{p.transactionId ?? "—"}</td>
                    <td style={{ ...td, fontWeight: 500 }}>{p.currency} {Number(p.amount).toFixed(2)}</td>
                    <td style={td}><span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 999, background: s.bg, color: s.color }}>{p.paymentStatus}</span></td>
                    <td style={{ ...td, color: "#6b7280", fontSize: 13 }}>{p.paidAt ? new Date(p.paidAt).toLocaleString("en-GB") : "—"}</td>
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
