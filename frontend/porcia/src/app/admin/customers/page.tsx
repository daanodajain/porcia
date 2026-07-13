"use client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";

interface Customer { id: number; firstName: string; lastName: string; email: string; phone: string; isActive: boolean; createdAt: string; }

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("adminAuthToken");
    setIsLoading(true);
    api.get(`/cms/customers?page=${page}&size=15`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => { setCustomers(res.data.data?.content ?? []); setTotalPages(res.data.data?.totalPages ?? 0); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [page]);

  const th = { padding: "10px 14px", textAlign: "left" as const, fontSize: 12, fontWeight: 600 as const, textTransform: "uppercase" as const, letterSpacing: "0.05em", color: "#6b7280", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" };
  const td = { padding: "12px 14px", fontSize: 14, color: "#374151", borderBottom: "1px solid #f3f4f6" };

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 24 }}>Customers</h1>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        {isLoading ? (
          <div style={{ padding: 48, textAlign: "center" }}><Loader2 size={24} color="#9ca3af" /></div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["Name", "Email", "Phone", "Status", "Joined"].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>
              {customers.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>No customers yet.</td></tr>
              ) : customers.map(c => (
                <tr key={c.id}>
                  <td style={{ ...td, fontWeight: 500 }}>{c.firstName} {c.lastName}</td>
                  <td style={{ ...td, color: "#6b7280" }}>{c.email}</td>
                  <td style={{ ...td, color: "#6b7280" }}>{c.phone ?? "—"}</td>
                  <td style={td}><span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 999, background: c.isActive ? "#dcfce7" : "#fee2e2", color: c.isActive ? "#16a34a" : "#dc2626" }}>{c.isActive ? "Active" : "Inactive"}</span></td>
                  <td style={{ ...td, color: "#6b7280", fontSize: 13 }}>{c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-GB") : "—"}</td>
                </tr>
              ))}
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
