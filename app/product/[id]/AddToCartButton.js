"use client";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');

  :root {
    --white: #ffffff;
    --orange: #e8621a;
    --orange-light: #fdf0e8;
    --orange-hover: #d0541a;
    --green: #3a7d44;
    --green-light: #edf5ef;
    --text: #1c1c1a;
    --text-muted: #9a9a95;
    --border: #e8e4de;
    --bg: #f9f9f7;
  }

  .atc-btn {
    width: 100%;
    padding: 0.8rem 1rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    border: 1px solid var(--orange);
    background: var(--orange);
    color: var(--white);
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }

  .atc-btn:hover:not(:disabled) {
    background: var(--orange-hover);
    border-color: var(--orange-hover);
  }

  .atc-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .atc-btn-oos {
    width: 100%;
    padding: 0.8rem 1rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    border: 1px solid var(--border);
    background: var(--bg);
    color: var(--text-muted);
    cursor: not-allowed;
  }
`;

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
      <>
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <button className="atc-btn-oos" disabled>
          Out of Stock
        </button>
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <button className="atc-btn" onClick={handleAdd} disabled={loading}>
        {loading ? "Adding..." : "Add to Cart"}
      </button>
    </>
  );
}
