import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import ProductList from "@/app/components/ProductList";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --white: #ffffff;
    --orange: #e8621a;
    --orange-light: #fdf0e8;
    --green: #3a7d44;
    --green-light: #edf5ef;
    --text: #1c1c1a;
    --text-soft: #5a5a55;
    --border: #e8e4de;
    --bg: #f9f9f7;
  }

  .home-root {
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    min-height: 100vh;
  }

  .home-root * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* HERO */
  .home-hero {
    background: #6fac85;
    border-bottom: 1px solid var(--border);
    padding: 4rem 2rem;
    text-align: center;
  }

  .home-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 4vw, 3rem);
    font-weight: 600;
    color: var(--text);
    line-height: 1.25;
    max-width: 640px;
    margin: 0 auto;
  }

  .home-hero h1 .orange { color: var(--orange); }
  .home-hero h1 .green  { color: var(--green);  }

  /* PRODUCTS SECTION */
  .home-products {
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 2rem 5rem;
  }

  .home-products-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .home-products-header-line {
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .home-products-header-tag {
    background: var(--orange-light);
    border: 1px solid var(--orange);
    color: var(--orange);
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0.3rem 0.85rem;
    white-space: nowrap;
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

        <section className="home-hero">
          <h1>
            Fresh <span className="green">Organic</span> Products Delivered to Your <span className="orange">Doorstep</span>
          </h1>
        </section>

        <section className="home-products">
          <div className="home-products-header">
            <div className="home-products-header-line" />
            <span className="home-products-header-tag">Products</span>
            <div className="home-products-header-line" />
          </div>
          <ProductList />
        </section>

      </div>
    </>
  );
}
