"use client";

import { useEffect, useState } from "react";
import { Button, Card } from "@/components/ui";
import api from "@/lib/api";

interface Address {
  id: number;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  addressType: string;
}

const EMPTY_FORM = {
  fullName: "", phone: "", addressLine1: "", addressLine2: "",
  city: "", state: "", postalCode: "", country: "India",
  isDefault: false, addressType: "SHIPPING",
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/customer/addresses");
      setAddresses(res.data.data ?? []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAddresses(); }, []);

  const openNew = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); setError(""); };
  const openEdit = (a: Address) => {
    setForm({ fullName: a.fullName ?? "", phone: a.phone ?? "", addressLine1: a.addressLine1, addressLine2: a.addressLine2 ?? "", city: a.city, state: a.state ?? "", postalCode: a.postalCode ?? "", country: a.country, isDefault: a.isDefault, addressType: a.addressType });
    setEditId(a.id);
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/customer/addresses/${id}`);
    fetchAddresses();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editId) {
        await api.put(`/customer/addresses/${editId}`, form);
      } else {
        await api.post("/customer/addresses", form);
      }
      setShowForm(false);
      fetchAddresses();
    } catch {
      setError("Failed to save address. Please check all fields.");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "h-10 w-full rounded-lg border border-[var(--lux-border)] bg-transparent px-3 text-sm outline-none focus:border-[var(--lux-fg)]";

  return (
    <div className="grid gap-8">
      <div className="flex items-center justify-between">
        <h1 className="lux-h2">My Addresses</h1>
        {!showForm && <Button onClick={openNew} size="sm">Add New Address</Button>}
      </div>

      {showForm && (
        <Card className="p-8">
          <h2 className="lux-h3">{editId ? "Edit Address" : "New Address"}</h2>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <input className={inputCls} placeholder="Full Name" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} required />
              <input className={inputCls} placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <input className={inputCls} placeholder="Address Line 1 *" value={form.addressLine1} onChange={e => setForm(f => ({ ...f, addressLine1: e.target.value }))} required />
            <input className={inputCls} placeholder="Address Line 2" value={form.addressLine2} onChange={e => setForm(f => ({ ...f, addressLine2: e.target.value }))} />
            <div className="grid grid-cols-3 gap-4">
              <input className={inputCls} placeholder="City *" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required />
              <input className={inputCls} placeholder="State" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} />
              <input className={inputCls} placeholder="Postal Code" value={form.postalCode} onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))} />
            </div>
            <input className={inputCls} placeholder="Country *" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} required />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isDefault} onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))} />
              Set as default address
            </label>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-4">
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Address"}</Button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {isLoading ? <p>Loading addresses...</p> : addresses.length === 0 && !showForm ? (
        <Card className="p-8 text-center">
          <p className="text-[var(--lux-muted)]">No addresses saved yet.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {addresses.map(address => (
            <Card key={address.id} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  {address.fullName && <p className="font-semibold">{address.fullName}</p>}
                  <p className="text-sm">{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ""}</p>
                  <p className="text-sm">{address.city}{address.state ? `, ${address.state}` : ""} {address.postalCode}</p>
                  <p className="text-sm">{address.country}</p>
                  {address.phone && <p className="text-sm text-[var(--lux-muted)]">{address.phone}</p>}
                  {address.isDefault && <span className="mt-2 inline-block rounded-full bg-black px-2 py-0.5 text-xs text-white dark:bg-white dark:text-black">Default</span>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(address)}>Edit</Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(address.id)}>Delete</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
