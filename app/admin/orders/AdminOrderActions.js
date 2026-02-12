"use client";

import { useState } from "react";

export default function AdminOrderActions({ orderId }) {
  const [loading, setLoading] = useState(false);
  const [tracking, setTracking] = useState("");

  async function updateStatus(status) {
    setLoading(true);

    await fetch("/api/admin/update-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        status,
        trackingNumber: tracking,
      }),
    });

    window.location.reload();
  }

  return (
    <div style={{ marginTop: "10px" }}>
      <button onClick={() => updateStatus("packed")} disabled={loading}>
        Mark Packed
      </button>

      <div style={{ marginTop: "8px" }}>
        <input
          type="text"
          placeholder="Tracking Number"
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          style={{ marginRight: "8px" }}
        />

        <button onClick={() => updateStatus("shipped")} disabled={loading}>
          Mark Shipped
        </button>
      </div>

      <button
        onClick={() => updateStatus("delivered")}
        disabled={loading}
        style={{ marginTop: "8px" }}
      >
        Mark Delivered
      </button>
    </div>
  );
}
