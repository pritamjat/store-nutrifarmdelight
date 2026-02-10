"use client";

export default function ProductList() {

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
        {[1,2,3,4].map((item) => (
          <div key={item} className="product-card">
            <div className="image-placeholder"></div>
            <h3>Organic Product {item}</h3>
            <p>₹299</p>
            <button
              onClick={() =>
                handleAdd({
                  productId: item,
                  name: `Organic Product ${item}`,
                  price: 299
                })
              }
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

