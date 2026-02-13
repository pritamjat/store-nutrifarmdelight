"use client";

import { useEffect, useState } from "react";
import AddressForm from "@/app/components/AddressForm";

export default function AddressPage() {
  const [address, setAddress] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetch("/api/profile/address")
      .then((res) => res.json())
      .then((data) => setAddress(data.address || null));
  }, []);

  async function saveAddress(form) {
    const res = await fetch("/api/profile/address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) return false;

    setAddress(form);
    setEditing(false);
    return true;
  }

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto" }}>
      <h2>My Address</h2>

      {!editing && address && (
        <div style={{ marginBottom: "20px" }}>
          <p><strong>{address.fullName}</strong></p>
          <p>{address.phone}</p>
          <p>{address.line1}</p>
          <p>{address.city}, {address.state}</p>
          <p>{address.pincode}</p>

          <button onClick={() => setEditing(true)}>Change Address</button>
        </div>
      )}

      {(editing || !address) && (
        <AddressForm
          initialData={address}
          onSave={saveAddress}
          onCancel={() => setEditing(false)}
        />
      )}
    </div>
  );
}

