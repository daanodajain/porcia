"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

interface Role {
  id: number;
  name: string;
  description: string;
}

export default function AdminUserFormPage() {
  const params = useParams();
  const router = useRouter();
  const isEdit = Boolean(params && params.id && params.id !== "new");
  const userId = isEdit ? (params?.id as string) : null;

  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", roleId: "", isActive: true });

  useEffect(() => {
    const token = localStorage.getItem("adminAuthToken");
    api.get(`/cms/roles`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setRoles(res.data.data ?? []))
      .catch(() => {});

    if (isEdit && userId) {
      api.get(`/cms/admin-users/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          const u = res.data.data;
          setForm({ firstName: u.firstName, lastName: u.lastName, email: u.email, phone: u.phone, password: "", roleId: u.roleId, isActive: u.isActive });
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [isEdit, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const token = localStorage.getItem("adminAuthToken");

    try {
      if (isEdit && userId) {
        await api.put(`/cms/admin-users/${userId}`, {
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          roleId: parseInt(form.roleId),
          isActive: form.isActive,
        }, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await api.post(`/cms/admin-users`, {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          roleId: parseInt(form.roleId),
        }, { headers: { Authorization: `Bearer ${token}` } });
      }
      router.push("/admin/admin-users");
    } catch {
      alert("Error saving admin user");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div style={{ padding: 48, textAlign: "center" }}><Loader2 size={24} color="#9ca3af" /></div>;

  return (
    <div>
      <Link href="/admin/admin-users" style={{ display: "flex", alignItems: "center", gap: 8, color: "#3b82f6", marginBottom: 16, textDecoration: "none", fontSize: 14 }}>
        <ArrowLeft size={16} /> Back
      </Link>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24, maxWidth: 600 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{isEdit ? "Edit Admin User" : "New Admin User"}</h1>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>First Name *</label>
            <input type="text" required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Last Name</label>
            <input type="text" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Email {!isEdit && "*"}</label>
            <input type="email" required={!isEdit} disabled={isEdit} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, background: isEdit ? "#f9fafb" : "#fff" }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Phone</label>
            <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
          </div>

          {!isEdit && (
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Password *</label>
              <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }} />
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Role *</label>
            <select required value={form.roleId} onChange={e => setForm({ ...form, roleId: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}>
              <option value="">Select a role</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>

          {isEdit && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} style={{ width: 18, height: 18 }} />
              <label style={{ fontSize: 14 }}>Active</label>
            </div>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button type="submit" disabled={isSaving} style={{ flex: 1, padding: "10px 16px", borderRadius: 8, background: "#111827", color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
              {isSaving ? "Saving..." : isEdit ? "Update" : "Create"}
            </button>
            <Link href="/admin/admin-users" style={{ flex: 1, padding: "10px 16px", borderRadius: 8, background: "#f3f4f6", color: "#374151", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, textAlign: "center", textDecoration: "none" }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
