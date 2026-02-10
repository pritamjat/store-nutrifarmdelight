import Link from "next/link";

export default function HomePage() {
  const isLoggedIn = false; // later replace with auth check

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
              <Link href="/profile">Profile</Link>
              <Link href="/cart">Cart 🛒</Link>
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
