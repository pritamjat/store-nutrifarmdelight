import "./globals.css";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import ProfileDropdown from "@/app/components/ProfileDropdown";


export default async function RootLayout({ children }) {
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
    <html lang="en">
      <body>

        {/* ===== GLOBAL NAVBAR ===== */}
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
               <Link href="/cart" className="btn">
                Cart 🛒
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Page Content */}
        {children}

      </body>
    </html>
  );
}
