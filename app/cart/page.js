"use client";

import { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => setCart(data.cart || []));
  }, []);

  const total = cart.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);



  return (
    <div style={{ padding: "40px" }}>
      <h1>Your Cart</h1>

      {cart.length === 0 && <p>Cart is empty</p>}

       {cart.map((item, index) => (
  <div key={index} style={{ marginBottom: "10px" }}>
    {item.name} — ₹{item.price} × {item.quantity}
  </div>
))}


      <hr />
      <h3>Total: ₹{total}</h3>
    </div>
  );
}

