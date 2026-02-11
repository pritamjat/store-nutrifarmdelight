"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [addedId, setAddedId] = useState(null);
  const router = useRouter();

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

    router.refresh();
    router.replace("/");
    setAddedId(product._id);

    setTimeout(() => {
      setAddedId(null);
    }, 1500);
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

            <button onClick={() => handleAdd(product)}>
              Add to Cart
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
