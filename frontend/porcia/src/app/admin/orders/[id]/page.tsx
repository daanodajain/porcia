"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import api from "@/lib/api";

interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressType: string;
}

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  shippingCharge: number;
  discountAmount: number;
  grandTotal: number;
  createdAt: string;
  shippingAddress: Address | null;
  billingAddress: Address | null;
  items: OrderItem[];
}

interface Shipment {
  id: number;
  orderNumber: string;
  courierName: string;
  trackingNumber: string;
  shippingStatus: string;
  shippedAt: string | null;
  deliveredAt: string | null;
}

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
const SHIPMENT_STATUS_OPTIONS = ["PENDING", "SHIPPED", "IN_TRANSIT", "DELIVERED", "CANCELLED"];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  PENDING:    { bg: "#fef9c3", color: "#854d0e" },
  CONFIRMED:  { bg: "#dbeafe", color: "#1d4ed8" },
  SHIPPED:    { bg: "#e0e7ff", color: "#4338ca" },
  DELIVERED:  { bg: "#dcfce7", color: "#16a34a" },
  CANCELLED:  { bg: "#fee2e2", color: "#dc2626" },
};

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("adminAuthToken") : null;
}

function AddressBlock({ title, address }: { title: string; address: Address | null }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
      <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", marginBottom: 10 }}>{title}</p>
      {address ? (
        <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
          <p style={{ fontWeight: 500 }}>{address.fullName}</p>
          <p>{address.addressLine1}</p>
          {address.addressLine2 && <p>{address.addressLine2}</p>}
          <p>{address.city}, {address.state} {address.postalCode}</p>
          <p>{address.country}</p>
          <p style={{ marginTop: 6, color: "#6b7280" }}>{address.phone}</p>
        </div>
      ) : (
        <p style={{ color: "#9ca3af", fontSize: 14 }}>Not provided.</p>
      )}
    </div>
  );
}

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [shipmentMessage, setShipmentMessage] = useState<string | null>(null);
  const [shipmentForm, setShipmentForm] = useState({ courierName: "", trackingNumber: "" });
  const [isShipmentSaving, setIsShipmentSaving] = useState(false);

  const fetchShipments = () => {
    const token = getToken();
    api.get(`/cms/orders/${id}/shipments`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setShipments(res.data.data ?? []))
      .catch(() => setShipments([]));
  };

  const fetchOrder = () => {
    setIsLoading(true);
    setError(null);
    const token = getToken();
    api.get(`/cms/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setOrder(res.data.data);
        setStatus(res.data.data?.orderStatus ?? "");
      })
      .catch(() => setError("Could not load this order."))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchOrder();
    fetchShipments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);
    const token = getToken();
    try {
      const res = await api.put(
        `/cms/orders/${id}/status`,
        { status, remarks: remarks || undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrder(res.data.data);
      setSaveMessage("Order status updated.");
    } catch {
      setSaveMessage("Failed to update status. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsShipmentSaving(true);
    setShipmentMessage(null);
    const token = getToken();
    try {
      await api.post(`/cms/orders/${id}/shipments`, shipmentForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShipmentForm({ courierName: "", trackingNumber: "" });
      setShipmentMessage("Shipment created.");
      fetchShipments();
    } catch {
      setShipmentMessage("Failed to create shipment.");
    } finally {
      setIsShipmentSaving(false);
    }
  };

  const handleShipmentStatus = async (shipmentId: number, nextStatus: string) => {
    setShipmentMessage(null);
    const token = getToken();
    try {
      await api.patch(
        `/cms/orders/${id}/shipments/${shipmentId}/status`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setShipmentMessage("Shipment status updated.");
      fetchShipments();
    } catch {
      setShipmentMessage("Failed to update shipment status.");
    }
  };

  const th: React.CSSProperties = { padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" };
  const td: React.CSSProperties = { padding: "12px 14px", fontSize: 14, color: "#374151", borderBottom: "1px solid #f3f4f6" };
  const inputSt: React.CSSProperties = { width: "100%", height: 38, border: "1px solid #d1d5db", borderRadius: 8, padding: "0 12px", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff", color: "#111827" };

  if (isLoading) {
    return <div style={{ padding: 48, textAlign: "center" }}><Loader2 size={24} color="#9ca3af" /></div>;
  }

  if (error || !order) {
    return (
      <div>
        <Link href="/admin/orders" style={{ fontSize: 13, color: "#6b7280", textDecoration: "none" }}>← Back to Orders</Link>
        <p style={{ marginTop: 16, color: "#dc2626" }}>{error ?? "Order not found."}</p>
      </div>
    );
  }

  const s = STATUS_COLORS[order.orderStatus] ?? { bg: "#f3f4f6", color: "#374151" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <Link href="/admin/orders" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#6b7280", textDecoration: "none" }}>
          <ArrowLeft size={14} /> Back
        </Link>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Order {order.orderNumber}</h1>
        <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 999, background: s.bg, color: s.color, fontWeight: 500 }}>{order.orderStatus}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }} className="lg:grid-cols-[2fr_1fr] grid-cols-1">
        <div style={{ display: "grid", gap: 20 }}>
          {/* Items */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Product", "SKU", "Qty", "Unit Price", "Total"].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
              <tbody>
                {order.items?.length ? order.items.map(item => (
                  <tr key={item.id}>
                    <td style={{ ...td, fontWeight: 500 }}>{item.productName}</td>
                    <td style={{ ...td, color: "#6b7280", fontSize: 13 }}>{item.sku}</td>
                    <td style={td}>{item.quantity}</td>
                    <td style={td}>EUR {Number(item.unitPrice).toFixed(2)}</td>
                    <td style={{ ...td, fontWeight: 500 }}>EUR {Number(item.totalPrice).toFixed(2)}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} style={{ padding: 24, textAlign: "center", color: "#9ca3af" }}>No items on this order.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", marginBottom: 12 }}>Summary</p>
            {[
              ["Subtotal", order.subtotal],
              ["Shipping", order.shippingCharge],
              ["Discount", order.discountAmount ? -order.discountAmount : 0],
            ].map(([label, val]) => (
              <div key={label as string} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#374151", marginBottom: 6 }}>
                <span>{label}</span><span>EUR {Number(val).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700, color: "#111827", marginTop: 10, paddingTop: 10, borderTop: "1px solid #e5e7eb" }}>
              <span>Grand Total</span><span>EUR {Number(order.grandTotal).toFixed(2)}</span>
            </div>
            <p style={{ marginTop: 12, fontSize: 13, color: "#6b7280" }}>
              Payment: {order.paymentMethod} — <strong>{order.paymentStatus}</strong>
            </p>
            <p style={{ fontSize: 13, color: "#6b7280" }}>
              Placed: {order.createdAt ? new Date(order.createdAt).toLocaleString("en-GB") : "—"}
            </p>
          </div>

          <AddressBlock title="Shipping Address" address={order.shippingAddress} />
          <AddressBlock title="Billing Address" address={order.billingAddress} />

          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", marginBottom: 12 }}>Shipments</p>
            <form onSubmit={handleCreateShipment} style={{ display: "grid", gap: 10, marginBottom: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <input
                  placeholder="Courier name"
                  required
                  value={shipmentForm.courierName}
                  onChange={e => setShipmentForm(prev => ({ ...prev, courierName: e.target.value }))}
                  style={inputSt}
                />
                <input
                  placeholder="Tracking number"
                  required
                  value={shipmentForm.trackingNumber}
                  onChange={e => setShipmentForm(prev => ({ ...prev, trackingNumber: e.target.value }))}
                  style={inputSt}
                />
              </div>
              <button type="submit" disabled={isShipmentSaving}
                style={{ height: 38, borderRadius: 8, background: "#111827", color: "#fff", border: "none", fontSize: 14, cursor: "pointer", opacity: isShipmentSaving ? 0.6 : 1 }}>
                {isShipmentSaving ? "Creating…" : "Create Shipment"}
              </button>
            </form>
            {shipmentMessage && (
              <p style={{ fontSize: 13, color: shipmentMessage.includes("Failed") ? "#dc2626" : "#16a34a", marginBottom: 12 }}>{shipmentMessage}</p>
            )}
            {shipments.length === 0 ? (
              <p style={{ color: "#9ca3af", fontSize: 14 }}>No shipments created for this order.</p>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>
                {shipments.map(shipment => (
                  <div key={shipment.id} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                      <div>
                        <p style={{ fontWeight: 600, color: "#111827" }}>{shipment.courierName}</p>
                        <p style={{ fontSize: 13, color: "#6b7280" }}>{shipment.trackingNumber}</p>
                      </div>
                      <select
                        value={shipment.shippingStatus}
                        onChange={e => handleShipmentStatus(shipment.id, e.target.value)}
                        style={{ ...inputSt, width: 150 }}
                      >
                        {SHIPMENT_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status update panel */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, height: "fit-content" }}>
          <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", marginBottom: 12 }}>Update Status</p>
          <form onSubmit={handleUpdateStatus} style={{ display: "grid", gap: 12 }}>
            <select value={status} onChange={e => setStatus(e.target.value)} style={inputSt}>
              {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <textarea
              placeholder="Remarks (optional)"
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              style={{ ...inputSt, height: 80, paddingTop: 8, resize: "vertical" }}
            />
            {saveMessage && (
              <p style={{ fontSize: 13, color: saveMessage.includes("Failed") ? "#dc2626" : "#16a34a" }}>{saveMessage}</p>
            )}
            <button type="submit" disabled={isSaving}
              style={{ height: 38, borderRadius: 8, background: "#111827", color: "#fff", border: "none", fontSize: 14, cursor: "pointer", opacity: isSaving ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              {isSaving && <Loader2 size={14} />} {isSaving ? "Saving…" : "Update Status"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
