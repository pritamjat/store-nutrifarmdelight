"use client";

import { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  async function fetchCart() {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setCart(data.cart || []);
  }

  useEffect(() => {
    fetchCart();
  }, []);

  async function updateQuantity(productId, action) {
    await fetch("/api/cart/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, action }),
    });

    fetchCart();
  }

  async function removeItem(productId) {
    await fetch("/api/cart/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    fetchCart();
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div style={{ padding: "40px" }}>
      <h1>Your Cart</h1>

      {cart.length === 0 && <p>Cart is empty</p>}

      {cart.map((item) => (
        <div key={item.productId} style={{ marginBottom: "15px" }}>
          <strong>{item.name}</strong>
          <p>₹{item.price}</p>

          <button onClick={() => updateQuantity(item.productId, "decrease")}>-</button>
          <span style={{ margin: "0 10px" }}>{item.quantity}</span>
          <button onClick={() => updateQuantity(item.productId, "increase")}>+</button>

          <button
            onClick={() => removeItem(item.productId)}
            style={{ marginLeft: "15px", color: "red" }}
          >
            Remove
          </button>
        </div>
      ))}

      <hr />
      <h3>Total: ₹{total}</h3>
    </div>
  );
}
