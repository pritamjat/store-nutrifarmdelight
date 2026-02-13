"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";

export default function AddToCartButton({ product }) {
  const [loading, setLoading] = useState(false);
  const { cartCount, setCartCount } = useCart();

  async function handleAdd() {
    try {
      setLoading(true);

      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId: product._id,
        }),
      });

      if (!res.ok) return;

      setCartCount(cartCount + 1);

    } catch (error) {
      console.error("Add to cart failed");
    } finally {
      setLoading(false);
    }
  }

  if (product.stock <= 0) {
    return (
      <button disabled style={{ background: "#ccc", cursor: "not-allowed" }}>
        Out of Stock
      </button>
    );
  }

  return (
    <button onClick={handleAdd} disabled={loading}>
      {loading ? "Adding..." : "Add to Cart"}
    </button>
  );
}
