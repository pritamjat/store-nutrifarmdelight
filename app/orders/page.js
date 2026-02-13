import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --white: #ffffff;
    --orange: #e8621a;
    --orange-light: #fdf0e8;
    --green: #3a7d44;
    --green-light: #edf5ef;
    --text: #1c1c1a;
    --text-soft: #5a5a55;
    --text-muted: #9a9a95;
    --border: #e8e4de;
    --bg: #f9f9f7;
  }

  .op-root {
    font-family: 'DM Sans', sans-serif;
    max-width: 720px;
    margin: 0 auto;
    padding: 3rem 1.5rem 5rem;
    color: var(--text);
  }

  .op-root * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .op-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 2rem;
  }

  /* EMPTY */
  .op-empty {
    background: var(--white);
    border: 1px solid var(--border);
    padding: 3rem;
    text-align: center;
    font-size: 0.9rem;
    font-weight: 300;
    color: var(--text-muted);
  }

  /* ORDER CARD */
  .op-card {
    background: var(--white);
    border: 1px solid var(--border);
    margin-bottom: 1.25rem;
    box-shadow: 0 2px 8px rgba(26,26,24,0.04);
  }

  /* CARD HEADER */
  .op-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border);
    gap: 1rem;
    flex-wrap: wrap;
  }

  .op-card-header-left {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .op-order-id {
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .op-order-date {
    font-size: 0.82rem;
    font-weight: 300;
    color: var(--text-soft);
  }

  /* STATUS BADGE */
  .op-status {
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.3rem 0.75rem;
    border: 1px solid;
    white-space: nowrap;
  }

  .op-status-paid     { color: var(--green);  background: var(--green-light);  border-color: rgba(58,125,68,0.3);  }
  .op-status-pending  { color: #b07d1a;        background: #fdf7e3;              border-color: rgba(176,125,26,0.3); }
  .op-status-default  { color: var(--text-soft); background: var(--bg);          border-color: var(--border);        }

  /* TRACKING */
  .op-tracking {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.25rem;
    background: var(--orange-light);
    border-bottom: 1px solid rgba(232,98,26,0.15);
    font-size: 0.8rem;
    color: var(--orange);
  }

  .op-tracking-label {
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-size: 0.68rem;
  }

  /* ITEMS */
  .op-items {
    padding: 0.75rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .op-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.88rem;
    color: var(--text-soft);
    font-weight: 300;
  }

  .op-item-name {
    font-weight: 400;
    color: var(--text);
  }

  /* TOTAL */
  .op-card-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.5rem;
    padding: 0.85rem 1.25rem;
    border-top: 1px solid var(--border);
    background: var(--bg);
  }

  .op-total-label {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .op-total-amount {
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--green);
  }
`;

function StatusBadge({ status }) {
  let cls = "op-status op-status-default";
  if (status?.toLowerCase() === "paid") cls = "op-status op-status-paid";
  else if (status?.toLowerCase() === "pending") cls = "op-status op-status-pending";
  return <span className={cls}>{status}</span>;
}

export default async function OrdersPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) redirect("/login");

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
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="op-root">
        <h1 className="op-title">My Orders</h1>

        {orders.length === 0 && (
          <div className="op-empty">No orders yet.</div>
        )}

        {orders.map((order) => (
          <div key={order._id.toString()} className="op-card">

            <div className="op-card-header">
              <div className="op-card-header-left">
                <span className="op-order-id">Order ID: {order._id.toString()}</span>
                <span className="op-order-date">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
              <StatusBadge status={order.status} />
            </div>

            {order.trackingNumber && (
              <div className="op-tracking">
                <span className="op-tracking-label">Tracking ID:</span>
                {order.trackingNumber}
              </div>
            )}

            <div className="op-items">
              {order.items.map((item, index) => (
                <div key={index} className="op-item">
                  <span className="op-item-name">{item.name}</span>
                  <span>₹{item.price} × {item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="op-card-footer">
              <span className="op-total-label">Total</span>
              <span className="op-total-amount">₹{order.total}</span>
            </div>

          </div>
        ))}
      </div>
    </>
  );
}
