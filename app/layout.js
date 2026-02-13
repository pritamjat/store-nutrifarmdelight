import "./globals.css";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import ProfileDropdown from "@/app/components/ProfileDropdown";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { CartProvider } from "@/app/context/CartContext";
import CartIcon from "@/app/components/CartIcon";

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
    --border: #e8e4de;
    --bg: #f9f9f7;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
  }

  /* ── NAVBAR ── */
  .navbar {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--white);
    border-bottom: 1px solid var(--border);
    height: 64px;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  /* LOGO */
  .logo a {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    font-weight: 600;
    text-decoration: none;
    letter-spacing: 0.01em;
    white-space: nowrap;
  }

  .logo-n  { color: var(--orange); }
  .logo-u  { color: var(--green);  }
  .logo-r  { color: var(--green);  }
  .logo-t  { color: var(--green);  }
  .logo-i  { color: var(--green);  }
  .logo-f  { color: var(--green);  }
  .logo-a  { color: var(--green);  }
  .logo-r2 { color: var(--green);  }
  .logo-m  { color: var(--green);  }
  .logo-d  { color: var(--orange); }
  .logo-e  { color: var(--green);  }
  .logo-l  { color: var(--green);  }
  .logo-i2 { color: var(--green);  }
  .logo-g  { color: var(--green);  }
  .logo-h  { color: var(--green);  }
  .logo-t2 { color: var(--green);  }

  /* SEARCH */
  .search {
    flex: 1;
    max-width: 420px;
    margin: 0 auto;
  }

  .search input {
    width: 100%;
    padding: 0.55rem 1rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    font-weight: 300;
    color: var(--text);
    background: var(--bg);
    border: 1px solid var(--border);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .search input::placeholder { color: #b0ada8; }

  .search input:focus {
    border-color: var(--orange);
    box-shadow: 0 0 0 3px rgba(232,98,26,0.1);
    background: var(--white);
  }

  /* NAV RIGHT */
  .nav-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-left: auto;
  }

  .btn {
    padding: 0.5rem 1.1rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    border: 1px solid var(--border);
    background: var(--white);
    color: var(--text-soft);
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
  }

  .btn:hover {
    border-color: var(--green);
    color: var(--green);
  }

  .btn.primary {
    background: var(--orange);
    border-color: var(--orange);
    color: var(--white);
  }

  .btn.primary:hover {
    background: var(--orange-hover);
    border-color: var(--orange-hover);
    color: var(--white);
  }
`;

export default async function RootLayout({ children }) {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;
  let user = null;
  let cartCount = 0;

  if (token) {
    try {
      user = await verifyToken(token);
    } catch (err) {
      user = null;
    }
  }

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
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <CartProvider initialCount={cartCount}>
          <header className="navbar">

            <div className="logo">
              <Link href="/">
                <span className="logo-n">N</span>
                <span className="logo-u">u</span>
                <span className="logo-r">t</span>
                <span className="logo-t">r</span>
                <span className="logo-i">i</span>
                <span className="logo-f">f</span>
                <span className="logo-a">a</span>
                <span className="logo-r2">r</span>
                <span className="logo-m">m</span>
                <span className="logo-d">D</span>
                <span className="logo-e">e</span>
                <span className="logo-l">l</span>
                <span className="logo-i2">i</span>
                <span className="logo-g">g</span>
                <span className="logo-h">h</span>
                <span className="logo-t2">t</span>
              </Link>
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
