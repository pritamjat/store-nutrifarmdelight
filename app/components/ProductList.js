]"use client";

import { useEffect, useState } from "react";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(data.products || []));
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
            <img src={product.image} width="150" />
            <h3>{product.name}</h3>
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
