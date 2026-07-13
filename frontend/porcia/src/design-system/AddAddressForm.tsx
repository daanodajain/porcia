"use client";

import { useState } from "react";
import { Button, Card, Input } from "@/components/ui";
import api from "@/lib/api";
import { Address } from "./AddressPageContent";

interface AddAddressFormProps {
  onAddressAdded: (newAddress: Address) => void;
}

export function AddAddressForm({ onAddressAdded }: AddAddressFormProps) {
  const [formData, setFormData] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await api.post("/customer/addresses", formData);
      onAddressAdded(response.data.data);
    } catch (err) {
      console.error("Failed to add address:", err);
      setError("An error occurred. Please check your details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-8">
      <h3 className="lux-h3">Add a New Address</h3>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Input name="addressLine1" label="Address Line 1" value={formData.addressLine1} onChange={handleChange} required />
          <Input name="addressLine2" label="Address Line 2 (Optional)" value={formData.addressLine2} onChange={handleChange} />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Input name="city" label="City" value={formData.city} onChange={handleChange} required />
          <Input name="state" label="State" value={formData.state} onChange={handleChange} required />
          <Input name="postalCode" label="Postal Code" value={formData.postalCode} onChange={handleChange} required />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Input name="phone" label="Phone Number" value={formData.phone} onChange={handleChange} required />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="mt-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Address"}
          </Button>
        </div>
      </form>
    </Card>
  );
}