"use client";

import Link from "next/link";
import { PackagePlus } from "lucide-react";

export default function ShipmentsAdminPage() {
  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 28 }}>
        <PackagePlus size={28} color="#6b7280" />
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginTop: 16 }}>
          Shipments are managed per order
        </h1>
        <p style={{ marginTop: 10, color: "#6b7280", lineHeight: 1.7 }}>
          The backend exposes shipment APIs under each order, so create and update shipments from an order detail page.
        </p>
        <Link
          href="/admin/orders"
          style={{
            display: "inline-flex",
            marginTop: 20,
            padding: "10px 16px",
            borderRadius: 8,
            background: "#111827",
            color: "#fff",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Open Orders
        </Link>
      </div>
    </div>
  );
}
