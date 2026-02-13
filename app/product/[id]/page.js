import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import AddToCartButton from "./AddToCartButton";

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

  .pp-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    min-height: 100vh;
    padding: 3rem 2rem 5rem;
    color: var(--text);
  }

  .pp-root * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .pp-inner {
    max-width: 860px;
    margin: 0 auto;
    background: var(--white);
    border: 1px solid var(--border);
    box-shadow: 0 2px 8px rgba(26,26,24,0.04), 0 10px 32px rgba(26,26,24,0.07);
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
  }

  @media (max-width: 600px) {
    .pp-inner { grid-template-columns: 1fr; }
  }

  /* IMAGE */
  .pp-img-wrap {
    width: 100%;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    background: var(--bg);
  }

  .pp-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
  }

  .pp-img-wrap:hover .pp-img {
    transform: scale(1.04);
  }

  /* DETAILS */
  .pp-details {
    padding: 2.5rem 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    border-left: 1px solid var(--border);
  }

  @media (max-width: 600px) {
    .pp-details { border-left: none; border-top: 1px solid var(--border); }
  }

  .pp-eyebrow {
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--orange);
  }

  .pp-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--text);
    line-height: 1.2;
  }

  .pp-desc {
    font-size: 0.9rem;
    font-weight: 300;
    color: var(--text-soft);
    line-height: 1.7;
  }

  .pp-divider {
    height: 1px;
    background: var(--border);
  }

  .pp-price {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--green);
  }
`;

export default async function ProductPage({ params }) {
  const client = await clientPromise;
  const db = client.db();
  const products = db.collection("products");
  const product = await products.findOne({
    _id: new ObjectId(params.id),
  });

  if (!product) {
    notFound();
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="pp-root">
        <div className="pp-inner">

          <div className="pp-img-wrap">
            <img
              className="pp-img"
              src={product.image}
              alt={product.name}
            />
          </div>

          <div className="pp-details">
            <p className="pp-eyebrow">Product</p>
            <h1 className="pp-name">{product.name}</h1>
            <p className="pp-desc">{product.description}</p>
            <div className="pp-divider" />
            <p className="pp-price">₹{product.price}</p>
            <AddToCartButton product={product} />
          </div>

        </div>
      </div>
    </>
  );
}
