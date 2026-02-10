import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export default async function HomePage() {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;

  let user = null;

  if (token) {
    try {
      user = await verifyToken(token);
    } catch (err) {
      user = null;
    }
  }

  const isLoggedIn = !!user;

  return (
    <div>

      <section className="hero">
        <h1>Fresh Organic Products Delivered to Your Doorstep</h1>
        <p>Flat 30% OFF on first order</p>
      </section>

      <section className="products">
        <h2>Trending Products</h2>
        <div className="grid">
          {[1,2,3,4].map((item) => (
            <div key={item} className="product-card">
              <div className="image-placeholder"></div>
              <h3>Organic Product {item}</h3>
              <p>₹299</p>
              <button>Add to Cart</button>
            </div>
          ))}
        </div>
      </section>

    </div>

  );
}

