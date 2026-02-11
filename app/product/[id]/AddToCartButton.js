"use client";

export default function AddToCartButton({ product }) {

  async function handleAdd() {
    await fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product }),
    });

    alert("Added to cart!");
  }

  return (
    <button onClick={handleAdd}>
      Add to Cart
    </button>
  );
}

