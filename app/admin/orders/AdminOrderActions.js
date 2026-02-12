"use client";

import { useState } from "react";

export default function AdminOrderActions({ orderId }) {
  const [loading, setLoading] = useState(false);

  async function updateStatus(status) {
    setLoading(true);

    await fetch("/api/admin/update-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });

    window.location.reload();
  }

  return (
    <div style={{ marginTop: "10px" }}>
      <button onClick={() => updateStatus("packed")} disabled={loading}>
        Mark Packed
      </button>

      <button onClick={() => updateStatus("shipped")} disabled={loading}>
        Mark Shipped
      </button>

      <button onClick={() => updateStatus("delivered")} disabled={loading}>
        Mark Delivered
      </button>
    </div>
  );
}

