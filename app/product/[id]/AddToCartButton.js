"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ product }) {
  const [added, setAdded] = useState(false);
  const router = useRouter();

  async function handleAdd() {
    await fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product }),
    });

    router.refresh(); // update navbar badge

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <button
        onClick={handleAdd}
        style={{
          padding: "10px 20px",
          background: "green",
          color: "white",
          border-radius: "7px",
          cursor: "pointer",
        }}
      >
        Add to Cart
      </button>

      {added && (
        <p style={{ color: "green", marginTop: "8px" }}>
          ✓ Added to cart
        </p>
      )}
    </div>
  );
}
