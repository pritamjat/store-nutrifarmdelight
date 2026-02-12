"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [addedId, setAddedId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const { cartCount, setCartCount } = useCart();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));
  }, []);

  async function handleAdd(product) {
    try {
      setLoadingId(product._id);

      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId: product._id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to add to cart");
        setLoadingId(null);
        return;
      }

      // 🔥 Only increase badge if backend succeeded
      setCartCount(cartCount + 1);

      setAddedId(product._id);

      setTimeout(() => {
        setAddedId(null);
      }, 1500);

    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <section className="products">
      <h2>Trending Products</h2>

      <div className="grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">

            <Link href={`/product/${product._id}`}>
              <h3>{product.name}</h3>
            </Link>

            <p>₹{product.price}</p>

            <button
              onClick={() => handleAdd(product)}
              disabled={loadingId === product._id}
            >
              {loadingId === product._id ? "Adding..." : "Add to Cart"}
            </button>

            {addedId === product._id && (
              <p style={{ color: "green", marginTop: "5px" }}>
                ✓ Added
              </p>
            )}

          </div>
        ))}
      </div>
    </section>
  );
}
