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
    <div className="home">

      {/* NAVBAR */}
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
              <span style={{ marginRight: "10px" }}>
                👤 {user.name}
              </span>
              <Link href="/cart" className="btn">Cart 🛒</Link>
            </>
          )}
        </div>
      </header>

      <section className="hero">
        <h1>Fresh Organic Products Delivered to Your Doorstep</h1>
        <p>Flat 30% OFF on first order</p>
        <Link href="/products" className="btn primary">Shop Now</Link>
      </section>

    </div>
  );
}

