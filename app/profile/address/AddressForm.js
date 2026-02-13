"use client";

import { useState } from "react";

export default function AddressForm({ initialData, onSave, onCancel }) {
  const [form, setForm] = useState(
    initialData || {
      fullName: "",
      phone: "",
      line1: "",
      city: "",
      state: "",
      pincode: "",
    }
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit() {
    setSaving(true);
    setMessage("");

    const success = await onSave(form);

    if (success) {
      setMessage("Address saved successfully");
    } else {
      setMessage("Failed to save address");
    }

    setSaving(false);
  }

  return (
    <div style={cardStyle}>
      {message && <p style={{ color: "green" }}>{message}</p>}

      <input placeholder="Full Name" value={form.fullName}
        onChange={(e) => setForm({ ...form, fullName: e.target.value })} />

      <input placeholder="Phone" value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })} />

      <input placeholder="Address Line" value={form.line1}
        onChange={(e) => setForm({ ...form, line1: e.target.value })} />

      <input placeholder="City" value={form.city}
        onChange={(e) => setForm({ ...form, city: e.target.value })} />

      <input placeholder="State" value={form.state}
        onChange={(e) => setForm({ ...form, state: e.target.value })} />

      <input placeholder="Pincode" value={form.pincode}
        onChange={(e) => setForm({ ...form, pincode: e.target.value })} />

      <div style={{ marginTop: "15px" }}>
        <button onClick={handleSubmit} disabled={saving} style={primaryBtn}>
          {saving ? "Saving..." : "Save Address"}
        </button>
        {onCancel && (
          <button onClick={onCancel} style={secondaryBtn}>Cancel</button>
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const primaryBtn = {
  background: "#000",
  color: "#fff",
  padding: "10px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const secondaryBtn = {
  marginLeft: "10px",
  background: "#eee",
  padding: "10px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
