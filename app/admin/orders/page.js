import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import AdminOrderActions from "./AdminOrderActions";

export default async function AdminOrdersPage({ searchParams }) {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) redirect("/login");

  let user;
  try {
    user = await verifyToken(token);
  } catch {
    redirect("/login");
  }

  if (user.role !== "admin") {
    redirect("/");
  }

  const search = searchParams?.q || "";

  const client = await clientPromise;
  const db = client.db();
  const ordersCollection = db.collection("orders");

  let query = {};

  if (search) {
    query = {
      $or: [
        { _id: ObjectId.isValid(search) ? new ObjectId(search) : null },
        { "items.name": { $regex: search, $options: "i" } },
      ].filter(Boolean),
    };
  }

  const orders = await ordersCollection
    .find(query)
    .sort({ createdAt: -1 })
    .toArray();

  return (
    <div style={{ padding: "40px" }}>
      <h1>Admin Orders</h1>

      {/* 🔍 Search Form */}
      <form method="GET" style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="q"
          placeholder="Search by Order ID or Product Name"
          defaultValue={search}
          style={{ padding: "8px", width: "300px", marginRight: "10px" }}
        />
        <button type="submit">Search</button>
      </form>

      {orders.length === 0 && <p>No orders found.</p>}

      {orders.map((order) => (
        <div
          key={order._id.toString()}
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <p><strong>Order ID:</strong> {order._id.toString()}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> ₹{order.total}</p>

          {order.trackingNumber && (
            <p><strong>Tracking:</strong> {order.trackingNumber}</p>
          )}

          {order.items.map((item, i) => (
            <div key={i}>
              {item.name} — ₹{item.price} × {item.quantity}
            </div>
          ))}

          <AdminOrderActions
            orderId={order._id.toString()}
            currentStatus={order.status}
          />
        </div>
      ))}
    </div>
  );
}
