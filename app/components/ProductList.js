"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --white: #ffffff;
    --orange: #e8621a;
    --orange-light: #fdf0e8;
    --orange-hover: #d0541a;
    --green: #3a7d44;
    --green-light: #edf5ef;
    --text: #1c1c1a;
    --text-soft: #5a5a55;
    --text-muted: #9a9a95;
    --border: #e8e4de;
    --bg: #f9f9f7;
  }

  .pl-root {
    font-family: 'DM Sans', sans-serif;
  }

  .pl-root * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* GRID */
  .pl-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
  }

  /* CARD */
  .pl-card {
    background: var(--white);
    border: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }

  .pl-card:hover {
    box-shadow: 0 6px 24px rgba(26,26,24,0.09);
    transform: translateY(-2px);
  }

  /* IMAGE */
  .pl-img-wrap {
    width: 100%;
    height: 200px;
    overflow: hidden;
    background: var(--bg);
    flex-shrink: 0;
  }

  .pl-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.35s ease;
  }

  .pl-card:hover .pl-img {
    transform: scale(1.04);
  }

  /* BODY */
  .pl-body {
    padding: 1rem 1.1rem 1.25rem;
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 0.5rem;
  }

  .pl-name {
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text);
    text-decoration: none;
    line-height: 1.3;
    transition: color 0.2s;
  }

  .pl-name:hover {
    color: var(--orange);
  }

  .pl-desc {
    font-size: 0.82rem;
    font-weight: 300;
    color: var(--text-soft);
    line-height: 1.55;
    flex: 1;
  }

  .pl-price {
    font-size: 1.05rem;
    font-weight: 500;
    color: var(--green);
  }

  /* BUTTONS */
  .pl-btn-add {
    margin-top: 0.25rem;
    width: 100%;
    padding: 0.65rem 1rem;
    background: var(--orange);
    color: var(--white);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: 1px solid var(--orange);
    cursor: pointer;
    transition: background 0.2s ease, border-color 0.2s ease;
  }

  .pl-btn-add:hover:not(:disabled) {
    background: var(--orange-hover);
    border-color: var(--orange-hover);
  }

  .pl-btn-add:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .pl-btn-oos {
    margin-top: 0.25rem;
    width: 100%;
    padding: 0.65rem 1rem;
    background: var(--bg);
    color: var(--text-muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: 1px solid var(--border);
    cursor: not-allowed;
  }

  /* ADDED BADGE */
  .pl-added {
    margin-top: 0.4rem;
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--green);
    text-align: center;
  }
`;

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
      if (!res.ok) {
        setLoadingId(null);
        return;
      }
      setCartCount(cartCount + 1);
      setAddedId(product._id);
      setTimeout(() => {
        setAddedId(null);
      }, 1500);
    } catch (error) {
      console.error("Add to cart failed");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <section className="pl-root">
        <div className="pl-grid">
          {products.map((product) => (
            <div key={product._id} className="pl-card">

              {product.image && (
                <div className="pl-img-wrap">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="pl-img"
                  />
                </div>
              )}

              <div className="pl-body">
                <Link href={`/product/${product._id}`} className="pl-name">
                  {product.name}
                </Link>

                {product.description && (
                  <p className="pl-desc">{product.description}</p>
                )}

                <p className="pl-price">₹{product.price}</p>

                {product.stock <= 0 ? (
                  <button className="pl-btn-oos" disabled>
                    Out of Stock
                  </button>
                ) : (
                  <button
                    className="pl-btn-add"
                    onClick={() => handleAdd(product)}
                    disabled={loadingId === product._id}
                  >
                    {loadingId === product._id ? "Adding..." : "Add to Cart"}
                  </button>
                )}

                {addedId === product._id && (
                  <p className="pl-added">✓ Added</p>
                )}
              </div>

            </div>
          ))}
        </div>
      </section>
    </>
  );
}
