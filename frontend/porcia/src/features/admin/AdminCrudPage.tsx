"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import api from "@/lib/api";

interface Column<T> {
  label: string;
  render: (row: T) => React.ReactNode;
}

interface Props<T extends { id: string | number; name?: string; isActive?: boolean }> {
  title: string;
  apiPath: string;
  editPath: string;
  columns: Column<T>[];
}

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("adminAuthToken") : null;
}

export function AdminCrudPage<T extends { id: string; name: string; isActive?: boolean }>({
  title, apiPath, editPath, columns,
}: Props<T>) {
  const [rows, setRows] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      const res = await api.get(`${apiPath}?page=0&size=100`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setRows(res.data.data?.content ?? []);
    } catch { setError("Failed to load data."); }
    finally { setIsLoading(false); }
  }, [apiPath]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    setDeleting(id);
    try {
      await api.delete(`${apiPath}/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setRows(prev => prev.filter(r => r.id !== id));
    } catch { alert("Delete failed. Please try again."); }
    finally { setDeleting(null); }
  };

  const th: React.CSSProperties = { padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" };
  const td: React.CSSProperties = { padding: "12px 14px", fontSize: 14, color: "#374151", borderBottom: "1px solid #f3f4f6" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>{title}</h1>
        <Link href={`${editPath}/new`}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "#111827", color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 14, textDecoration: "none", fontWeight: 500 }}>
          <Plus size={15} /> New
        </Link>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        {isLoading ? (
          <div style={{ padding: 48, textAlign: "center", color: "#9ca3af" }}>
            <Loader2 size={24} />
          </div>
        ) : error ? (
          <div style={{ padding: 32, textAlign: "center", color: "#ef4444" }}>{error}</div>
        ) : rows.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "#9ca3af" }}>
            No {title.toLowerCase()} yet.{" "}
            <Link href={`${editPath}/new`} style={{ color: "#111827", textDecoration: "underline" }}>Create one</Link>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {columns.map(c => <th key={c.label} style={th}>{c.label}</th>)}
                <th style={{ ...th, width: 80 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id}>
                  {columns.map(c => <td key={c.label} style={td}>{c.render(row)}</td>)}
                  <td style={{ ...td, display: "flex", gap: 8 }}>
                    <Link href={`${editPath}/${row.id}`}
                      style={{ padding: "4px 8px", background: "#f3f4f6", borderRadius: 6, display: "flex", alignItems: "center" }}>
                      <Pencil size={14} color="#374151" />
                    </Link>
                    <button onClick={() => handleDelete(row.id)} disabled={deleting === row.id}
                      style={{ padding: "4px 8px", background: "#fef2f2", borderRadius: 6, border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                      {deleting === row.id
                        ? <Loader2 size={14} />
                        : <Trash2 size={14} color="#ef4444" />}
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

// ── Reusable simple form ──────────────────────────────────────────────────────
interface SimpleFormField {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
}

interface SimpleFormProps {
  title: string;
  apiPath: string;
  backPath: string;
  fields: SimpleFormField[];
  itemId?: string;
}

export function AdminSimpleForm({ title, apiPath, backPath, fields, itemId }: SimpleFormProps) {
  const isEdit = !!itemId;
  const [values, setValues] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit || !itemId) return;
    const token = getToken();
    api.get(`${apiPath}/${itemId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const d = res.data.data;
        const vals: Record<string, string> = {};
        fields.forEach(f => { vals[f.name] = d[f.name] ?? ""; });
        setValues(vals);
      })
      .catch(() => setError("Could not load item."))
      .finally(() => setIsFetching(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const set = (name: string, val: string) => {
    setValues(prev => {
      const next = { ...prev, [name]: val };
      if (name === "name" && !isEdit) next.slug = autoSlug(val);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setError(null); setSuccess(null);
    const token = getToken();
    try {
      if (isEdit) {
        await api.put(`${apiPath}/${itemId}`, values, { headers: { Authorization: `Bearer ${token}` } });
        setSuccess("Saved successfully.");
      } else {
        await api.post(apiPath, values, { headers: { Authorization: `Bearer ${token}` } });
        setSuccess("Created successfully.");
        setValues({});
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? "Save failed.");
    } finally { setIsLoading(false); }
  };

  const inputSt: React.CSSProperties = {
    width: "100%", height: 38, border: "1px solid #d1d5db", borderRadius: 8,
    padding: "0 12px", fontSize: 14, outline: "none", boxSizing: "border-box",
    background: "#fff", color: "#111827",
  };

  if (isFetching) return (
    <div style={{ padding: 48, textAlign: "center", color: "#9ca3af" }}>
      <Loader2 size={24} />
    </div>
  );

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <a href={backPath} style={{ fontSize: 13, color: "#6b7280", textDecoration: "none" }}>← Back</a>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>
          {isEdit ? `Edit ${title}` : `New ${title}`}
        </h1>
      </div>

      {error && (
        <div style={{ marginBottom: 12, padding: "10px 14px", background: "#fef2f2", borderRadius: 8, color: "#dc2626", fontSize: 14 }}>{error}</div>
      )}
      {success && (
        <div style={{ marginBottom: 12, padding: "10px 14px", background: "#f0fdf4", borderRadius: 8, color: "#16a34a", fontSize: 14 }}>{success}</div>
      )}

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24 }}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
          {fields.map(f => (
            <div key={f.name}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", marginBottom: 6 }}>
                {f.label}{f.required && " *"}
              </label>
              {f.multiline ? (
                <textarea value={values[f.name] ?? ""} onChange={e => set(f.name, e.target.value)}
                  style={{ ...inputSt, height: 100, resize: "vertical", paddingTop: 8 }} />
              ) : (
                <input type={f.type ?? "text"} value={values[f.name] ?? ""}
                  onChange={e => set(f.name, e.target.value)}
                  required={f.required} style={inputSt} />
              )}
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
            <a href={backPath} style={{ fontSize: 14, color: "#6b7280", textDecoration: "none" }}>Cancel</a>
            <button type="submit" disabled={isLoading}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "#111827", color: "#fff", padding: "9px 20px", borderRadius: 8, border: "none", fontSize: 14, cursor: "pointer", opacity: isLoading ? 0.6 : 1 }}>
              {isLoading && <Loader2 size={14} />}
              {isLoading ? "Saving…" : isEdit ? "Save Changes" : `Create ${title}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
