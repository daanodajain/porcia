"use client";
import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import api from "@/lib/api";

interface Role {
  id: number;
  name: string;
  description: string;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const fetchRoles = () => {
    const token = localStorage.getItem("adminAuthToken");
    setIsLoading(true);
    api.get(`/cms/roles`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setRoles(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchRoles(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("adminAuthToken");
    try {
      await api.post(`/cms/roles`, formData, { headers: { Authorization: `Bearer ${token}` } });
      setFormData({ name: "", description: "" });
      setShowForm(false);
      fetchRoles();
    } catch {
      alert("Error creating role");
    }
  };

  const deleteRole = async (id: number) => {
    if (!confirm("Delete this role?")) return;
    const token = localStorage.getItem("adminAuthToken");
    try {
      await api.delete(`/cms/roles/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchRoles();
    } catch {
      alert("Error deleting role");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Roles</h1>
        <button onClick={() => setShowForm(!showForm)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "#111827", color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
          <Plus size={16} /> New Role
        </button>
      </div>

      {showForm && (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Create Role</h2>
          <form onSubmit={handleCreate} style={{ display: "grid", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Role Name *</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Description</label>
              <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, minHeight: 80 }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" style={{ flex: 1, padding: "10px 16px", borderRadius: 8, background: "#111827", color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
                Create Role
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: "10px 16px", borderRadius: 8, background: "#f3f4f6", color: "#374151", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        {isLoading ? (
          <div style={{ padding: 48, textAlign: "center" }}><Loader2 size={24} color="#9ca3af" /></div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Role Name", "Description", "Actions"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: "#6b7280", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.length === 0 ? (
                <tr><td colSpan={3} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>No roles.</td></tr>
              ) : roles.map(r => (
                <tr key={r.id}>
                  <td style={{ padding: "12px 14px", fontSize: 14, fontWeight: 500, borderBottom: "1px solid #f3f4f6" }}>{r.name}</td>
                  <td style={{ padding: "12px 14px", fontSize: 14, color: "#6b7280", borderBottom: "1px solid #f3f4f6" }}>{r.description || "—"}</td>
                  <td style={{ padding: "12px 14px", fontSize: 14, borderBottom: "1px solid #f3f4f6" }}>
                    <button onClick={() => deleteRole(r.id)} style={{ background: "#fef2f2", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer" }}>
                      <Trash2 size={14} color="#dc2626" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
