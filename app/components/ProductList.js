"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    }

    fetchProducts();
  }, []);

  async function handleAdd(product) {
  await fetch("/api/cart/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product }),
  });
}


  return (
    <section className="products">
      <h2>Trending Products</h2>

      <div className="grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">

            <Link href={`/product/${product._id}`}>
              <img
                src={product.image}
                alt={product.name}
                width="150"
                style={{ cursor: "pointer" }}
              />
            </Link>

            <Link href={`/product/${product._id}`}>
              <h3 style={{ cursor: "pointer" }}>
                {product.name}
              </h3>
            </Link>

            <p>₹{product.price}</p>

            <button onClick={() => handleAdd(product)}>
              Add to Cart
            </button>

          </div>
        ))}
      </div>
    </section>
  );
}
