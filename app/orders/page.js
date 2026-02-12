import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  let user;

  try {
    user = await verifyToken(token);
  } catch {
    redirect("/login");
  }

  const client = await clientPromise;
  const db = client.db();
  const ordersCollection = db.collection("orders");

  const orders = await ordersCollection
    .find({ userId: new ObjectId(user.sub) })
    .sort({ createdAt: -1 })
    .toArray();

  return (
    <div style={{ padding: "40px" }}>
      <h1>My Orders</h1>

      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map((order) => (
        <div
          key={order._id.toString()}
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <p>
            <strong>Order ID:</strong> {order._id.toString()}
          </p>

          <p>
            <strong>Status:</strong> {order.status}
          </p>
          
           {order.trackingNumber && (
                 <p>
                   <strong>Tracking:</strong> {order.trackingNumber}
                  </p>
        )}

          

          <p>
            <strong>Date:</strong>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>

          <hr />

          {order.items.map((item, index) => (
            <div key={index}>
              {item.name} — ₹{item.price} × {item.quantity}
            </div>
          ))}

          <hr />

          <h3>Total: ₹{order.total}</h3>
        </div>
      ))}
    </div>
  );
}
