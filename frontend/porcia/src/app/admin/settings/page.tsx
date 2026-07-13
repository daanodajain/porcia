"use client";
import { useEffect, useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import api from "@/lib/api";

interface Setting {
  key: string;
  value: string;
  group: string;
  isSensitive: boolean;
  description: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSensitive, setShowSensitive] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    const token = localStorage.getItem("adminAuthToken");
    setIsLoading(true);
    api.get(`/cms/settings`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const data = res.data.data ?? [];
        setSettings(data);
        const form: Record<string, string> = {};
        data.forEach((s: Setting) => { form[s.key] = s.value; });
        setFormData(form);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("adminAuthToken");
    setIsSaving(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(formData).filter(([, value]) => value !== "••••••••"),
      );
      await api.put(`/cms/settings`, payload, { headers: { Authorization: `Bearer ${token}` } });
      alert("Settings saved successfully!");
    } catch {
      alert("Error saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div style={{ padding: 48, textAlign: "center" }}><Loader2 size={24} color="#9ca3af" /></div>;

  const groups = Array.from(new Set(settings.map(s => s.group)));

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 24 }}>Settings</h1>

      {groups.map(group => (
        <div key={group} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, textTransform: "capitalize" }}>{group}</h2>

          <div style={{ display: "grid", gap: 16 }}>
            {settings.filter(s => s.group === group).map(s => (
              <div key={s.key}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "#374151" }}>
                  {s.description || s.key}
                </label>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    type={s.isSensitive && !showSensitive[s.key] ? "password" : "text"}
                    value={formData[s.key] || ""}
                    onChange={e => setFormData({ ...formData, [s.key]: e.target.value })}
                    style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14 }}
                  />
                  {s.isSensitive && (
                    <button
                      type="button"
                      onClick={() => setShowSensitive({ ...showSensitive, [s.key]: !showSensitive[s.key] })}
                      style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#f9fafb", cursor: "pointer" }}
                    >
                      {showSensitive[s.key] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={handleSave} disabled={isSaving} style={{ padding: "10px 24px", borderRadius: 8, background: "#111827", color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
