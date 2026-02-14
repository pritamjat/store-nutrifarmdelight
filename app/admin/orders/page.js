import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export default async function AdminOrdersPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return <div>Unauthorized</div>;
  }

  const user = await verifyToken(token);

  if (user.role !== "admin") {
    return <div>Access Denied</div>;
  }

  const client = await clientPromise;
  const db = client.db();
  const orders = db.collection("orders");

  const allOrders = await orders
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return (
    <div style={{ padding: "40px" }}>
      <h1>Admin Orders</h1>

      {allOrders.map((order) => (
        <div
          key={order._id.toString()}
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "8px",
            background: "#fff",
          }}
        >
          <p><strong>Order ID:</strong> {order._id.toString()}</p>
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
              <p style={{ fontWeight: "600", marginBottom: "8px" }}>
                Delivery Address
              </p>
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
            {order.items.map((item, index) => (
              <div key={index} style={{ fontSize: "14px", marginTop: "5px" }}>
                {item.name} × {item.quantity} — ₹{item.price}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
