"use client";

import { useState } from "react";

export default function AddressForm({ initialAddress }) {
  const [address, setAddress] = useState({
    fullName: initialAddress?.fullName || "",
    phone: initialAddress?.phone || "",
    line1: initialAddress?.line1 || "",
    city: initialAddress?.city || "",
    state: initialAddress?.state || "",
    pincode: initialAddress?.pincode || "",
  });

  async function handleSave() {
    await fetch("/api/profile/update-address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(address),
    });

    alert("Address saved successfully");
  }

  return (
    <div>
      <input
        placeholder="Full Name"
        value={address.fullName}
        onChange={(e) =>
          setAddress({ ...address, fullName: e.target.value })
        }
      />
      <br /><br />

      <input
        placeholder="Phone"
        value={address.phone}
        onChange={(e) =>
          setAddress({ ...address, phone: e.target.value })
        }
      />
      <br /><br />

      <input
        placeholder="Address Line"
        value={address.line1}
        onChange={(e) =>
          setAddress({ ...address, line1: e.target.value })
        }
      />
      <br /><br />

      <input
        placeholder="City"
        value={address.city}
        onChange={(e) =>
          setAddress({ ...address, city: e.target.value })
        }
      />
      <br /><br />

      <input
        placeholder="State"
        value={address.state}
        onChange={(e) =>
          setAddress({ ...address, state: e.target.value })
        }
      />
      <br /><br />

      <input
        placeholder="Pincode"
        value={address.pincode}
        onChange={(e) =>
          setAddress({ ...address, pincode: e.target.value })
        }
      />
      <br /><br />

      <button onClick={handleSave}>
        Save Address
      </button>
    </div>
  );
}

