"use client";
import { useEffect, useState } from "react";
import { Loader2, TrendingUp, ShoppingCart, Users, DollarSign, type LucideIcon } from "lucide-react";
import api from "@/lib/api";

interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  ordersToday: number;
  ordersThisWeek: number;
  ordersThisMonth: number;
  topProducts: Array<{ id: number; name: string; sold: number; revenue: number }>;
  recentOrders: Array<{ id: number; orderNumber: string; grandTotal: number; orderStatus: string; createdAt: string }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminAuthToken");
    setIsLoading(true);
    api.get(`/cms/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setData(res.data.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div style={{ padding: 48, textAlign: "center" }}><Loader2 size={24} color="#9ca3af" /></div>;
  if (!data) return <div style={{ padding: 24, color: "#dc2626" }}>Failed to load analytics.</div>;

  const StatCard = ({ icon: Icon, label, value, subtext }: { icon: LucideIcon; label: string; value: string | number; subtext?: string }) => (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, display: "flex", gap: 16, alignItems: "flex-start" }}>
      <div style={{ padding: 12, borderRadius: 8, background: "#f0f9ff" }}>
        <Icon size={24} color="#0369a1" />
      </div>
      <div>
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>{value}</div>
        {subtext && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{subtext}</div>}
      </div>
    </div>
  );

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 24 }}>Analytics</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard icon={DollarSign} label="Total Revenue" value={`€${data.totalRevenue.toFixed(2)}`} subtext={`Today: €${data.revenueToday.toFixed(2)}`} />
        <StatCard icon={ShoppingCart} label="Total Orders" value={data.totalOrders} subtext={`Today: ${data.ordersToday}`} />
        <StatCard icon={Users} label="Total Customers" value={data.totalCustomers} />
        <StatCard icon={TrendingUp} label="This Month" value={`€${data.revenueThisMonth.toFixed(2)}`} subtext={`${data.ordersThisMonth} orders`} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Top Products</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {data.topProducts.length === 0 ? (
              <div style={{ color: "#9ca3af", fontSize: 14 }}>No sales yet.</div>
            ) : data.topProducts.map(p => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, background: "#f9fafb", borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{p.sold} sold</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>€{p.revenue.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Revenue Breakdown</h2>
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: 12, background: "#f9fafb", borderRadius: 8 }}>
              <span style={{ fontSize: 14 }}>Today</span>
              <span style={{ fontSize: 14, fontWeight: 700 }}>€{data.revenueToday.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: 12, background: "#f9fafb", borderRadius: 8 }}>
              <span style={{ fontSize: 14 }}>This Week</span>
              <span style={{ fontSize: 14, fontWeight: 700 }}>€{data.revenueThisWeek.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: 12, background: "#f9fafb", borderRadius: 8 }}>
              <span style={{ fontSize: 14 }}>This Month</span>
              <span style={{ fontSize: 14, fontWeight: 700 }}>€{data.revenueThisMonth.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: 12, background: "#111827", borderRadius: 8, color: "#fff" }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>Total</span>
              <span style={{ fontSize: 14, fontWeight: 700 }}>€{data.totalRevenue.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Recent Orders</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Order #", "Total", "Status", "Date"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: "#6b7280", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.recentOrders.map(o => (
              <tr key={o.id}>
                <td style={{ padding: "12px 14px", fontSize: 14, fontWeight: 500, borderBottom: "1px solid #f3f4f6" }}>{o.orderNumber}</td>
                <td style={{ padding: "12px 14px", fontSize: 14, fontWeight: 500, borderBottom: "1px solid #f3f4f6" }}>€{o.grandTotal.toFixed(2)}</td>
                <td style={{ padding: "12px 14px", fontSize: 14, borderBottom: "1px solid #f3f4f6" }}>
                  <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 999, background: "#dcfce7", color: "#16a34a" }}>
                    {o.orderStatus}
                  </span>
                </td>
                <td style={{ padding: "12px 14px", fontSize: 13, color: "#6b7280", borderBottom: "1px solid #f3f4f6" }}>
                  {new Date(o.createdAt).toLocaleDateString("en-GB")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
