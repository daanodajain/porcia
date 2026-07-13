"use client";
import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Edit2, Trash2, Lock, Unlock } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roleName: string;
  isActive: boolean;
  isLocked: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchUsers = useCallback(() => {
    const token = localStorage.getItem("adminAuthToken");
    setIsLoading(true);
    api.get(`/cms/admin-users?page=${page}&size=20`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => { setUsers(res.data.data?.content ?? []); setTotalPages(res.data.data?.totalPages ?? 0); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleLock = async (id: number, locked: boolean) => {
    const token = localStorage.getItem("adminAuthToken");
    await api.patch(`/cms/admin-users/${id}/lock`, { locked: !locked }, { headers: { Authorization: `Bearer ${token}` } });
    fetchUsers();
  };

  const deleteUser = async (id: number) => {
    if (!confirm("Delete this admin user?")) return;
    const token = localStorage.getItem("adminAuthToken");
    await api.delete(`/cms/admin-users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchUsers();
  };

  const th = { padding: "10px 14px", textAlign: "left" as const, fontSize: 12, fontWeight: 600 as const, textTransform: "uppercase" as const, letterSpacing: "0.05em", color: "#6b7280", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" };
  const td = { padding: "12px 14px", fontSize: 14, color: "#374151", borderBottom: "1px solid #f3f4f6" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Admin Users</h1>
        <Link href="/admin/admin-users/new" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "#111827", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
          <Plus size={16} /> New Admin
        </Link>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        {isLoading ? (
          <div style={{ padding: 48, textAlign: "center" }}><Loader2 size={24} color="#9ca3af" /></div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["Name", "Email", "Role", "Status", "Locked", "Actions"].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>No admin users.</td></tr>
              ) : users.map(u => (
                <tr key={u.id}>
                  <td style={{ ...td, fontWeight: 500 }}>{u.firstName} {u.lastName}</td>
                  <td style={{ ...td, color: "#6b7280" }}>{u.email}</td>
                  <td style={{ ...td, fontSize: 13 }}><span style={{ padding: "2px 8px", borderRadius: 6, background: "#f3f4f6", color: "#374151" }}>{u.roleName}</span></td>
                  <td style={td}><span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 999, background: u.isActive ? "#dcfce7" : "#fee2e2", color: u.isActive ? "#16a34a" : "#dc2626" }}>{u.isActive ? "Active" : "Inactive"}</span></td>
                  <td style={td}><span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 999, background: u.isLocked ? "#fee2e2" : "#dcfce7", color: u.isLocked ? "#dc2626" : "#16a34a" }}>{u.isLocked ? "Locked" : "Unlocked"}</span></td>
                  <td style={{ ...td, display: "flex", gap: 6 }}>
                    <Link href={`/admin/admin-users/${u.id}`} style={{ background: "#f0f9ff", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                      <Edit2 size={14} color="#0369a1" />
                    </Link>
                    <button onClick={() => toggleLock(u.id, u.isLocked)} style={{ background: u.isLocked ? "#f0fdf4" : "#fef2f2", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer" }}>
                      {u.isLocked ? <Unlock size={14} color="#16a34a" /> : <Lock size={14} color="#dc2626" />}
                    </button>
                    <button onClick={() => deleteUser(u.id)} style={{ background: "#fef2f2", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer" }}>
                      <Trash2 size={14} color="#dc2626" />
                    </button>
                  </td>
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
