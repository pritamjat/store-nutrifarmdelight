import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import ProductList from "@/app/components/ProductList";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --cream: #faf7f2;
    --cream-dark: #f0ebe2;
    --ink: #1a1a18;
    --ink-soft: #4a4a45;
    --gold: #c9a84c;
    --gold-light: #e8d5a3;
    --gold-pale: #f5efd8;
    --rust: #b85c38;
    --border: #e0d8cc;
    --white: #ffffff;
    --green: #3d5c3a;
  }

  .home-root {
    background-color: var(--cream);
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
    min-height: 100vh;
  }

  .home-root * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* ── NAVBAR ─────────────────────────────────────── */
  .home-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(250,247,242,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 0 2.5rem;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .home-nav-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--ink);
    letter-spacing: 0.02em;
  }

  .home-nav-logo span {
    color: var(--gold);
  }

  .home-nav-links {
    display: flex;
    align-items: center;
    gap: 2rem;
    list-style: none;
  }

  .home-nav-links a {
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-soft);
    text-decoration: none;
    transition: color 0.2s;
  }

  .home-nav-links a:hover {
    color: var(--gold);
  }

  /* ── HERO ────────────────────────────────────────── */
  .home-hero {
    position: relative;
    overflow: hidden;
    padding: 6rem 2.5rem 5rem;
    background-color: var(--cream);
    background-image:
      radial-gradient(ellipse at 70% 60%, rgba(201,168,76,0.12) 0%, transparent 55%),
      radial-gradient(ellipse at 15% 30%, rgba(61,92,58,0.07) 0%, transparent 50%);
  }

  /* large decorative text behind headline */
  .home-hero-bg-word {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Playfair Display', serif;
    font-size: clamp(8rem, 18vw, 18rem);
    font-weight: 600;
    color: transparent;
    -webkit-text-stroke: 1px rgba(201,168,76,0.12);
    white-space: nowrap;
    pointer-events: none;
    user-select: none;
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .home-hero-inner {
    position: relative;
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: end;
    gap: 3rem;
  }

  .home-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--gold-pale);
    border: 1px solid var(--gold-light);
    padding: 0.35rem 0.85rem;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--green);
    margin-bottom: 1.5rem;
    animation: fadeUp 0.6s ease both;
  }

  .home-hero-badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--green);
    flex-shrink: 0;
  }

  .home-hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.4rem, 5vw, 4rem);
    font-weight: 600;
    line-height: 1.15;
    color: var(--ink);
    letter-spacing: -0.01em;
    max-width: 680px;
    animation: fadeUp 0.6s 0.1s ease both;
  }

  .home-hero-title em {
    font-style: italic;
    color: var(--gold);
  }

  .home-hero-sub {
    margin-top: 1.25rem;
    font-size: 1rem;
    font-weight: 300;
    color: var(--ink-soft);
    max-width: 480px;
    line-height: 1.7;
    animation: fadeUp 0.6s 0.2s ease both;
  }

  .home-hero-cta-row {
    margin-top: 2.25rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    animation: fadeUp 0.6s 0.3s ease both;
  }

  .home-hero-btn {
    display: inline-block;
    padding: 0.85rem 2rem;
    background: var(--ink);
    color: var(--cream);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    text-decoration: none;
    border: 1px solid var(--ink);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: color 0.25s ease, border-color 0.25s ease;
  }

  .home-hero-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gold);
    transform: translateX(-101%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .home-hero-btn:hover::before { transform: translateX(0); }
  .home-hero-btn:hover { color: var(--ink); border-color: var(--gold); }

  .home-hero-btn span { position: relative; z-index: 1; }

  .home-hero-link {
    font-size: 0.82rem;
    font-weight: 400;
    color: var(--ink-soft);
    text-decoration: none;
    border-bottom: 1px solid var(--border);
    padding-bottom: 1px;
    transition: color 0.2s, border-color 0.2s;
  }

  .home-hero-link:hover { color: var(--ink); border-color: var(--gold); }

  /* stats pills */
  .home-hero-stats {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    animation: fadeUp 0.6s 0.4s ease both;
  }

  .home-hero-stat {
    background: var(--white);
    border: 1px solid var(--border);
    padding: 1rem 1.4rem;
    text-align: center;
    min-width: 110px;
    box-shadow: 0 2px 12px rgba(26,26,24,0.05);
  }

  .home-hero-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--ink);
    display: block;
    line-height: 1;
  }

  .home-hero-stat-label {
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-soft);
    margin-top: 0.3rem;
    display: block;
  }

  /* ── DIVIDER STRIP ───────────────────────────────── */
  .home-strip {
    background: var(--ink);
    padding: 1rem 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    overflow: hidden;
  }

  .home-strip-item {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--gold-light);
    white-space: nowrap;
  }

  .home-strip-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--gold);
    flex-shrink: 0;
  }

  /* ── PRODUCTS SECTION ────────────────────────────── */
  .home-products {
    max-width: 1200px;
    margin: 0 auto;
    padding: 5rem 2.5rem 6rem;
  }

  .home-products-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 3rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border);
  }

  .home-products-eyebrow {
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 0.5rem;
  }

  .home-products-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--ink);
    line-height: 1.2;
  }

  .home-products-count {
    font-size: 0.8rem;
    font-weight: 300;
    color: var(--ink-soft);
  }

  /* ── KEYFRAMES ───────────────────────────────────── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── RESPONSIVE ──────────────────────────────────── */
  @media (max-width: 768px) {
    .home-hero-inner {
      grid-template-columns: 1fr;
    }
    .home-hero-stats {
      flex-direction: row;
    }
    .home-strip {
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .home-nav-links {
      display: none;
    }
    .home-products-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }
`;

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

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="home-root">

        {/* Navbar */}
        <nav className="home-nav">
          <span className="home-nav-logo">terra<span>.</span>market</span>
          <ul className="home-nav-links">
            <li><a href="#">Shop</a></li>
            <li><a href="#">Seasonal</a></li>
            <li><a href="#">About</a></li>
            {user
              ? <li><a href="/account">Account</a></li>
              : <li><a href="/login">Sign in</a></li>
            }
          </ul>
        </nav>

        {/* Hero */}
        <section className="home-hero">
          <div className="home-hero-bg-word" aria-hidden="true">Organic</div>
          <div className="home-hero-inner">
            <div>
              <div className="home-hero-badge">
                <span className="home-hero-badge-dot" />
                Farm to doorstep
              </div>
              <h1 className="home-hero-title">
                Fresh <em>Organic</em> Products<br />
                Delivered to Your Doorstep
              </h1>
              <p className="home-hero-sub">
                Sourced directly from local farms. No middlemen, no preservatives —
                just honest food the way nature intended it.
              </p>
              <div className="home-hero-cta-row">
                <a href="#products" className="home-hero-btn">
                  <span>Shop Now</span>
                </a>
                <a href="#" className="home-hero-link">How it works →</a>
              </div>
            </div>

            <div className="home-hero-stats">
              <div className="home-hero-stat">
                <span className="home-hero-stat-num">200+</span>
                <span className="home-hero-stat-label">Products</span>
              </div>
              <div className="home-hero-stat">
                <span className="home-hero-stat-num">48h</span>
                <span className="home-hero-stat-label">Delivery</span>
              </div>
              <div className="home-hero-stat">
                <span className="home-hero-stat-num">100%</span>
                <span className="home-hero-stat-label">Organic</span>
              </div>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <div className="home-strip" aria-hidden="true">
          <span className="home-strip-item"><span className="home-strip-dot" />Free shipping over ₹499</span>
          <span className="home-strip-item"><span className="home-strip-dot" />Certified organic</span>
          <span className="home-strip-item"><span className="home-strip-dot" />Next-day delivery</span>
          <span className="home-strip-item"><span className="home-strip-dot" />Easy returns</span>
        </div>

        {/* Products */}
        <section id="products" className="home-products">
          <div className="home-products-header">
            <div>
              <p className="home-products-eyebrow">This season</p>
              <h2 className="home-products-title">Fresh Arrivals</h2>
            </div>
            <span className="home-products-count">Showing all products</span>
          </div>
          <ProductList />
        </section>

      </div>
    </>
  );
}
