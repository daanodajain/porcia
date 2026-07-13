"use client";

import { useEffect, useState } from "react";
import { Button, Card } from "@/components/ui";
import api from "@/lib/api";
import { AddAddressForm } from "./AddAddressForm";

export interface Address {
  id: string;
  addressType: string | null;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  postalCode: string;
}

export function AddressPageContent() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/customer/addresses");
      setAddresses(response.data.data);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddressAdded = (newAddress: Address) => {
    setAddresses((prev) => [newAddress, ...prev]);
    setShowAddForm(false);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      await api.delete(`/customer/addresses/${addressId}`);
      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
    } catch (error) {
      console.error("Failed to delete address:", error);
      alert("Could not delete address. Please try again.");
    }
  };

  return (
    <div className="grid gap-8">
      <div className="flex items-center justify-between">
        <h1 className="lux-h2">My Addresses</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>{showAddForm ? "Cancel" : "Add New Address"}</Button>
      </div>

      {showAddForm && <AddAddressForm onAddressAdded={handleAddressAdded} />}

      {isLoading ? (
        <p>Loading addresses...</p>
      ) : addresses.length === 0 && !showAddForm ? (
        <p>You have not saved any addresses yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id} className="p-6">
              <div className="flex justify-between">
                <p className="font-semibold">{address.fullName}</p>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteAddress(address.id)}>
                  Remove
                </Button>
              </div>
              <div className="lux-small mt-4 text-[var(--lux-muted)]">
                <p>{address.addressLine1}</p>
                {address.addressLine2 && <p>{address.addressLine2}</p>}
                <p>
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p>Phone: {address.phone}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}