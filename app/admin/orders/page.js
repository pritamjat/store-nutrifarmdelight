"use client";

import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");

  async function fetchOrders(selectedDate = "") {
    const res = await fetch(`/api/admin/update-order?date=${selectedDate}`);
    const data = await res.json();
    setOrders(data.orders || []);
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔍 Filter by order id
  const filteredOrders = orders.filter((order) =>
    order._id.toString().toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "20px" }}>Admin Orders</h1>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by Order ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          marginBottom: "20px",
          border: "1px solid #ddd",
        }}
      />

      {/* DATE FILTER */}
      <div style={{ marginBottom: "30px" }}>
        <label>Select Date: </label>
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            fetchOrders(e.target.value);
          }}
        />
      </div>

      {filteredOrders.map((order) => (
        <div
          key={order._id}
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "8px",
            background: "#fff",
          }}
        >
          <p><strong>Order ID:</strong> {order._id}</p>

          <p>
            <strong>Status:</strong>{" "}
            <span
              style={{
                color: order.status === "paid" ? "green" : "orange",
                fontWeight: "bold",
              }}
            >
              {order.status}
            </span>
          </p>

          <p><strong>Total:</strong> ₹{order.total}</p>

          <p>
            <strong>Date:</strong>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>

          {/* DELIVERY ADDRESS */}
          {order.address && (
            <div
              style={{
                marginTop: "15px",
                padding: "15px",
                background: "#f9f9f9",
              }}
            >
              <p style={{ fontWeight: "600" }}>Delivery Address</p>

              <p>{order.address.fullName}</p>
              <p>{order.address.phone}</p>
              <p>{order.address.line1}</p>
              <p>
                {order.address.city}, {order.address.state}
              </p>
              <p>{order.address.pincode}</p>
            </div>
          )}

          {/* ITEMS */}
          <div style={{ marginTop: "15px" }}>
            <p style={{ fontWeight: "600" }}>Items:</p>

            {order.items.map((item, i) => (
              <div key={i}>
                {item.name} × {item.quantity} — ₹{item.price}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
