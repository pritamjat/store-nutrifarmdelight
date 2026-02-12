import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";

export default async function AdminOrdersPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) redirect("/login");

  let user;
  try {
    user = await verifyToken(token);
  } catch {
    redirect("/login");
  }

  // 🔒 Only admin allowed
  if (user.role !== "admin") {
    redirect("/");
  }

  const client = await clientPromise;
  const db = client.db();
  const orders = await db
    .collection("orders")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return (
    <div style={{ padding: "40px" }}>
      <h1>Admin Orders</h1>

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

