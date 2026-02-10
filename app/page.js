import Link from "next/link";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export default function HomePage() {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;

  let user = null;

  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      user = null;
    }
  }

  const isLoggedIn = !!user;

  return (
    <div className="home">

      {/* ===== NAVBAR ===== */}
      <header className="navbar">
        <div className="logo">
          <Link href="/">NutriFarm</Link>
        </div>

        <div className="search">
          <input type="text" placeholder="Search for products..." />
        </div>

        <div className="nav-right">
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="btn">Login</Link>
              <Link href="/register" className="btn primary">Create Account</Link>
            </>
          ) : (
            <>
              <span style={{ color: "white", marginRight: "10px" }}>
                👤 {user.name}
              </span>
              <Link href="/cart" className="btn">Cart 🛒</Link>
            </>
          )}
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <h1>Fresh Organic Products Delivered to Your Doorstep</h1>
        <p>Flat 30% OFF on first order</p>
        <Link href="/products" className="btn primary">Shop Now</Link>
      </section>

      {/* ===== PRODUCT GRID ===== */}
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
