import Link from 'next/link';

const HOME_CART_ITEMS = [
  { id: 'hc-1', name: 'Organic Almond Granola', qty: 1, price: 349 },
  { id: 'hc-2', name: 'Protein Millet Cookies', qty: 2, price: 249 }
];

export default function HomePage() {
  const subtotal = HOME_CART_ITEMS.reduce((sum, item) => sum + item.qty * item.price, 0);
  const delivery = 49;
  const total = subtotal + delivery;

  return (
    <main className="home-shell">
      <section className="home-hero">
        <div className="hero-left">
          <p className="eyebrow">NutriFarm Delight Marketplace</p>
          <h1>Your healthy eCommerce destination</h1>
          <p className="subtle">
            Browse fresh farm products, manage cart and checkout with Razorpay, and track your orders and
            payment history in one place.
          </p>
          <div className="actions">
            <Link href="/login" className="cta-primary">
              Sign in
            </Link>
            <Link href="/register" className="cta-secondary">
              Create account
            </Link>
          </div>
        </div>

        <aside className="hero-cart-preview">
          <h2>Cart Preview</h2>
          <p className="subtle">Items waiting in your basket</p>
          <div className="list">
            {HOME_CART_ITEMS.map((item) => (
              <div key={item.id} className="list-row">
                <div>
                  <strong>{item.name}</strong>
                  <p>Qty: {item.qty}</p>
                </div>
                <strong>₹{item.qty * item.price}</strong>
              </div>
            ))}
          </div>
          <div className="summary-box">
            <p>
              <span>Subtotal</span>
              <strong>₹{subtotal}</strong>
            </p>
            <p>
              <span>Delivery</span>
              <strong>₹{delivery}</strong>
            </p>
            <hr />
            <p>
              <span>Total</span>
              <strong>₹{total}</strong>
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
