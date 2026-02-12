"use client";

import { useState } from "react";

export default function AdminOrderActions({ orderId, currentStatus }) {
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

  const nextActions = {
    paid: "packed",
    packed: "shipped",
    shipped: "delivered",
    delivered: null,
  };

  const nextStatus = nextActions[currentStatus];

  return (
    <div style={{ marginTop: "15px" }}>
      <p>
        <strong>Current Status:</strong> {currentStatus}
      </p>

      {nextStatus === "packed" && (
        <button onClick={() => updateStatus("packed")} disabled={loading}>
          Mark Packed
        </button>
      )}

      {nextStatus === "shipped" && (
        <div style={{ marginTop: "10px" }}>
          <input
            type="text"
            placeholder="Tracking Number"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            style={{ marginRight: "8px" }}
          />

          <button
            onClick={() => updateStatus("shipped")}
            disabled={loading || !tracking}
          >
            Mark Shipped
          </button>
        </div>
      )}

      {nextStatus === "delivered" && (
        <button
          onClick={() => updateStatus("delivered")}
          disabled={loading}
          style={{ marginTop: "10px" }}
        >
          Mark Delivered
        </button>
      )}

      {currentStatus === "delivered" && (
        <p style={{ marginTop: "10px", color: "green" }}>
          Order Completed
        </p>
      )}
    </div>
  );
}
