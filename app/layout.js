import "./globals.css";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import ProfileDropdown from "@/app/components/ProfileDropdown";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { CartProvider } from "@/app/context/CartContext";
import CartIcon from "@/app/components/CartIcon";





export default async function RootLayout({ children }) {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;

  let user = null;
  let cartCount = 0;

  // ✅ First verify user
  if (token) {
    try {
      user = await verifyToken(token);
    } catch (err) {
      user = null;
    }
  }

  // ✅ Then fetch cart if user exists
  if (user) {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    const dbUser = await users.findOne(
      { _id: new ObjectId(user.sub) },
      { projection: { cart: 1 } }
    );

    if (dbUser?.cart) {
      cartCount = dbUser.cart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
    }
  }

  const isLoggedIn = !!user;

  return (
    <html lang="en">
    <body>
  <CartProvider initialCount={cartCount}>
    <header className="navbar">
      <div className="logo">
        <Link href="/">NutriFarm</Link>
      </div>

      <div className="search">
        <input type="text" placeholder="Search products..." />
      </div>

      <div className="nav-right">
        {!isLoggedIn ? (
          <>
            <Link href="/login" className="btn">Login</Link>
            <Link href="/register" className="btn primary">
              Create Account
            </Link>
          </>
        ) : (
          <>
            <ProfileDropdown name={user.name} />
            <CartIcon />
          </>
        )}
      </div>
    </header>

    {children}
  </CartProvider>
</body>

      
    </html>
  );
}

