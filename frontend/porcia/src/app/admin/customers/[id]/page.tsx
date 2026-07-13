"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

interface CustomerDetail {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender?: string;
  dateOfBirth?: string;
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
}

interface Order {
  id: number;
  orderNumber: string;
  grandTotal: number;
  orderStatus: string;
  createdAt: string;
}

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params?.id as string;
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminAuthToken");
    setIsLoading(true);
    Promise.all([
      api.get(`/cms/customers/${customerId}`, { headers: { Authorization: `Bearer ${token}` } }),
      api.get(`/cms/customers/${customerId}/orders`, { headers: { Authorization: `Bearer ${token}` } }),
    ])
      .then(([custRes, ordersRes]) => {
        setCustomer(custRes.data.data);
        setIsActive(custRes.data.data?.isActive ?? true);
        setOrders(ordersRes.data.data ?? []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [customerId]);

  const toggleStatus = async () => {
    const token = localStorage.getItem("adminAuthToken");
    await api.patch(`/cms/customers/${customerId}/status`, { isActive: !isActive }, { headers: { Authorization: `Bearer ${token}` } });
    setIsActive(!isActive);
  };

  if (isLoading) return <div style={{ padding: 48, textAlign: "center" }}><Loader2 size={24} color="#9ca3af" /></div>;
  if (!customer) return <div style={{ padding: 24, color: "#dc2626" }}>Customer not found.</div>;

  const statusColors = { PENDING: "#fef9c3", CONFIRMED: "#dcfce7", SHIPPED: "#dbeafe", DELIVERED: "#dcfce7", CANCELLED: "#fee2e2" };
  const statusTextColors = { PENDING: "#854d0e", CONFIRMED: "#16a34a", SHIPPED: "#0369a1", DELIVERED: "#16a34a", CANCELLED: "#dc2626" };

  return (
    <div>
      <Link href="/admin/customers" style={{ display: "flex", alignItems: "center", gap: 8, color: "#3b82f6", marginBottom: 16, textDecoration: "none", fontSize: 14 }}>
        <ArrowLeft size={16} /> Back to Customers
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Profile</h2>
          <div style={{ display: "grid", gap: 12 }}>
            <div><span style={{ color: "#6b7280", fontSize: 12 }}>Name</span><div style={{ fontSize: 14, fontWeight: 500 }}>{customer.firstName} {customer.lastName}</div></div>
            <div><span style={{ color: "#6b7280", fontSize: 12 }}>Email</span><div style={{ fontSize: 14 }}>{customer.email}</div></div>
            <div><span style={{ color: "#6b7280", fontSize: 12 }}>Phone</span><div style={{ fontSize: 14 }}>{customer.phone}</div></div>
            {customer.gender && <div><span style={{ color: "#6b7280", fontSize: 12 }}>Gender</span><div style={{ fontSize: 14 }}>{customer.gender}</div></div>}
            {customer.dateOfBirth && <div><span style={{ color: "#6b7280", fontSize: 12 }}>DOB</span><div style={{ fontSize: 14 }}>{new Date(customer.dateOfBirth).toLocaleDateString("en-GB")}</div></div>}
            <div><span style={{ color: "#6b7280", fontSize: 12 }}>Joined</span><div style={{ fontSize: 14 }}>{new Date(customer.createdAt).toLocaleDateString("en-GB")}</div></div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <span style={{ fontSize: 12, padding: "4px 8px", borderRadius: 6, background: customer.emailVerified ? "#dcfce7" : "#fee2e2", color: customer.emailVerified ? "#16a34a" : "#dc2626" }}>Email {customer.emailVerified ? "✓" : "✗"}</span>
              <span style={{ fontSize: 12, padding: "4px 8px", borderRadius: 6, background: customer.phoneVerified ? "#dcfce7" : "#fee2e2", color: customer.phoneVerified ? "#16a34a" : "#dc2626" }}>Phone {customer.phoneVerified ? "✓" : "✗"}</span>
            </div>
          </div>
          <button onClick={toggleStatus} style={{ marginTop: 16, padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e7eb", background: isActive ? "#fee2e2" : "#dcfce7", color: isActive ? "#dc2626" : "#16a34a", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
            {isActive ? "Deactivate" : "Activate"}
          </button>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Stats</h2>
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ padding: 12, background: "#f9fafb", borderRadius: 8 }}>
              <div style={{ color: "#6b7280", fontSize: 12 }}>Total Orders</div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{orders.length}</div>
            </div>
            <div style={{ padding: 12, background: "#f9fafb", borderRadius: 8 }}>
              <div style={{ color: "#6b7280", fontSize: 12 }}>Total Spent</div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>€{orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0).toFixed(2)}</div>
            </div>
            <div style={{ padding: 12, background: "#f9fafb", borderRadius: 8 }}>
              <div style={{ color: "#6b7280", fontSize: 12 }}>Status</div>
              <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4, padding: "4px 8px", borderRadius: 6, background: isActive ? "#dcfce7" : "#fee2e2", color: isActive ? "#16a34a" : "#dc2626", display: "inline-block" }}>
                {isActive ? "Active" : "Inactive"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Order History</h2>
        {orders.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>No orders yet.</div>
        ) : (
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
              {orders.map(o => (
                <tr key={o.id}>
                  <td style={{ padding: "12px 14px", fontSize: 14, fontWeight: 500, borderBottom: "1px solid #f3f4f6" }}>
                    <Link href={`/admin/orders/${o.id}`} style={{ color: "#3b82f6", textDecoration: "none" }}>
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 14, fontWeight: 500, borderBottom: "1px solid #f3f4f6" }}>€{o.grandTotal.toFixed(2)}</td>
                  <td style={{ padding: "12px 14px", fontSize: 14, borderBottom: "1px solid #f3f4f6" }}>
                    <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 999, background: statusColors[o.orderStatus as keyof typeof statusColors] || "#f3f4f6", color: statusTextColors[o.orderStatus as keyof typeof statusTextColors] || "#374151" }}>
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
        )}
      </div>
    </div>
  );
}
