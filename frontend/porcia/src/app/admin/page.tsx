"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { DollarSign, Package, Users, ShoppingCart } from "lucide-react";

interface Order { id: number; orderNumber: string; orderStatus: string; grandTotal: number; }
interface Stats { totalRevenue: number; totalOrders: number; totalCustomers: number; recentOrders: Order[]; }

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ background: "#f3f4f6", borderRadius: 999, padding: 12, display: "flex" }}>{icon}</div>
        <div>
          <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginTop: 2 }}>{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminAuthToken");
    api.get("/cms/dashboard", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ height: 32, width: 200, borderRadius: 8, background: "#e5e7eb" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[0,1,2].map(i => <div key={i} style={{ height: 100, borderRadius: 12, background: "#e5e7eb" }} />)}
      </div>
    </div>
  );

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>Dashboard</h1>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <StatCard title="Total Revenue" value={`EUR ${stats?.totalRevenue?.toFixed(2) ?? "0.00"}`} icon={<DollarSign size={20} color="#6b7280" />} />
        <StatCard title="Total Orders" value={String(stats?.totalOrders ?? 0)} icon={<ShoppingCart size={20} color="#6b7280" />} />
        <StatCard title="Total Customers" value={String(stats?.totalCustomers ?? 0)} icon={<Users size={20} color="#6b7280" />} />
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 16 }}>Recent Orders</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
              {["Order #", "Status", "Total"].map(h => <th key={h} style={{ padding: "8px 0", textAlign: "left", fontSize: 12, color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {stats?.recentOrders?.length ? stats.recentOrders.map(o => (
              <tr key={o.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "12px 0", fontSize: 14 }}>
                  <Link href={`/admin/orders/${o.id}`} style={{ color: "#4f46e5", textDecoration: "none", fontWeight: 500 }}>{o.orderNumber}</Link>
                </td>
                <td style={{ padding: "12px 0", fontSize: 14, color: "#374151" }}>{o.orderStatus}</td>
                <td style={{ padding: "12px 0", fontSize: 14, color: "#374151" }}>EUR {o.grandTotal?.toFixed(2)}</td>
              </tr>
            )) : (
              <tr><td colSpan={3} style={{ padding: 24, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>No recent orders.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Quick links */}
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
        {[
          { href: "/admin/products/new", label: "Add Product", icon: <Package size={18} /> },
          { href: "/admin/categories/new", label: "Add Category", icon: <Package size={18} /> },
          { href: "/admin/brands/new", label: "Add Brand", icon: <Package size={18} /> },
          { href: "/admin/collections/new", label: "Add Collection", icon: <Package size={18} /> },
          { href: "/admin/orders", label: "View Orders", icon: <ShoppingCart size={18} /> },
          { href: "/admin/shipments", label: "Manage Shipments", icon: <Package size={18} /> },
        ].map(q => (
          <Link key={q.href} href={q.href} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, fontSize: 14, color: "#374151", textDecoration: "none", fontWeight: 500 }}>
            {q.icon} {q.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
